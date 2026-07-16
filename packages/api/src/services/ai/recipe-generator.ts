import { buildSavedRecipesPromptSection } from "./saved-recipes-prompt";
import { createAiClient } from "./client";
import { buildNutritionPromptSection } from "../nutrition/prompt";
import { nutritionProfileFromPreferences } from "../nutrition/types";
import type { Promotion, Recipe, UserPreferences } from "../../types";

interface GenerateRecipesInput {
  recipeCount: number;
  promotions: Array<
    Promotion & {
      store: { name: string; slug: string };
    }
  >;
  preferences: UserPreferences;
  savedRecipes?: {
    favorites: Recipe[];
    regulars: Recipe[];
  };
}

export async function generateRecipesFromPromotions(
  input: GenerateRecipesInput,
) {
  const promotionSummary = input.promotions
    .slice(0, 120)
    .map((promotion) => {
      const price = promotion.salePrice?.toString() ?? "?";
      return `- ${promotion.name} [${promotion.store.slug}] (${promotion.store.name}) — ${price}$`;
    })
    .join("\n");

  const storeSlugs = [
    ...new Set(input.promotions.map((promotion) => promotion.store.slug)),
  ].join(", ");

  const nutritionProfile = nutritionProfileFromPreferences(input.preferences);
  const nutritionSection = buildNutritionPromptSection(
    nutritionProfile,
    input.recipeCount,
  );
  const requireNutrition =
    nutritionProfile.nutritionMode === "guided" &&
    nutritionProfile.fitnessGoal !== null;

  const savedRecipesSection = input.savedRecipes
    ? buildSavedRecipesPromptSection(
        input.savedRecipes.favorites,
        input.savedRecipes.regulars,
      )
    : "";

  const prompt = `
Génère exactement ${input.recipeCount} recettes pour une semaine au Québec.

Contraintes:
- Allergies: ${input.preferences.allergies.join(", ") || "aucune"}
- Régimes: ${input.preferences.diets.join(", ") || "aucun"}
- Aliments aimés: ${input.preferences.likedFoods.join(", ") || "aucun"}
- Aliments refusés: ${input.preferences.dislikedFoods.join(", ") || "aucun"}
- Temps max de préparation: ${input.preferences.maxPrepMinutes} minutes
- Budget hebdomadaire approximatif: ${input.preferences.weeklyBudget}$
${nutritionSection}
${savedRecipesSection}

Promotions en cours (circulaires actuelles uniquement):
${promotionSummary}

Règles importantes:
1. Priorise les produits listés ci-dessus.
2. Réutilise les mêmes ingrédients entre plusieurs recettes pour limiter le gaspillage.
3. Complète avec des ingrédients non en promotion seulement si nécessaire.
4. Les recettes doivent être réalistes pour des familles québécoises.
5. ${requireNutrition ? "Inclus OBLIGATOIREMENT les valeurs nutritionnelles par portion." : "Inclus des valeurs nutritionnelles estimées par portion si possible."}
6. isOnSale ne peut être true QUE si l'ingrédient correspond à un produit de la liste « Promotions en cours ».
7. Si isOnSale est true, storeSlug doit être le slug exact entre crochets du produit (ex: ${storeSlugs || "maxi"}).
8. N'invente aucun rabais et n'utilise jamais un produit absent de la liste ci-dessus.

Réponds avec ce JSON:
{
  "recipes": [
    {
      "name": "string",
      "description": "string",
      "prepMinutes": 30,
      "difficulty": "facile|moyen|difficile",
      "estimatedCost": 12.5,
      "calories": 450,
      "proteinG": 25,
      "carbsG": 40,
      "fatG": 15,
      "ingredients": [
        {
          "name": "poulet",
          "quantity": "500 g",
          "isOnSale": true,
          "storeSlug": "maxi",
          "estimatedPrice": 8.99
        }
      ],
      "steps": ["étape 1", "étape 2"]
    }
  ],
  "sharedIngredients": ["ingrédient réutilisé"]
}
`;

  const ai = createAiClient();
  return ai.generateRecipes(prompt);
}
