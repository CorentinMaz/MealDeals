import type { FitnessGoal } from "@/lib/nutrition/types";

export type BiologicalSex = "male" | "female";

export type GeneralActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface CalorieCalculatorInput {
  sex: BiologicalSex;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: GeneralActivityLevel;
  fitnessGoal: FitnessGoal;
  /** Séances gym / semaine — bonus en plus du niveau d'activité */
  gymSessionsPerWeek?: number;
  /** Séances course / semaine — bonus en plus du niveau d'activité */
  runningSessionsPerWeek?: number;
}

export interface CalorieCalculatorResult {
  bmr: number;
  activityMultiplier: number;
  activityBonus: number;
  tdee: number;
  goalAdjustment: number;
  dailyCalories: number;
  breakdown: {
    bmr: number;
    activityFromLevel: number;
    gymBonus: number;
    runningBonus: number;
    goalAdjustment: number;
  };
}

const ACTIVITY_MULTIPLIERS: Record<GeneralActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LEVEL_LABELS: Record<GeneralActivityLevel, string> = {
  sedentary: "Sédentaire (bureau, peu de marche)",
  light: "Légèrement actif (marche, 1–3×/sem.)",
  moderate: "Modérément actif (sport 3–5×/sem.)",
  active: "Très actif (sport 6–7×/sem.)",
  very_active: "Extrêmement actif (athlète, travail physique)",
};

const GOAL_ADJUSTMENTS: Record<FitnessGoal, number> = {
  bulking: 400,
  cutting: -400,
  maintenance: 0,
};

const GYM_BONUS_PER_SESSION = 25;
const RUNNING_BONUS_PER_SESSION = 35;

/** Formule Mifflin-St Jeor */
export function calculateBmr(input: {
  sex: BiologicalSex;
  age: number;
  weightKg: number;
  heightCm: number;
}): number {
  const { sex, age, weightKg, heightCm } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

export function calculateDailyCalories(
  input: CalorieCalculatorInput,
): CalorieCalculatorResult {
  const bmr = calculateBmr(input);
  const multiplier = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const activityFromLevel = Math.round(bmr * multiplier) - bmr;

  const gymSessions = Math.max(0, input.gymSessionsPerWeek ?? 0);
  const runningSessions = Math.max(0, input.runningSessionsPerWeek ?? 0);
  const gymBonus = Math.round((gymSessions * GYM_BONUS_PER_SESSION) / 7);
  const runningBonus = Math.round(
    (runningSessions * RUNNING_BONUS_PER_SESSION) / 7,
  );
  const activityBonus = activityFromLevel + gymBonus + runningBonus;

  const tdee = bmr + activityBonus;
  const goalAdjustment = GOAL_ADJUSTMENTS[input.fitnessGoal];
  const dailyCalories = Math.max(1200, tdee + goalAdjustment);

  return {
    bmr,
    activityMultiplier: multiplier,
    activityBonus,
    tdee,
    goalAdjustment,
    dailyCalories,
    breakdown: {
      bmr,
      activityFromLevel,
      gymBonus,
      runningBonus,
      goalAdjustment,
    },
  };
}
