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
import type { SerializedUserPreferences } from "@/lib/preferences/serialize";
import { CalorieCalculator } from "@/components/features/calorie-calculator";
import { estimateDailyCalories } from "@/lib/nutrition/calorie-target";
import {
  FITNESS_GOAL_DESCRIPTIONS,
  FITNESS_GOAL_LABELS,
  FITNESS_GOALS,
  isFitnessGoal,
  isNutritionMode,
  NUTRITION_MODE_LABELS,
  NUTRITION_MODES,
  nutritionProfileFromPreferences,
  type FitnessGoal,
  type NutritionMode,
} from "@/lib/nutrition/types";

interface NutritionGoalsFormProps {
  preferences: SerializedUserPreferences;
}

export function NutritionGoalsForm({ preferences }: NutritionGoalsFormProps) {
  const [isPending, startTransition] = useTransition();

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
          toast.error("Choisissez un objectif nutritionnel.");
          return;
        }

        if (
          isGuided &&
          useManualCalories &&
          (!dailyCalorieTarget || Number(dailyCalorieTarget) < 1200)
        ) {
          toast.error("L'objectif calorique doit être d'au moins 1200 kcal.");
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
            toast.success("Objectifs nutritionnels enregistrés");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Erreur de sauvegarde",
            );
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label>Que voulez-vous obtenir ?</Label>
        <Select
          value={nutritionMode}
          items={NUTRITION_MODES.map((mode) => ({
            value: mode,
            label: NUTRITION_MODE_LABELS[mode],
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
                {NUTRITION_MODE_LABELS[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {nutritionMode === "recipes_only"
            ? "Génération de recettes basées sur les promotions, sans contrainte calorique."
            : "Les recettes seront adaptées à votre objectif, votre activité physique et vos calories cibles."}
        </p>
      </div>

      {isGuided ? (
        <>
          <div className="space-y-2">
            <Label>Objectif principal</Label>
            <Select
              value={fitnessGoal}
              items={FITNESS_GOALS.map((goal) => ({
                value: goal,
                label: FITNESS_GOAL_LABELS[goal],
              }))}
              onValueChange={(value) => {
                if (value && isFitnessGoal(value)) {
                  setFitnessGoal(value);
                }
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choisir un objectif" />
              </SelectTrigger>
              <SelectContent>
                {FITNESS_GOALS.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {FITNESS_GOAL_LABELS[goal]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fitnessGoal ? (
              <p className="text-sm text-muted-foreground">
                {FITNESS_GOAL_DESCRIPTIONS[fitnessGoal]}
              </p>
            ) : null}
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">Activité physique</h4>
            <p className="text-sm text-muted-foreground">
              Indiquez vos activités pour ajuster les calories et les macros
              (ex. prise de masse + musculation + course).
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <Checkbox
                  checked={activityGym}
                  onCheckedChange={(value) => setActivityGym(value === true)}
                  className="mt-0.5"
                />
                <span className="space-y-2">
                  <span className="block text-sm font-medium">Musculation</span>
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
                        séances / semaine
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
                    Course à pied
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
                        séances / semaine
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
            <h4 className="text-sm font-medium">Calories journalières</h4>

            <label className="flex items-center gap-3">
              <Checkbox
                checked={useManualCalories}
                onCheckedChange={(value) =>
                  setUseManualCalories(value === true)
                }
              />
              <span className="text-sm">
                Définir un objectif calorique manuel
              </span>
            </label>

            {useManualCalories ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1200}
                  max={6000}
                  step={50}
                  value={dailyCalorieTarget}
                  onChange={(event) =>
                    setDailyCalorieTarget(event.target.value)
                  }
                  placeholder="ex. 3000"
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">kcal / jour</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {estimatedCalories
                  ? `Estimation automatique : ~${estimatedCalories.dailyCalories} kcal/jour selon votre objectif et votre activité.`
                  : "Choisissez un objectif pour voir l'estimation calorique."}
              </p>
            )}
          </div>
        </>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer les objectifs"}
      </Button>
    </form>
  );
}

export function NutritionGoalsSummary({
  preferences,
}: {
  preferences: SerializedUserPreferences;
}) {
  const profile = nutritionProfileFromPreferences(preferences);
  if (profile.nutritionMode !== "guided" || !profile.fitnessGoal) {
    return null;
  }

  const estimate = estimateDailyCalories(profile);
  if (!estimate) {
    return null;
  }

  const activities: string[] = [];
  if (profile.activityGym) {
    activities.push(
      `musculation (${profile.gymSessionsPerWeek ?? 0}×/sem.)`,
    );
  }
  if (profile.activityRunning) {
    activities.push(
      `course (${profile.runningSessionsPerWeek ?? 0}×/sem.)`,
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Profil actif : {FITNESS_GOAL_LABELS[profile.fitnessGoal]}
      {activities.length > 0 ? ` · ${activities.join(", ")}` : ""}
      {" · "}
      ~{estimate.dailyCalories} kcal/jour
      {estimate.isEstimated ? " (estimé)" : " (manuel)"}
    </p>
  );
}
