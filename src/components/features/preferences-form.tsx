"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/components/providers/locale-provider";
import { getErrorMessage } from "@/lib/errors";
import { updatePreferencesAction } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SerializedUserPreferences } from "@/lib/preferences/serialize";

function toList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fromList(values: string[]): string {
  return values.join(", ");
}

interface PreferencesFormProps {
  preferences: SerializedUserPreferences;
}

export function PreferencesForm({ preferences }: PreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslate();

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          try {
            await updatePreferencesAction({
              allergies: toList(String(formData.get("allergies") ?? "")),
              diets: toList(String(formData.get("diets") ?? "")),
              likedFoods: toList(String(formData.get("likedFoods") ?? "")),
              dislikedFoods: toList(String(formData.get("dislikedFoods") ?? "")),
              maxPrepMinutes: Number(formData.get("maxPrepMinutes") ?? 60),
              weeklyBudget: Number(formData.get("weeklyBudget") ?? 150),
            });
            toast.success(t("success.PREFERENCES_SAVED"));
          } catch (error) {
            toast.error(getErrorMessage(error, t, "SAVE_ERROR"));
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="allergies">{t("forms.allergies")}</Label>
          <Textarea
            id="allergies"
            name="allergies"
            defaultValue={fromList(preferences.allergies)}
            placeholder={t("forms.allergiesPlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diets">{t("forms.diets")}</Label>
          <Textarea
            id="diets"
            name="diets"
            defaultValue={fromList(preferences.diets)}
            placeholder={t("forms.dietsPlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="likedFoods">{t("forms.likedFoods")}</Label>
          <Textarea
            id="likedFoods"
            name="likedFoods"
            defaultValue={fromList(preferences.likedFoods)}
            placeholder={t("forms.likedFoodsPlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dislikedFoods">{t("forms.dislikedFoods")}</Label>
          <Textarea
            id="dislikedFoods"
            name="dislikedFoods"
            defaultValue={fromList(preferences.dislikedFoods)}
            placeholder={t("forms.dislikedFoodsPlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="maxPrepMinutes">{t("forms.maxPrepMinutes")}</Label>
          <Input
            id="maxPrepMinutes"
            name="maxPrepMinutes"
            type="number"
            min={15}
            max={120}
            step={5}
            defaultValue={preferences.maxPrepMinutes}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeklyBudget">{t("forms.weeklyBudget")}</Label>
          <Input
            id="weeklyBudget"
            name="weeklyBudget"
            type="number"
            min={50}
            step={10}
            defaultValue={String(preferences.weeklyBudget)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? t("common.saving") : t("common.savePreferences")}
      </Button>
    </form>
  );
}
