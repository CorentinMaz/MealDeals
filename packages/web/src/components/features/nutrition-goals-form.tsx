"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateNutritionGoalsAction } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslate } from "@/components/providers/locale-provider";
import { getErrorMessage } from "@/lib/errors";
import type { SerializedUserPreferences } from "@mealdeals/api/client";
import { estimateDailyCalories } from "@mealdeals/api/client";
import { CalorieCalculator } from "@/components/features/calorie-calculator";
import {
  FITNESS_GOALS,
  isFitnessGoal,
  isNutritionMode,
  NUTRITION_MODES,
  nutritionProfileFromPreferences,
  type FitnessGoal,
  type NutritionMode,
} from "@mealdeals/api/client";

interface NutritionGoalsFormProps {
  preferences: SerializedUserPreferences;
}

export function NutritionGoalsForm({ preferences }: NutritionGoalsFormProps) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslate();

  const [nutritionMode, setNutritionMode] = useState<NutritionMode>(
    isNutritionMode(preferences.nutritionMode)
      ? preferences.nutritionMode
      : "recipes_only",
  );
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | "">(
    isFitnessGoal(preferences.fitnessGoal) ? preferences.fitnessGoal : "",
  );
  const [useManualCalories, setUseManualCalories] = useState(
    preferences.dailyCalorieTarget !== null &&
      preferences.dailyCalorieTarget > 0,
  );
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(
    preferences.dailyCalorieTarget?.toString() ?? "",
  );
  const [activityGym, setActivityGym] = useState(preferences.activityGym ?? false);
  const [activityRunning, setActivityRunning] = useState(
    preferences.activityRunning ?? false,
  );
  const [gymSessionsPerWeek, setGymSessionsPerWeek] = useState(
    preferences.gymSessionsPerWeek?.toString() ?? "4",
  );
  const [runningSessionsPerWeek, setRunningSessionsPerWeek] = useState(
    preferences.runningSessionsPerWeek?.toString() ?? "3",
  );

  const previewProfile = useMemo(
    () => ({
      nutritionMode,
      fitnessGoal: fitnessGoal || null,
      dailyCalorieTarget:
        useManualCalories && dailyCalorieTarget
          ? Number(dailyCalorieTarget)
          : null,
      activityGym,
      activityRunning,
      gymSessionsPerWeek: activityGym ? Number(gymSessionsPerWeek) || 0 : null,
      runningSessionsPerWeek: activityRunning
        ? Number(runningSessionsPerWeek) || 0
        : null,
    }),
    [
      nutritionMode,
      fitnessGoal,
      useManualCalories,
      dailyCalorieTarget,
      activityGym,
      activityRunning,
      gymSessionsPerWeek,
      runningSessionsPerWeek,
    ],
  );

  const estimatedCalories = useMemo(
    () => estimateDailyCalories(previewProfile),
    [previewProfile],
  );

  const isGuided = nutritionMode === "guided";

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();

        if (isGuided && !fitnessGoal) {
          toast.error(t("errors.SELECT_FITNESS_GOAL"));
          return;
        }

        if (
          isGuided &&
          useManualCalories &&
          (!dailyCalorieTarget || Number(dailyCalorieTarget) < 1200)
        ) {
          toast.error(t("errors.MIN_CALORIE_TARGET"));
          return;
        }

        startTransition(async () => {
          try {
            await updateNutritionGoalsAction({
              nutritionMode,
              fitnessGoal: isGuided && fitnessGoal ? fitnessGoal : null,
              dailyCalorieTarget:
                isGuided && useManualCalories && dailyCalorieTarget
                  ? Number(dailyCalorieTarget)
                  : null,
              activityGym: isGuided && activityGym,
              activityRunning: isGuided && activityRunning,
              gymSessionsPerWeek:
                isGuided && activityGym
                  ? Number(gymSessionsPerWeek) || 0
                  : null,
              runningSessionsPerWeek:
                isGuided && activityRunning
                  ? Number(runningSessionsPerWeek) || 0
                  : null,
            });
            toast.success(t("success.NUTRITION_GOALS_SAVED"));
          } catch (error) {
            toast.error(getErrorMessage(error, t, "SAVE_ERROR"));
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label>{t("forms.nutritionWhatDoYouWant")}</Label>
        <Select
          value={nutritionMode}
          items={NUTRITION_MODES.map((mode) => ({
            value: mode,
            label: t(`nutrition.modes.${mode}`),
          }))}
          onValueChange={(value) => {
            if (value && isNutritionMode(value)) {
              setNutritionMode(value);
            }
          }}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NUTRITION_MODES.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {t(`nutrition.modes.${mode}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {nutritionMode === "recipes_only"
            ? t("forms.nutritionRecipesOnlyHint")
            : t("forms.nutritionGuidedHint")}
        </p>
      </div>

      {isGuided ? (
        <>
          <div className="space-y-2">
            <Label>{t("forms.nutritionMainGoal")}</Label>
            <Select
              value={fitnessGoal}
              items={FITNESS_GOALS.map((goal) => ({
                value: goal,
                label: t(`nutrition.goals.${goal}`),
              }))}
              onValueChange={(value) => {
                if (value && isFitnessGoal(value)) {
                  setFitnessGoal(value);
                }
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder={t("forms.nutritionChooseGoal")} />
              </SelectTrigger>
              <SelectContent>
                {FITNESS_GOALS.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {t(`nutrition.goals.${goal}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fitnessGoal ? (
              <p className="text-sm text-muted-foreground">
                {t(`nutrition.goalDescriptions.${fitnessGoal}`)}
              </p>
            ) : null}
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">
              {t("forms.nutritionPhysicalActivity")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("forms.nutritionActivityHint")}
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <Checkbox
                  checked={activityGym}
                  onCheckedChange={(value) => setActivityGym(value === true)}
                  className="mt-0.5"
                />
                <span className="space-y-2">
                  <span className="block text-sm font-medium">
                    {t("forms.nutritionGym")}
                  </span>
                  {activityGym ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={14}
                        value={gymSessionsPerWeek}
                        onChange={(event) =>
                          setGymSessionsPerWeek(event.target.value)
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        {t("common.sessionsPerWeek")}
                      </span>
                    </div>
                  ) : null}
                </span>
              </label>

              <label className="flex items-start gap-3">
                <Checkbox
                  checked={activityRunning}
                  onCheckedChange={(value) =>
                    setActivityRunning(value === true)
                  }
                  className="mt-0.5"
                />
                <span className="space-y-2">
                  <span className="block text-sm font-medium">
                    {t("forms.nutritionRunning")}
                  </span>
                  {activityRunning ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={14}
                        value={runningSessionsPerWeek}
                        onChange={(event) =>
                          setRunningSessionsPerWeek(event.target.value)
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        {t("common.sessionsPerWeek")}
                      </span>
                    </div>
                  ) : null}
                </span>
              </label>
            </div>
          </div>

          <CalorieCalculator
            fitnessGoal={fitnessGoal || null}
            showFitnessGoalInput={false}
            showActivitySessionInputs={false}
            gymSessionsPerWeek={
              activityGym ? Number(gymSessionsPerWeek) || 0 : 0
            }
            runningSessionsPerWeek={
              activityRunning ? Number(runningSessionsPerWeek) || 0 : 0
            }
            onApplyTarget={(calories) => {
              setUseManualCalories(true);
              setDailyCalorieTarget(String(calories));
            }}
          />

          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">
              {t("forms.nutritionDailyCalories")}
            </h4>

            <label className="flex items-center gap-3">
              <Checkbox
                checked={useManualCalories}
                onCheckedChange={(value) =>
                  setUseManualCalories(value === true)
                }
              />
              <span className="text-sm">
                {t("forms.nutritionManualCalories")}
              </span>
            </label>

            {useManualCalories ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1200}
                  max={6000}
                  step={1}
                  value={dailyCalorieTarget}
                  onChange={(event) =>
                    setDailyCalorieTarget(event.target.value)
                  }
                  placeholder={t("forms.nutritionCaloriePlaceholder")}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">
                  {t("common.kcalPerDay")}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {estimatedCalories
                  ? t("forms.nutritionAutoEstimate", {
                      calories: estimatedCalories.dailyCalories,
                    })
                  : t("forms.nutritionChooseGoalForEstimate")}
              </p>
            )}
          </div>
        </>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? t("common.saving") : t("common.saveGoals")}
      </Button>
    </form>
  );
}

