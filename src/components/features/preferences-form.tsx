"use client";

import { useTransition } from "react";
import { toast } from "sonner";
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
            toast.success("Préférences enregistrées");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Erreur de sauvegarde",
            );
          }
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            name="allergies"
            defaultValue={fromList(preferences.allergies)}
            placeholder="arachides, gluten, lactose"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diets">Régimes alimentaires</Label>
          <Textarea
            id="diets"
            name="diets"
            defaultValue={fromList(preferences.diets)}
            placeholder="végétarien, sans gluten"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="likedFoods">Aliments aimés</Label>
          <Textarea
            id="likedFoods"
            name="likedFoods"
            defaultValue={fromList(preferences.likedFoods)}
            placeholder="poulet, brocoli, pâtes"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dislikedFoods">Aliments refusés</Label>
          <Textarea
            id="dislikedFoods"
            name="dislikedFoods"
            defaultValue={fromList(preferences.dislikedFoods)}
            placeholder="foie, anchois"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="maxPrepMinutes">Temps maximal de préparation (min)</Label>
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
          <Label htmlFor="weeklyBudget">Budget hebdomadaire ($)</Label>
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
        {isPending ? "Enregistrement..." : "Enregistrer les préférences"}
      </Button>
    </form>
  );
}
