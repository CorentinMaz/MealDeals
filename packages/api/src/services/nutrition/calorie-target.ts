import type { FitnessGoal, NutritionProfileInput } from "./types";

const BASE_MAINTENANCE_CALORIES = 2400;
const GYM_CALORIES_PER_SESSION = 150;
const RUNNING_CALORIES_PER_SESSION = 200;

const GOAL_ADJUSTMENTS: Record<FitnessGoal, number> = {
  bulking: 400,
  cutting: -400,
  maintenance: 0,
};

export interface CalorieTargetResult {
  dailyCalories: number;
  isEstimated: boolean;
  breakdown: {
    base: number;
    goalAdjustment: number;
    gymAdjustment: number;
    runningAdjustment: number;
  };
}

export function estimateDailyCalories(
  profile: NutritionProfileInput,
): CalorieTargetResult | null {
  if (profile.nutritionMode !== "guided" || !profile.fitnessGoal) {
    return null;
  }

  if (profile.dailyCalorieTarget && profile.dailyCalorieTarget > 0) {
    return {
      dailyCalories: profile.dailyCalorieTarget,
      isEstimated: false,
      breakdown: {
        base: profile.dailyCalorieTarget,
        goalAdjustment: 0,
        gymAdjustment: 0,
        runningAdjustment: 0,
      },
    };
  }

  const gymSessions = profile.activityGym
    ? Math.max(0, profile.gymSessionsPerWeek ?? 0)
    : 0;
  const runningSessions = profile.activityRunning
    ? Math.max(0, profile.runningSessionsPerWeek ?? 0)
    : 0;

  const gymAdjustment = Math.round(
    (gymSessions * GYM_CALORIES_PER_SESSION) / 7,
  );
  const runningAdjustment = Math.round(
    (runningSessions * RUNNING_CALORIES_PER_SESSION) / 7,
  );
  const goalAdjustment = GOAL_ADJUSTMENTS[profile.fitnessGoal];

  const dailyCalories =
    BASE_MAINTENANCE_CALORIES +
    goalAdjustment +
    gymAdjustment +
    runningAdjustment;

  return {
    dailyCalories,
    isEstimated: true,
    breakdown: {
      base: BASE_MAINTENANCE_CALORIES,
      goalAdjustment,
      gymAdjustment,
      runningAdjustment,
    },
  };
}

export function caloriesPerMeal(
  dailyCalories: number,
  recipeCount: number,
): number {
  return Math.round(dailyCalories / Math.max(recipeCount, 1));
}
