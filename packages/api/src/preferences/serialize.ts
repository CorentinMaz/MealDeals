import type { SerializedUserPreferences, UserPreferences } from "../types";

export function serializeUserPreferences(
  preferences: UserPreferences,
): SerializedUserPreferences {
  return {
    ...preferences,
    weeklyBudget: Number(preferences.weeklyBudget),
    updatedAt: preferences.updatedAt.toISOString(),
  };
}
