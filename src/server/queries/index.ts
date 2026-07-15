import { db } from "@/lib/db";
import { serializeUserPreferences } from "@/lib/preferences/serialize";

function activePromotionWhere(now: Date) {
  return {
    isFood: true,
    validFrom: { lte: now },
    validTo: { gte: now },
    store: { enabled: true },
  };
}

export async function getDashboardData() {
  const now = new Date();

  const [stores, promotionCount, latestPlan, latestSync, planCount] =
    await Promise.all([
    db.groceryStore.findMany({ orderBy: { sortOrder: "asc" } }),
    db.promotion.count({
      where: activePromotionWhere(now),
    }),
    db.recipePlan.findFirst({
      where: { householdId: "default" },
      orderBy: { createdAt: "desc" },
      include: { recipes: true },
    }),
    db.promotionSyncLog.findFirst({
      orderBy: { syncedAt: "desc" },
      include: { store: true },
    }),
    db.recipePlan.count({ where: { householdId: "default" } }),
  ]);

  const household = await db.household.findUnique({
    where: { id: "default" },
  });

  return {
    stores,
    promotionCount,
    enabledStoreCount: stores.filter((store) => store.enabled).length,
    latestPlan,
    latestSync,
    postalCode: household?.postalCode ?? "G1V4P3",
    planCount,
  };
}

export async function getPromotionsPageData() {
  const now = new Date();

  const [stores, promotions] = await Promise.all([
    db.groceryStore.findMany({ orderBy: { sortOrder: "asc" } }),
    db.promotion.findMany({
      where: activePromotionWhere(now),
      include: { store: true },
      orderBy: [{ store: { sortOrder: "asc" } }, { name: "asc" }],
    }),
  ]);

  return { stores, promotions };
}

export async function getSettingsData() {
  const [stores, household] = await Promise.all([
    db.groceryStore.findMany({ orderBy: { sortOrder: "asc" } }),
    db.household.findUnique({
      where: { id: "default" },
      include: { preferences: true },
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
  return db.recipePlan.findUnique({
    where: { id: planId },
    include: {
      recipes: { orderBy: { createdAt: "asc" } },
      shoppingList: true,
    },
  });
}

export async function getRecipePlansHistory(limit?: number) {
  return db.recipePlan.findMany({
    where: { householdId: "default" },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
    include: {
      recipes: {
        select: {
          id: true,
          name: true,
          isFavorite: true,
          makeRegularly: true,
        },
      },
      _count: { select: { recipes: true } },
    },
  });
}

export async function getSavedRecipes() {
  return db.recipe.findMany({
    where: {
      plan: { householdId: "default" },
      OR: [{ isFavorite: true }, { makeRegularly: true }],
    },
    orderBy: [{ makeRegularly: "desc" }, { createdAt: "desc" }],
    include: {
      plan: { select: { id: true, createdAt: true } },
    },
  });
}

export async function getSavedRecipesForGeneration() {
  const [favorites, regulars] = await Promise.all([
    db.recipe.findMany({
      where: {
        plan: { householdId: "default" },
        isFavorite: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.recipe.findMany({
      where: {
        plan: { householdId: "default" },
        makeRegularly: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return { favorites, regulars };
}
