import { and, asc, count, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import {
  groceryStores,
  households,
  promotionSyncLogs,
  promotions,
  recipePlans,
  recipes,
} from "../db/schema";
import { serializeUserPreferences } from "../preferences/serialize";

const DEFAULT_HOUSEHOLD_ID = "default";

function activePromotionConditions(now: Date) {
  return and(
    eq(promotions.isFood, true),
    lte(promotions.validFrom, now),
    gte(promotions.validTo, now),
    eq(groceryStores.enabled, true),
  );
}

export async function getDashboardData() {
  const now = new Date();

  const [stores, promotionCountResult, latestPlan, latestSync, planCountResult] =
    await Promise.all([
      db.query.groceryStores.findMany({
        orderBy: [asc(groceryStores.sortOrder)],
      }),
      db
        .select({ count: count() })
        .from(promotions)
        .innerJoin(groceryStores, eq(promotions.storeId, groceryStores.id))
        .where(activePromotionConditions(now)),
      db.query.recipePlans.findFirst({
        where: eq(recipePlans.householdId, DEFAULT_HOUSEHOLD_ID),
        orderBy: [desc(recipePlans.createdAt)],
        with: { recipes: true },
      }),
      db.query.promotionSyncLogs.findFirst({
        orderBy: [desc(promotionSyncLogs.syncedAt)],
        with: { store: true },
      }),
      db
        .select({ count: count() })
        .from(recipePlans)
        .where(eq(recipePlans.householdId, DEFAULT_HOUSEHOLD_ID)),
    ]);

  const household = await db.query.households.findFirst({
    where: eq(households.id, DEFAULT_HOUSEHOLD_ID),
  });

  return {
    stores,
    promotionCount: promotionCountResult[0]?.count ?? 0,
    enabledStoreCount: stores.filter((store) => store.enabled).length,
    latestPlan,
    latestSync,
    postalCode: household?.postalCode ?? "G1V4P3",
    planCount: planCountResult[0]?.count ?? 0,
  };
}

export async function getPromotionsPageData() {
  const now = new Date();

  const [stores, promotionRows] = await Promise.all([
    db.query.groceryStores.findMany({
      orderBy: [asc(groceryStores.sortOrder)],
    }),
    db
      .select({ promotion: promotions, store: groceryStores })
      .from(promotions)
      .innerJoin(groceryStores, eq(promotions.storeId, groceryStores.id))
      .where(activePromotionConditions(now))
      .orderBy(asc(groceryStores.sortOrder), asc(promotions.name)),
  ]);

  return {
    stores,
    promotions: promotionRows.map((row) => ({
      ...row.promotion,
      store: row.store,
    })),
  };
}

export async function getSettingsData() {
  const [stores, household] = await Promise.all([
    db.query.groceryStores.findMany({
      orderBy: [asc(groceryStores.sortOrder)],
    }),
    db.query.households.findFirst({
      where: eq(households.id, DEFAULT_HOUSEHOLD_ID),
      with: { preferences: true },
    }),
  ]);

  return {
    stores,
    household: household
      ? {
          ...household,
          preferences: household.preferences
            ? serializeUserPreferences(household.preferences)
            : null,
        }
      : null,
  };
}

export async function getRecipePlan(planId: string) {
  return db.query.recipePlans.findFirst({
    where: eq(recipePlans.id, planId),
    with: {
      recipes: {
        orderBy: [asc(recipes.createdAt)],
      },
      shoppingList: true,
    },
  });
}

export async function getRecipePlansHistory(limit?: number) {
  const plans = await db.query.recipePlans.findMany({
    where: eq(recipePlans.householdId, DEFAULT_HOUSEHOLD_ID),
    orderBy: [desc(recipePlans.createdAt)],
    limit,
    with: {
      recipes: {
        columns: {
          id: true,
          name: true,
          estimatedCost: true,
          isFavorite: true,
          makeRegularly: true,
        },
        orderBy: [asc(recipes.createdAt)],
      },
    },
  });

  return plans.map((plan) => ({
    ...plan,
    recipes: plan.recipes.map((recipe) => ({
      ...recipe,
      estimatedCost: Number(recipe.estimatedCost),
    })),
    _count: { recipes: plan.recipes.length },
  }));
}

export async function getSavedRecipes() {
  const rows = await db
    .select({ recipe: recipes, plan: recipePlans })
    .from(recipes)
    .innerJoin(recipePlans, eq(recipes.planId, recipePlans.id))
    .where(
      and(
        eq(recipePlans.householdId, DEFAULT_HOUSEHOLD_ID),
        or(eq(recipes.isFavorite, true), eq(recipes.makeRegularly, true)),
      ),
    )
    .orderBy(desc(recipes.makeRegularly), desc(recipes.createdAt));

  return rows.map((row) => ({
    ...row.recipe,
    plan: { id: row.plan.id, createdAt: row.plan.createdAt },
  }));
}

export async function getSavedRecipesForGeneration() {
  const householdCondition = eq(recipePlans.householdId, DEFAULT_HOUSEHOLD_ID);

  const [favorites, regulars] = await Promise.all([
    db
      .select({ recipe: recipes })
      .from(recipes)
      .innerJoin(recipePlans, eq(recipes.planId, recipePlans.id))
      .where(and(householdCondition, eq(recipes.isFavorite, true)))
      .orderBy(desc(recipes.createdAt))
      .limit(10),
    db
      .select({ recipe: recipes })
      .from(recipes)
      .innerJoin(recipePlans, eq(recipes.planId, recipePlans.id))
      .where(and(householdCondition, eq(recipes.makeRegularly, true)))
      .orderBy(desc(recipes.createdAt))
      .limit(8),
  ]);

  return {
    favorites: favorites.map((row) => row.recipe),
    regulars: regulars.map((row) => row.recipe),
  };
}

export async function getHouseholdWithPreferences() {
  return db.query.households.findFirst({
    where: eq(households.id, DEFAULT_HOUSEHOLD_ID),
    with: { preferences: true },
  });
}

export async function getHouseholdPostalCode() {
  const household = await db.query.households.findFirst({
    where: eq(households.id, DEFAULT_HOUSEHOLD_ID),
    columns: { postalCode: true },
  });

  return household?.postalCode ?? "G1V4P3";
}
