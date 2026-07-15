"use client";

import Link from "next/link";
import { ArrowRight, Heart, RotateCcw } from "lucide-react";
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
import { formatLocalizedDate } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

interface RecipePlanHistoryListProps {
  plans: Array<{
    id: string;
    createdAt: Date;
    recipeCount: number;
    recipes: Array<{
      id: string;
      name: string;
      isFavorite: boolean;
      makeRegularly: boolean;
    }>;
    _count: { recipes: number };
  }>;
  variant?: "default" | "compact";
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

          return (
            <div
              key={plan.id}
              className="flex flex-col gap-2 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium">{dateLabel}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {plan.recipes
                    .slice(0, 3)
                    .map((recipe) => recipe.name)
                    .join(" · ")}
                  {plan.recipes.length > 3
                    ? ` · +${plan.recipes.length - 3}`
                    : ""}
                </p>
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
    <div className="space-y-3">
      {plans.map((plan) => {
        const favoriteCount = plan.recipes.filter((r) => r.isFavorite).length;
        const regularCount = plan.recipes.filter((r) => r.makeRegularly).length;
        const dateLabel = formatLocalizedDate(plan.createdAt, locale);

        return (
          <Card key={plan.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    {t("pages.history.menuOf", { date: dateLabel })}
                  </CardTitle>
                  <CardDescription>
                    {t("pages.history.recipesGenerated", {
                      count: plan._count.recipes,
                    })}
                  </CardDescription>
                </div>
                <Link
                  href={`/resultats/${plan.id}`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  {t("common.consult")}
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <ul className="text-sm text-muted-foreground">
                {plan.recipes.slice(0, 4).map((recipe) => (
                  <li key={recipe.id}>· {recipe.name}</li>
                ))}
                {plan.recipes.length > 4 ? (
                  <li>
                    ·{" "}
                    {t("pages.history.andMore", {
                      count: plan.recipes.length - 4,
                    })}
                  </li>
                ) : null}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
