"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { syncAllEnabledStores } from "@/lib/promotions/sync-service";

export async function toggleStoreAction(storeId: string, enabled: boolean) {
  await db.groceryStore.update({
    where: { id: storeId },
    data: { enabled },
  });

  revalidatePath("/parametres");
  revalidatePath("/promotions");
  revalidatePath("/");
}

export async function updatePostalCodeAction(postalCode: string) {
  const normalized = postalCode.replace(/\s/g, "").toUpperCase();

  await db.household.upsert({
    where: { id: "default" },
    create: { id: "default", postalCode: normalized },
    update: { postalCode: normalized },
  });

  revalidatePath("/parametres");
  revalidatePath("/promotions");
}

export async function syncPromotionsAction() {
  const household = await db.household.findUnique({
    where: { id: "default" },
  });

  const postalCode = household?.postalCode ?? "G1V4P3";
  const results = await syncAllEnabledStores(postalCode);

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
  await db.household.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      preferences: { create: input },
    },
    update: {
      preferences: {
        upsert: {
          create: input,
          update: input,
        },
      },
    },
  });

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
  await db.household.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      preferences: { create: input },
    },
    update: {
      preferences: {
        upsert: {
          create: input,
          update: input,
        },
      },
    },
  });

  revalidatePath("/parametres");
  revalidatePath("/recettes");
}
