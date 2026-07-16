"use client";

import { RecipeGenerationOverlay } from "@/components/features/recipe-generation-overlay";
import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslate } from "@/components/providers/locale-provider";
import { getErrorMessage } from "@/lib/errors";
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
  const t = useTranslate();

  return (
    <>
      <RecipeGenerationOverlay
        open={isPending}
        title={t("pages.recipes.generatingTitle")}
        subtitle={t("pages.recipes.generatingSubtitle")}
      />

      <Card>
      <CardHeader>
        <CardTitle>{t("pages.recipes.cardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {promotionCount > 0
            ? t("pages.recipes.promotionsAvailable", { count: promotionCount })
            : t("pages.recipes.syncFirst")}
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("pages.recipes.recipeCount")}
          </label>
          <Select
            value={recipeCount}
            disabled={isPending}
            items={RECIPE_COUNTS.map((count) => ({
              value: String(count),
              label: t("pages.recipes.recipeCountOption", { count }),
            }))}
            onValueChange={(value) => value && setRecipeCount(value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECIPE_COUNTS.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {t("pages.recipes.recipeCountOption", { count })}
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
                toast.error(getErrorMessage(error, t, "GENERATION_ERROR"));
              }
            })
          }
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 size-4" />
          )}
          {t("pages.recipes.generate")}
        </Button>
      </CardContent>
    </Card>
    </>
  );
}
