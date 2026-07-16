import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { groceryStores, households, userPreferences } from "../db/schema";
import { getHouseholdPostalCode } from "../queries";
import { syncAllEnabledStores } from "./promotions/sync-service";
import type { Locale } from "../types";

export async function toggleStore(storeId: string, enabled: boolean) {
  await db
    .update(groceryStores)
    .set({ enabled })
    .where(eq(groceryStores.id, storeId));
}

export async function updatePostalCode(postalCode: string) {
  const normalized = postalCode.replace(/\s/g, "").toUpperCase();

  await db
    .insert(households)
    .values({ id: "default", postalCode: normalized })
    .onConflictDoUpdate({
      target: households.id,
      set: { postalCode: normalized },
    });
}

export async function syncPromotions(locale: Locale) {
  const postalCode = await getHouseholdPostalCode();
  return syncAllEnabledStores(postalCode, locale);
}

type PreferencesInput = {
  allergies: string[];
  diets: string[];
  likedFoods: string[];
  dislikedFoods: string[];
  maxPrepMinutes: number;
  weeklyBudget: number;
};

type NutritionGoalsInput = {
  nutritionMode: string;
  fitnessGoal: string | null;
  dailyCalorieTarget: number | null;
  activityGym: boolean;
  activityRunning: boolean;
  gymSessionsPerWeek: number | null;
  runningSessionsPerWeek: number | null;
};

async function ensureHousehold() {
  await db
    .insert(households)
    .values({ id: "default" })
    .onConflictDoNothing();
}

export async function updatePreferences(input: PreferencesInput) {
  await ensureHousehold();

  await db
    .insert(userPreferences)
    .values({
      householdId: "default",
      ...input,
      weeklyBudget: input.weeklyBudget.toString(),
    })
    .onConflictDoUpdate({
      target: userPreferences.householdId,
      set: {
        ...input,
        weeklyBudget: input.weeklyBudget.toString(),
      },
    });
}

export async function updateNutritionGoals(input: NutritionGoalsInput) {
  await ensureHousehold();

  await db
    .insert(userPreferences)
    .values({
      householdId: "default",
      allergies: [],
      diets: [],
      likedFoods: [],
      dislikedFoods: [],
      maxPrepMinutes: 60,
      weeklyBudget: "150",
      ...input,
    })
    .onConflictDoUpdate({
      target: userPreferences.householdId,
      set: input,
    });
}
