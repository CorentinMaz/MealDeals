import { RecipeIngredientList } from "@/components/features/recipe-ingredient-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RecipeFeedbackButtons } from "@/components/features/recipe-feedback-buttons";
import type {
  PromotionSnapshot,
  RecipeIngredientRef,
} from "@/lib/promotions/types";
import type { Recipe } from "@/generated/prisma/client";
import { Heart, RotateCcw } from "lucide-react";

type RecipeCardLabels = {
  onSale: string;
  flyerPrice: string;
  regularPrice: string;
  discount: string;
  promoUnavailable: string;
  ingredients: string;
  steps: string;
  regular: string;
  favorite: string;
};

export function RecipeCard({
  recipe,
  promotions = [],
  labels,
}: {
  recipe: Recipe;
  promotions?: PromotionSnapshot[];
  labels: RecipeCardLabels;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{recipe.difficulty}</Badge>
            <Badge variant="outline">{recipe.prepMinutes} min</Badge>
            <Badge variant="secondary">
              ~{recipe.estimatedCost.toString()}$
            </Badge>
            {recipe.makeRegularly ? (
              <Badge variant="secondary">
                <RotateCcw className="mr-1 size-3" />
                {labels.regular}
              </Badge>
            ) : null}
            {recipe.isFavorite ? (
              <Badge variant="outline">
                <Heart className="mr-1 size-3 fill-current" />
                {labels.favorite}
              </Badge>
            ) : null}
          </div>
          <RecipeFeedbackButtons
            recipeId={recipe.id}
            isFavorite={recipe.isFavorite}
            makeRegularly={recipe.makeRegularly}
            size="sm"
          />
        </div>
        <CardTitle className="text-xl">{recipe.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{recipe.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {(recipe.calories || recipe.proteinG) && (
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {recipe.calories ? <span>{recipe.calories} kcal</span> : null}
            {recipe.proteinG ? (
              <span>{recipe.proteinG.toString()}g protéines</span>
            ) : null}
            {recipe.carbsG ? (
              <span>{recipe.carbsG.toString()}g glucides</span>
            ) : null}
            {recipe.fatG ? (
              <span>{recipe.fatG.toString()}g lipides</span>
            ) : null}
          </div>
        )}

        <RecipeIngredientList
          ingredients={
            recipe.ingredients as unknown as RecipeIngredientRef[]
          }
          promotions={promotions}
          ingredientsTitle={labels.ingredients}
          labels={{
            onSale: labels.onSale,
            flyerPrice: labels.flyerPrice,
            regularPrice: labels.regularPrice,
            discount: labels.discount,
            promoUnavailable: labels.promoUnavailable,
          }}
        />

        <Separator />

        <div>
          <h4 className="mb-2 font-medium">{labels.steps}</h4>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
