"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { parseAppError } from "@/lib/errors";
import type { ErrorCode, MessageParams } from "@/lib/i18n/types";
import {
  generateRecipePlan,
  toggleRecipeFavorite,
  toggleRecipeMakeRegularly,
  toggleRecipeSelection,
} from "@mealdeals/api";

export type GenerateRecipesResult = {
  error: { code: ErrorCode; params: MessageParams };
};

// Errors are returned, not thrown: production builds hide the message of
// errors thrown by server actions, so the client could not show the cause.
export async function generateRecipesAction(
  recipeCount: number,
): Promise<GenerateRecipesResult | void> {
  let plan: Awaited<ReturnType<typeof generateRecipePlan>> | undefined;
  try {
    plan = await generateRecipePlan(recipeCount);
  } catch (error) {
    console.error("[generateRecipesAction]", error);
    return {
      error: parseAppError(error) ?? { code: "GENERATION_ERROR", params: {} },
    };
  }

  if (!plan) {
    return { error: { code: "GENERATION_ERROR", params: {} } };
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
