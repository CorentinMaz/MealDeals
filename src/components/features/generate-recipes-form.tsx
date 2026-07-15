"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateRecipesAction } from "@/server/actions/recipes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RECIPE_COUNTS = [3, 5, 7, 10];

export function GenerateRecipesForm({
  promotionCount,
}: {
  promotionCount: number;
}) {
  const [recipeCount, setRecipeCount] = useState("5");
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générer votre menu de la semaine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {promotionCount > 0
            ? `${promotionCount} promotions actives seront utilisées pour créer des recettes économiques.`
            : "Synchronisez d'abord les circulaires pour générer des recettes basées sur les promotions."}
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre de recettes</label>
          <Select
            value={recipeCount}
            items={RECIPE_COUNTS.map((count) => ({
              value: String(count),
              label: `${count} recettes`,
            }))}
            onValueChange={(value) => value && setRecipeCount(value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECIPE_COUNTS.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count} recettes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="lg"
          disabled={isPending || promotionCount === 0}
          onClick={() =>
            startTransition(async () => {
              try {
                await generateRecipesAction(Number(recipeCount));
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Erreur lors de la génération",
                );
              }
            })
          }
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 size-4" />
          )}
          Générer les recettes
        </Button>
      </CardContent>
    </Card>
  );
}
