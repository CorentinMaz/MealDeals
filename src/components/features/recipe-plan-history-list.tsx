"use client";

import Link from "next/link";
import { ArrowRight, Heart, Receipt, RotateCcw } from "lucide-react";
import { useLocale, useTranslate } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatLocalizedDate, formatMoney } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

interface HistoryRecipe {
  id: string;
  name: string;
  estimatedCost: number;
  isFavorite: boolean;
  makeRegularly: boolean;
}

interface RecipePlanHistoryListProps {
  plans: Array<{
    id: string;
    createdAt: Date;
    recipeCount: number;
    recipes: HistoryRecipe[];
    _count: { recipes: number };
  }>;
  variant?: "default" | "compact";
}

function sumRecipeCosts(recipes: HistoryRecipe[]): number {
  return recipes.reduce((total, recipe) => total + recipe.estimatedCost, 0);
}

function RecipeRow({
  recipe,
  locale,
}: {
  recipe: HistoryRecipe;
  locale: Locale;
}) {
  const cost = recipe.estimatedCost;

  return (
    <li className="flex items-start justify-between gap-3 py-2">
      <div className="flex min-w-0 items-start gap-2">
        {(recipe.isFavorite || recipe.makeRegularly) && (
          <span className="mt-0.5 flex shrink-0 gap-1">
            {recipe.isFavorite ? (
              <Heart className="size-3.5 fill-current text-rose-500" aria-hidden />
            ) : null}
            {recipe.makeRegularly ? (
              <RotateCcw className="size-3.5 text-muted-foreground" aria-hidden />
            ) : null}
          </span>
        )}
        <span className="text-sm leading-snug">{recipe.name}</span>
      </div>
      {cost > 0 ? (
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          ~{formatMoney(cost, locale)}$
        </span>
      ) : null}
    </li>
  );
}

export function RecipePlanHistoryList({
  plans,
  variant = "default",
}: RecipePlanHistoryListProps) {
  const t = useTranslate();
  const { locale } = useLocale();

  if (plans.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("pages.history.noPlans")}{" "}
        <Link
          href="/recettes"
          className="text-primary underline-offset-4 hover:underline"
        >
          {t("common.generateFirstMenu")}
        </Link>
        .
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {plans.map((plan) => {
          const favoriteCount = plan.recipes.filter((r) => r.isFavorite).length;
          const regularCount = plan.recipes.filter((r) => r.makeRegularly).length;
          const dateLabel = formatLocalizedDate(plan.createdAt, locale);
          const weeklyTotal = sumRecipeCosts(plan.recipes);

          return (
            <div
              key={plan.id}
              className="flex flex-col gap-2 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{dateLabel}</p>
                  {weeklyTotal > 0 ? (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {t("pages.history.weeklyTotalShort", {
                        amount: formatMoney(weeklyTotal, locale),
                      })}
                    </Badge>
                  ) : null}
                </div>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {plan.recipes.slice(0, 3).map((recipe) => (
                    <li key={recipe.id} className="truncate">
                      {recipe.name}
                    </li>
                  ))}
                  {plan.recipes.length > 3 ? (
                    <li>
                      {t("pages.history.andMore", {
                        count: plan.recipes.length - 3,
                      })}
                    </li>
                  ) : null}
                </ul>
                {(favoriteCount > 0 || regularCount > 0) && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {favoriteCount > 0 ? (
                      <Badge variant="outline" className="text-xs">
                        <Heart className="mr-1 size-2.5" />
                        {favoriteCount}
                      </Badge>
                    ) : null}
                    {regularCount > 0 ? (
                      <Badge variant="secondary" className="text-xs">
                        <RotateCcw className="mr-1 size-2.5" />
                        {regularCount}
                      </Badge>
                    ) : null}
                  </div>
                )}
              </div>
              <Link
                href={`/resultats/${plan.id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0",
                )}
              >
                {t("common.consult")}
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const favoriteCount = plan.recipes.filter((r) => r.isFavorite).length;
        const regularCount = plan.recipes.filter((r) => r.makeRegularly).length;
        const dateLabel = formatLocalizedDate(plan.createdAt, locale);
        const weeklyTotal = sumRecipeCosts(plan.recipes);

        return (
          <Card key={plan.id}>
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    {t("pages.history.menuOf", { date: dateLabel })}
                  </CardTitle>
                  <CardDescription>
                    {t("pages.history.recipesGenerated", {
                      count: plan._count.recipes,
                    })}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {weeklyTotal > 0 ? (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm font-medium">
                      <Receipt className="size-3.5" />
                      {t("pages.history.weeklyTotalShort", {
                        amount: formatMoney(weeklyTotal, locale),
                      })}
                    </Badge>
                  ) : null}
                  <Link
                    href={`/resultats/${plan.id}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    {t("common.consult")}
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="divide-y rounded-lg border bg-muted/30 px-3">
                {plan.recipes.map((recipe) => (
                  <RecipeRow key={recipe.id} recipe={recipe} locale={locale} />
                ))}
              </ul>

              {(favoriteCount > 0 || regularCount > 0) && (
                <div className="flex flex-wrap gap-2">
                  {favoriteCount > 0 ? (
                    <Badge variant="outline">
                      <Heart className="mr-1 size-3" />
                      {t("pages.history.favoriteCount", {
                        count: favoriteCount,
                      })}
                    </Badge>
                  ) : null}
                  {regularCount > 0 ? (
                    <Badge variant="secondary">
                      <RotateCcw className="mr-1 size-3" />
                      {t("pages.history.regularCount", {
                        count: regularCount,
                      })}
                    </Badge>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
