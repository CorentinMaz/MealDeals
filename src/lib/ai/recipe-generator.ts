import { buildSavedRecipesPromptSection } from "@/lib/ai/saved-recipes-prompt";
import { createAiClient } from "@/lib/ai/client";
import { buildNutritionPromptSection } from "@/lib/nutrition/prompt";
import { nutritionProfileFromPreferences } from "@/lib/nutrition/types";
import type { Promotion, Recipe, UserPreferences } from "@/generated/prisma/client";

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
      return `- ${promotion.name} (${promotion.store.name}) — ${price}$`;
    })
    .join("\n");

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

Promotions disponibles:
${promotionSummary}

Règles importantes:
1. Priorise les produits en promotion.
2. Réutilise les mêmes ingrédients entre plusieurs recettes pour limiter le gaspillage.
3. Complète avec des ingrédients non en promotion seulement si nécessaire.
4. Les recettes doivent être réalistes pour des familles québécoises.
5. ${requireNutrition ? "Inclus OBLIGATOIREMENT les valeurs nutritionnelles par portion." : "Inclus des valeurs nutritionnelles estimées par portion si possible."}

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
