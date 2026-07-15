import type { UserPreferences } from "@/generated/prisma/client";

/** UserPreferences with Prisma Decimal/Date fields converted for client components. */
export type SerializedUserPreferences = Omit<
  UserPreferences,
  "weeklyBudget" | "updatedAt"
> & {
  weeklyBudget: number;
  updatedAt: string;
};

export function serializeUserPreferences(
  preferences: UserPreferences,
): SerializedUserPreferences {
  return {
    ...preferences,
    weeklyBudget: Number(preferences.weeklyBudget),
    updatedAt: preferences.updatedAt.toISOString(),
  };
}
