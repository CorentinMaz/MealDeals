import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RecipeFeedbackButtons } from "@/components/features/recipe-feedback-buttons";
import type { Recipe } from "@/generated/prisma/client";
import { Heart, RotateCcw } from "lucide-react";

interface RecipeIngredient {
  name: string;
  quantity: string;
  isOnSale?: boolean;
  storeSlug?: string;
  estimatedPrice?: number;
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const ingredients = recipe.ingredients as unknown as RecipeIngredient[];

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
                Régulier
              </Badge>
            ) : null}
            {recipe.isFavorite ? (
              <Badge variant="outline">
                <Heart className="mr-1 size-3 fill-current" />
                Favori
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

        <div>
          <h4 className="mb-2 font-medium">Ingrédients</h4>
          <ul className="space-y-1 text-sm">
            {ingredients.map((ingredient) => (
              <li key={`${ingredient.name}-${ingredient.quantity}`}>
                {ingredient.quantity} {ingredient.name}
                {ingredient.isOnSale ? (
                  <span className="ml-2 text-primary">en promo</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="mb-2 font-medium">Étapes</h4>
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
