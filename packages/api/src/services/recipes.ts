import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import {
  groceryStores,
  households,
  recipePlans,
  recipes,
  shoppingLists,
  userPreferences,
} from "../db/schema";
import { createAppError } from "../errors";
import { generateRecipesFromPromotions } from "./ai/recipe-generator";
import { bindIngredientsToActivePromotions } from "./promotions/match-ingredient";
import { getActivePromotions } from "./promotions/sync-service";
import {
  getHouseholdWithPreferences,
  getSavedRecipesForGeneration,
} from "../queries";
import { buildShoppingList } from "./shopping-list/generator";

export async function generateRecipePlan(recipeCount: number) {
  const household = await getHouseholdWithPreferences();

  if (!household?.preferences) {
    throw createAppError("PREFERENCES_NOT_FOUND");
  }

  const [activePromotions, savedRecipes] = await Promise.all([
    getActivePromotions(),
    getSavedRecipesForGeneration(),
  ]);

  if (activePromotions.length === 0) {
    throw createAppError("NO_ACTIVE_PROMOTIONS");
  }

  const generated = await generateRecipesFromPromotions({
    recipeCount,
    promotions: activePromotions,
    preferences: household.preferences,
    savedRecipes,
  });

  const storeNames = Object.fromEntries(
    activePromotions.map((promotion) => [
      promotion.store.slug,
      promotion.store.name,
    ]),
  );

  const enrichedRecipes = generated.recipes.map((recipe) => ({
    ...recipe,
    ingredients: bindIngredientsToActivePromotions(
      recipe.ingredients,
      activePromotions,
    ),
  }));

  const planId = createId();

  return db.transaction(async (tx) => {
    await tx.insert(recipePlans).values({
      id: planId,
      householdId: "default",
      recipeCount,
      status: "generated",
    });

    if (enrichedRecipes.length > 0) {
      await tx.insert(recipes).values(
        enrichedRecipes.map((recipe) => ({
          planId,
          name: recipe.name,
          description: recipe.description,
          prepMinutes: recipe.prepMinutes,
          difficulty: recipe.difficulty,
          estimatedCost: recipe.estimatedCost.toString(),
          calories: recipe.calories,
          proteinG: recipe.proteinG?.toString(),
          carbsG: recipe.carbsG?.toString(),
          fatG: recipe.fatG?.toString(),
          ingredients: recipe.ingredients,
          steps: recipe.steps,
        })),
      );
    }

    await tx.insert(shoppingLists).values({
      planId,
      items: buildShoppingList(enrichedRecipes, storeNames),
    });

    return tx.query.recipePlans.findFirst({
      where: eq(recipePlans.id, planId),
      with: {
        recipes: true,
        shoppingList: true,
      },
    });
  });
}

export async function toggleRecipeFavorite(
  recipeId: string,
  isFavorite: boolean,
) {
  const [recipe] = await db
    .update(recipes)
    .set({ isFavorite })
    .where(eq(recipes.id, recipeId))
    .returning({ planId: recipes.planId });

  return recipe?.planId;
}

export async function toggleRecipeMakeRegularly(
  recipeId: string,
  makeRegularly: boolean,
) {
  const [recipe] = await db
    .update(recipes)
    .set({
      makeRegularly,
      ...(makeRegularly ? { isFavorite: true } : {}),
    })
    .where(eq(recipes.id, recipeId))
    .returning({ planId: recipes.planId });

  return recipe?.planId;
}

export async function toggleRecipeSelection(
  recipeId: string,
  selected: boolean,
) {
  const [recipe] = await db
    .update(recipes)
    .set({ selected })
    .where(eq(recipes.id, recipeId))
    .returning({ planId: recipes.planId });

  return recipe?.planId;
}
