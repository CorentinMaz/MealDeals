"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAppError } from "@/lib/errors";
import { db } from "@/lib/db";
import { generateRecipesFromPromotions } from "@/lib/ai/recipe-generator";
import { bindIngredientsToActivePromotions } from "@/lib/promotions/match-ingredient";
import { getActivePromotions } from "@/lib/promotions/sync-service";
import { buildShoppingList } from "@/lib/shopping-list/generator";
import { getSavedRecipesForGeneration } from "@/server/queries";
import type { Prisma } from "@/generated/prisma/client";

export async function generateRecipesAction(recipeCount: number) {
  const household = await db.household.findUnique({
    where: { id: "default" },
    include: { preferences: true },
  });

  if (!household?.preferences) {
    throw createAppError("PREFERENCES_NOT_FOUND");
  }

  const [promotions, savedRecipes] = await Promise.all([
    getActivePromotions(),
    getSavedRecipesForGeneration(),
  ]);

  if (promotions.length === 0) {
    throw createAppError("NO_ACTIVE_PROMOTIONS");
  }

  const generated = await generateRecipesFromPromotions({
    recipeCount,
    promotions,
    preferences: household.preferences,
    savedRecipes,
  });

  const storeNames = Object.fromEntries(
    promotions.map((promotion) => [promotion.store.slug, promotion.store.name]),
  );

  const enrichedRecipes = generated.recipes.map((recipe) => ({
    ...recipe,
    ingredients: bindIngredientsToActivePromotions(
      recipe.ingredients,
      promotions,
    ),
  }));

  const plan = await db.recipePlan.create({
    data: {
      householdId: "default",
      recipeCount,
      status: "generated",
      recipes: {
        create: enrichedRecipes.map((recipe) => ({
          name: recipe.name,
          description: recipe.description,
          prepMinutes: recipe.prepMinutes,
          difficulty: recipe.difficulty,
          estimatedCost: recipe.estimatedCost,
          calories: recipe.calories,
          proteinG: recipe.proteinG,
          carbsG: recipe.carbsG,
          fatG: recipe.fatG,
          ingredients: recipe.ingredients as Prisma.InputJsonValue,
          steps: recipe.steps,
        })),
      },
      shoppingList: {
        create: {
          items: buildShoppingList(
            enrichedRecipes,
            storeNames,
          ) as unknown as Prisma.InputJsonValue,
        },
      },
    },
    include: {
      recipes: true,
      shoppingList: true,
    },
  });

  revalidatePath("/resultats");
  revalidatePath("/historique");
  redirect(`/resultats/${plan.id}`);
}

function revalidateRecipePaths(planId: string) {
  revalidatePath(`/resultats/${planId}`);
  revalidatePath("/historique");
}

export async function toggleRecipeFavoriteAction(
  recipeId: string,
  isFavorite: boolean,
) {
  const recipe = await db.recipe.update({
    where: { id: recipeId },
    data: { isFavorite },
    include: { plan: true },
  });

  revalidateRecipePaths(recipe.planId);
}

export async function toggleRecipeMakeRegularlyAction(
  recipeId: string,
  makeRegularly: boolean,
) {
  const recipe = await db.recipe.update({
    where: { id: recipeId },
    data: {
      makeRegularly,
      ...(makeRegularly ? { isFavorite: true } : {}),
    },
    include: { plan: true },
  });

  revalidateRecipePaths(recipe.planId);
}

export async function toggleRecipeSelectionAction(
  recipeId: string,
  selected: boolean,
) {
  const recipe = await db.recipe.update({
    where: { id: recipeId },
    data: { selected },
    include: { plan: true },
  });

  revalidatePath(`/resultats/${recipe.planId}`);
}
