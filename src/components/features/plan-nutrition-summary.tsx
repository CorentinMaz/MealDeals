import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe, UserPreferences } from "@/generated/prisma/client";
import type { SerializedUserPreferences } from "@/lib/preferences/serialize";
import { estimateDailyCalories } from "@/lib/nutrition/calorie-target";
import {
  FITNESS_GOAL_LABELS,
  nutritionProfileFromPreferences,
  type NutritionProfileInput,
} from "@/lib/nutrition/types";

interface PlanNutritionSummaryProps {
  recipes: Recipe[];
  preferences: UserPreferences | SerializedUserPreferences | null;
}

function sumNutrition(recipes: Recipe[]) {
  const selected = recipes.filter((recipe) => recipe.selected);
  const items = selected.length > 0 ? selected : recipes;

  return items.reduce(
    (acc, recipe) => ({
      calories: acc.calories + (recipe.calories ?? 0),
      proteinG: acc.proteinG + Number(recipe.proteinG ?? 0),
      carbsG: acc.carbsG + Number(recipe.carbsG ?? 0),
      fatG: acc.fatG + Number(recipe.fatG ?? 0),
      count: acc.count + (recipe.calories ? 1 : 0),
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, count: 0 },
  );
}

function formatProfileSummary(profile: NutritionProfileInput): string {
  const parts = [FITNESS_GOAL_LABELS[profile.fitnessGoal!]];
  if (profile.activityGym) {
    parts.push(`musculation ${profile.gymSessionsPerWeek ?? 0}×/sem.`);
  }
  if (profile.activityRunning) {
    parts.push(`course ${profile.runningSessionsPerWeek ?? 0}×/sem.`);
  }
  return parts.join(" · ");
}

export function PlanNutritionSummary({
  recipes,
  preferences,
}: PlanNutritionSummaryProps) {
  if (!preferences) {
    return null;
  }

  const profile = nutritionProfileFromPreferences(preferences);
  const totals = sumNutrition(recipes);

  if (totals.count === 0) {
    return null;
  }

  const recipeCount = recipes.length;
  const avgDailyCalories = Math.round(totals.calories / recipeCount);
  const avgDailyProtein = Math.round(totals.proteinG / recipeCount);
  const target = estimateDailyCalories(profile);

  const showTarget =
    profile.nutritionMode === "guided" &&
    profile.fitnessGoal &&
    target !== null;

  const calorieDelta = showTarget
    ? avgDailyCalories - target.dailyCalories
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Résumé nutritionnel du menu</CardTitle>
        {showTarget ? (
          <p className="text-sm text-muted-foreground">
            Profil : {formatProfileSummary(profile)} · Objectif ~
            {target.dailyCalories} kcal/jour
            {target.isEstimated ? " (estimé)" : ""}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Moyennes estimées par jour sur {recipeCount} repas
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Calories / jour</p>
            <p className="text-lg font-semibold">~{avgDailyCalories} kcal</p>
            {calorieDelta !== null ? (
              <p
                className={
                  Math.abs(calorieDelta) <= 150
                    ? "text-primary"
                    : "text-amber-600 dark:text-amber-400"
                }
              >
                {calorieDelta > 0 ? "+" : ""}
                {calorieDelta} kcal par rapport à l&apos;objectif
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-muted-foreground">Protéines / jour</p>
            <p className="text-lg font-semibold">~{avgDailyProtein} g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Glucides / jour</p>
            <p className="text-lg font-semibold">
              ~{Math.round(totals.carbsG / recipeCount)} g
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Lipides / jour</p>
            <p className="text-lg font-semibold">
              ~{Math.round(totals.fatG / recipeCount)} g
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
