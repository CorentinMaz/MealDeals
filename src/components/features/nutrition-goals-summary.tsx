import { getServerTranslator } from "@/lib/i18n/server";
import type { SerializedUserPreferences } from "@/lib/preferences/serialize";
import { estimateDailyCalories } from "@/lib/nutrition/calorie-target";
import { nutritionProfileFromPreferences } from "@/lib/nutrition/types";

export async function NutritionGoalsSummary({
  preferences,
}: {
  preferences: SerializedUserPreferences;
}) {
  const t = await getServerTranslator();
  const profile = nutritionProfileFromPreferences(preferences);
  if (profile.nutritionMode !== "guided" || !profile.fitnessGoal) {
    return null;
  }

  const estimate = estimateDailyCalories(profile);
  if (!estimate) {
    return null;
  }

  const activityParts: string[] = [];
  if (profile.activityGym) {
    activityParts.push(
      t("forms.nutritionActivityGym", {
        count: profile.gymSessionsPerWeek ?? 0,
      }),
    );
  }
  if (profile.activityRunning) {
    activityParts.push(
      t("forms.nutritionActivityRunning", {
        count: profile.runningSessionsPerWeek ?? 0,
      }),
    );
  }

  const activities =
    activityParts.length > 0 ? ` · ${activityParts.join(", ")}` : "";

  return (
    <p className="text-sm text-muted-foreground">
      {t("forms.nutritionActiveProfile", {
        goal: t(`nutrition.goals.${profile.fitnessGoal}`),
        activities,
        calories: estimate.dailyCalories,
        source: estimate.isEstimated
          ? t("common.estimated")
          : t("common.manual"),
      })}
    </p>
  );
}
