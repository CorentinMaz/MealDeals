import Link from "next/link";
import { ArrowRight, Heart, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  if (plans.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun menu généré pour le moment.{" "}
        <Link href="/recettes" className="text-primary underline-offset-4 hover:underline">
          Générer votre premier menu
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

          return (
            <div
              key={plan.id}
              className="flex flex-col gap-2 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium">
                  {plan.createdAt.toLocaleDateString("fr-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
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
                Consulter
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

        return (
          <Card key={plan.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    Menu du{" "}
                    {plan.createdAt.toLocaleDateString("fr-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>
                    {plan._count.recipes} recettes générées
                  </CardDescription>
                </div>
                <Link
                  href={`/resultats/${plan.id}`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Consulter
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {favoriteCount > 0 ? (
                  <Badge variant="outline">
                    <Heart className="mr-1 size-3" />
                    {favoriteCount} favori{favoriteCount > 1 ? "s" : ""}
                  </Badge>
                ) : null}
                {regularCount > 0 ? (
                  <Badge variant="secondary">
                    <RotateCcw className="mr-1 size-3" />
                    {regularCount} régulier{regularCount > 1 ? "s" : ""}
                  </Badge>
                ) : null}
              </div>
              <ul className="text-sm text-muted-foreground">
                {plan.recipes.slice(0, 4).map((recipe) => (
                  <li key={recipe.id}>· {recipe.name}</li>
                ))}
                {plan.recipes.length > 4 ? (
                  <li>· … et {plan.recipes.length - 4} autre(s)</li>
                ) : null}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
