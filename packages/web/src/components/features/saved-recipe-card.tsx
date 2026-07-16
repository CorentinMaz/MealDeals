import Link from "next/link";
import { ArrowRight, Calendar, Heart, RotateCcw } from "lucide-react";
import type { Recipe } from "@mealdeals/api/client";
import { RecipeFeedbackButtons } from "@/components/features/recipe-feedback-buttons";
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

interface SavedRecipeCardProps {
  recipe: Recipe & {
    plan: { id: string; createdAt: Date };
  };
}

export function SavedRecipeCard({ recipe }: SavedRecipeCardProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {recipe.makeRegularly ? (
                <Badge variant="secondary">
                  <RotateCcw className="mr-1 size-3" />
                  Régulier
                </Badge>
              ) : null}
              {recipe.isFavorite ? (
                <Badge variant="outline">
                  <Heart className="mr-1 size-3" />
                  Favori
                </Badge>
              ) : null}
              <Badge variant="outline">{recipe.prepMinutes} min</Badge>
            </div>
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
            <CardDescription>{recipe.description}</CardDescription>
            <p className="text-xs text-muted-foreground">
              <Calendar className="mr-1 inline size-3" />
              Menu du{" "}
              {recipe.plan.createdAt.toLocaleDateString("fr-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Link
            href={`/resultats/${recipe.plan.id}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Voir le menu
            <ArrowRight className="ml-1 size-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <RecipeFeedbackButtons
          recipeId={recipe.id}
          isFavorite={recipe.isFavorite}
          makeRegularly={recipe.makeRegularly}
          size="sm"
        />
      </CardContent>
    </Card>
  );
}
