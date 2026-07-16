"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAppError } from "@/lib/errors";
import {
  generateRecipePlan,
  toggleRecipeFavorite,
  toggleRecipeMakeRegularly,
  toggleRecipeSelection,
} from "@mealdeals/api";

export async function generateRecipesAction(recipeCount: number) {
  const plan = await generateRecipePlan(recipeCount);

  if (!plan) {
    throw createAppError("GENERATION_ERROR");
  }

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
  const planId = await toggleRecipeFavorite(recipeId, isFavorite);
  if (planId) {
    revalidateRecipePaths(planId);
  }
}

export async function toggleRecipeMakeRegularlyAction(
  recipeId: string,
  makeRegularly: boolean,
) {
  const planId = await toggleRecipeMakeRegularly(recipeId, makeRegularly);
  if (planId) {
    revalidateRecipePaths(planId);
  }
}

export async function toggleRecipeSelectionAction(
  recipeId: string,
  selected: boolean,
) {
  const planId = await toggleRecipeSelection(recipeId, selected);
  if (planId) {
    revalidatePath(`/resultats/${planId}`);
  }
}
