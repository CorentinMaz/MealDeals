"use server";

import { revalidatePath } from "next/cache";
import { getServerLocale } from "@/lib/i18n/server";
import {
  syncPromotions,
  toggleStore,
  updateNutritionGoals,
  updatePostalCode,
  updatePreferences,
} from "@mealdeals/api";

export async function toggleStoreAction(storeId: string, enabled: boolean) {
  await toggleStore(storeId, enabled);

  revalidatePath("/parametres");
  revalidatePath("/promotions");
  revalidatePath("/");
}

export async function updatePostalCodeAction(postalCode: string) {
  await updatePostalCode(postalCode);

  revalidatePath("/parametres");
  revalidatePath("/promotions");
}

export async function syncPromotionsAction() {
  const locale = await getServerLocale();
  const results = await syncPromotions(locale);

  revalidatePath("/promotions");
  revalidatePath("/");

  return results;
}

export async function updatePreferencesAction(input: {
  allergies: string[];
  diets: string[];
  likedFoods: string[];
  dislikedFoods: string[];
  maxPrepMinutes: number;
  weeklyBudget: number;
}) {
  await updatePreferences(input);

  revalidatePath("/parametres");
}

export async function updateNutritionGoalsAction(input: {
  nutritionMode: string;
  fitnessGoal: string | null;
  dailyCalorieTarget: number | null;
  activityGym: boolean;
  activityRunning: boolean;
  gymSessionsPerWeek: number | null;
  runningSessionsPerWeek: number | null;
}) {
  await updateNutritionGoals(input);

  revalidatePath("/parametres");
  revalidatePath("/recettes");
}
