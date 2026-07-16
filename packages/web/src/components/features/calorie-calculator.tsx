"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { useTranslate } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACTIVITY_LEVEL_LABELS,
  calculateDailyCalories,
  type BiologicalSex,
  type GeneralActivityLevel,
} from "@mealdeals/api/client";
import {
  FITNESS_GOALS,
  isFitnessGoal,
  type FitnessGoal,
} from "@mealdeals/api/client";

interface CalorieCalculatorProps {
  /** Objectif — utilisé directement quand showFitnessGoalInput est false */
  fitnessGoal?: FitnessGoal | null;
  /** Afficher le sélecteur d'objectif (désactivé si déjà saisi dans « Objectif principal ») */
  showFitnessGoalInput?: boolean;
  /** Séances gym — utilisées directement quand showActivitySessionInputs est false */
  gymSessionsPerWeek?: number;
  /** Séances course — utilisées directement quand showActivitySessionInputs est false */
  runningSessionsPerWeek?: number;
  /** Afficher les champs gym/course (désactivé si déjà saisis dans « Activité physique ») */
  showActivitySessionInputs?: boolean;
  onApplyTarget?: (calories: number) => void;
}

const ACTIVITY_LEVELS = Object.keys(
  ACTIVITY_LEVEL_LABELS,
) as GeneralActivityLevel[];

function activityMessageKey(level: GeneralActivityLevel) {
  return level === "very_active" ? "veryActive" : level;
}

export function CalorieCalculator({
  fitnessGoal: externalFitnessGoal = null,
  showFitnessGoalInput = true,
  gymSessionsPerWeek: externalGymSessions = 0,
  runningSessionsPerWeek: externalRunningSessions = 0,
  showActivitySessionInputs = true,
  onApplyTarget,
}: CalorieCalculatorProps) {
  const t = useTranslate();
  const [sex, setSex] = useState<BiologicalSex>("male");
  const [age, setAge] = useState("30");
  const [weightKg, setWeightKg] = useState("80");
  const [heightCm, setHeightCm] = useState("175");
  const [activityLevel, setActivityLevel] =
    useState<GeneralActivityLevel>("moderate");
  const [internalFitnessGoal, setInternalFitnessGoal] = useState<FitnessGoal>(
    externalFitnessGoal ?? "maintenance",
  );
  const [gymSessions, setGymSessions] = useState(
    externalGymSessions > 0 ? String(externalGymSessions) : "0",
  );
  const [runningSessions, setRunningSessions] = useState(
    externalRunningSessions > 0 ? String(externalRunningSessions) : "0",
  );

  const effectiveFitnessGoal = showFitnessGoalInput
    ? internalFitnessGoal
    : externalFitnessGoal;

  const effectiveGymSessions = showActivitySessionInputs
    ? Number(gymSessions) || 0
    : externalGymSessions;
  const effectiveRunningSessions = showActivitySessionInputs
    ? Number(runningSessions) || 0
    : externalRunningSessions;

  const result = useMemo(() => {
    const parsedAge = Number(age);
    const parsedWeight = Number(weightKg);
    const parsedHeight = Number(heightCm);

    if (
      !Number.isFinite(parsedAge) ||
      parsedAge < 14 ||
      parsedAge > 100 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 30 ||
      parsedWeight > 300 ||
      !Number.isFinite(parsedHeight) ||
      parsedHeight < 120 ||
      parsedHeight > 230
    ) {
      return null;
    }

    if (!effectiveFitnessGoal) {
      return null;
    }

    return calculateDailyCalories({
      sex,
      age: parsedAge,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      activityLevel,
      fitnessGoal: effectiveFitnessGoal,
      gymSessionsPerWeek: effectiveGymSessions,
      runningSessionsPerWeek: effectiveRunningSessions,
    });
  }, [
    sex,
    age,
    weightKg,
    heightCm,
    activityLevel,
    effectiveFitnessGoal,
    effectiveGymSessions,
    effectiveRunningSessions,
  ]);

  return (
    <div className="space-y-5 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-start gap-3">
        <Calculator className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h4 className="font-medium">{t("forms.calorieCalculatorTitle")}</h4>
          <p className="text-sm text-muted-foreground">
            {t("forms.calorieCalculatorDescription")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("forms.calorieCalculatorSex")}</Label>
          <Select
            value={sex}
            items={[
              { value: "male", label: t("forms.calorieCalculatorSexMale") },
              { value: "female", label: t("forms.calorieCalculatorSexFemale") },
            ]}
            onValueChange={(value) => {
              if (value === "male" || value === "female") {
                setSex(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t("forms.calorieCalculatorSexMale")}</SelectItem>
              <SelectItem value="female">
                {t("forms.calorieCalculatorSexFemale")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showFitnessGoalInput ? (
          <div className="space-y-2">
            <Label>{t("forms.nutritionMainGoal")}</Label>
            <Select
              value={internalFitnessGoal}
              items={FITNESS_GOALS.map((goal) => ({
                value: goal,
                label: t(`nutrition.goals.${goal}`),
              }))}
              onValueChange={(value) => {
                if (value && isFitnessGoal(value)) {
                  setInternalFitnessGoal(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FITNESS_GOALS.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {t(`nutrition.goals.${goal}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>{t("forms.calorieCalculatorAge")}</Label>
          <Input
            type="number"
            min={14}
            max={100}
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("forms.calorieCalculatorWeight")}</Label>
          <Input
            type="number"
            min={30}
            max={300}
            step={0.5}
            value={weightKg}
            onChange={(event) => setWeightKg(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("forms.calorieCalculatorHeight")}</Label>
          <Input
            type="number"
            min={120}
            max={230}
            value={heightCm}
            onChange={(event) => setHeightCm(event.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>{t("forms.calorieCalculatorActivityLevel")}</Label>
          <Select
            value={activityLevel}
            items={ACTIVITY_LEVELS.map((level) => ({
              value: level,
              label: t(`nutrition.activity.${activityMessageKey(level)}`),
            }))}
            onValueChange={(value) => {
              if (
                value &&
                (ACTIVITY_LEVELS as readonly string[]).includes(value)
              ) {
                setActivityLevel(value as GeneralActivityLevel);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {t(`nutrition.activity.${activityMessageKey(level)}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showActivitySessionInputs ? (
          <>
            <div className="space-y-2">
              <Label>{t("forms.calorieCalculatorGymSessions")}</Label>
              <Input
                type="number"
                min={0}
                max={14}
                value={gymSessions}
                onChange={(event) => setGymSessions(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("forms.calorieCalculatorRunningSessions")}</Label>
              <Input
                type="number"
                min={0}
                max={14}
                value={runningSessions}
                onChange={(event) => setRunningSessions(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </div>

      {result ? (
        <div className="space-y-4 rounded-lg border bg-background p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("forms.calorieCalculatorRecommended")}
              </p>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                ~{result.dailyCalories}{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  {t("common.kcalPerDay")}
                </span>
              </p>
            </div>
            {onApplyTarget ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onApplyTarget(result.dailyCalories)}
              >
                {t("forms.calorieCalculatorUseTarget")}
              </Button>
            ) : null}
          </div>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">
                {t("forms.calorieCalculatorBmr")}
              </dt>
              <dd className="font-medium">{result.bmr} kcal</dd>
            </div>
            <div className="flex justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">
                {t("forms.calorieCalculatorActivityBonus")}
              </dt>
              <dd className="font-medium">
                +{result.breakdown.activityFromLevel} kcal
              </dd>
            </div>
            {result.breakdown.gymBonus > 0 ? (
              <div className="flex justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">
                  {t("forms.calorieCalculatorGymBonus")}
                </dt>
                <dd className="font-medium">
                  +{result.breakdown.gymBonus} kcal
                </dd>
              </div>
            ) : null}
            {result.breakdown.runningBonus > 0 ? (
              <div className="flex justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
                <dt className="text-muted-foreground">
                  {t("forms.calorieCalculatorRunningBonus")}
                </dt>
                <dd className="font-medium">
                  +{result.breakdown.runningBonus} kcal
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">
                {t("forms.calorieCalculatorTdee")}
              </dt>
              <dd className="font-medium">{result.tdee} kcal</dd>
            </div>
            <div className="flex justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">
                {t("forms.calorieCalculatorAdjustment")} (
                {t(`nutrition.goals.${effectiveFitnessGoal!}`).toLowerCase()})
              </dt>
              <dd className="font-medium">
                {result.goalAdjustment > 0 ? "+" : ""}
                {result.goalAdjustment} kcal
              </dd>
            </div>
          </dl>

          <p className="text-xs text-muted-foreground">
            {t("forms.calorieCalculatorDisclaimer")}
          </p>
        </div>
      ) : !effectiveFitnessGoal ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {t("forms.calorieCalculatorChooseGoal")}
        </p>
      ) : (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {t("forms.calorieCalculatorInvalidValues")}
        </p>
      )}
    </div>
  );
}
