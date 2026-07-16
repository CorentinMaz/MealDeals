import type { UserPreferences } from "@/generated/prisma/client";
import type { SerializedUserPreferences } from "@/lib/preferences/serialize";

export const NUTRITION_MODES = ["recipes_only", "guided"] as const;
export type NutritionMode = (typeof NUTRITION_MODES)[number];

export const FITNESS_GOALS = ["bulking", "cutting", "maintenance"] as const;
export type FitnessGoal = (typeof FITNESS_GOALS)[number];

export const NUTRITION_MODE_LABELS: Record<NutritionMode, string> = {
  recipes_only: "Recettes seulement",
  guided: "Objectifs nutritionnels",
};

export const FITNESS_GOAL_LABELS: Record<FitnessGoal, string> = {
  bulking: "Prise de masse",
  cutting: "Perte de poids",
  maintenance: "Maintien",
};

export const FITNESS_GOAL_DESCRIPTIONS: Record<FitnessGoal, string> = {
  bulking:
    "Repas plus caloriques, riches en protéines et glucides pour soutenir la croissance musculaire.",
  cutting:
    "Repas plus légers, rassasiants et riches en protéines pour préserver la masse musculaire.",
  maintenance:
    "Un équilibre pour maintenir ton poids actuel.",
};

export interface NutritionProfileInput {
  nutritionMode: NutritionMode;
  fitnessGoal: FitnessGoal | null;
  dailyCalorieTarget: number | null;
  activityGym: boolean;
  activityRunning: boolean;
  gymSessionsPerWeek: number | null;
  runningSessionsPerWeek: number | null;
}

export function nutritionProfileFromPreferences(
  preferences: UserPreferences | SerializedUserPreferences,
): NutritionProfileInput {
  return {
    nutritionMode: isNutritionMode(preferences.nutritionMode)
      ? preferences.nutritionMode
      : "recipes_only",
    fitnessGoal: isFitnessGoal(preferences.fitnessGoal)
      ? preferences.fitnessGoal
      : null,
    dailyCalorieTarget: preferences.dailyCalorieTarget,
    activityGym: preferences.activityGym,
    activityRunning: preferences.activityRunning,
    gymSessionsPerWeek: preferences.gymSessionsPerWeek,
    runningSessionsPerWeek: preferences.runningSessionsPerWeek,
  };
}

export function isNutritionMode(value: string): value is NutritionMode {
  return (NUTRITION_MODES as readonly string[]).includes(value);
}

export function isFitnessGoal(value: string | null): value is FitnessGoal {
  return value !== null && (FITNESS_GOALS as readonly string[]).includes(value);
}
