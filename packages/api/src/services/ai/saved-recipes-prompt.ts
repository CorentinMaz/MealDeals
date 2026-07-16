import type { Recipe } from "../../types";

interface RecipeIngredient {
  name: string;
  quantity: string;
}

function ingredientSummary(ingredients: unknown): string {
  const items = ingredients as RecipeIngredient[];
  return items
    .slice(0, 6)
    .map((item) => item.name)
    .join(", ");
}

export function buildSavedRecipesPromptSection(
  favorites: Recipe[],
  regulars: Recipe[],
): string {
  if (favorites.length === 0 && regulars.length === 0) {
    return "";
  }

  const regularLines = regulars.map(
    (recipe) =>
      `- ${recipe.name} (à refaire régulièrement) — ${ingredientSummary(recipe.ingredients)}`,
  );
  const favoriteLines = favorites
    .filter((recipe) => !recipe.makeRegularly)
    .map(
      (recipe) =>
        `- ${recipe.name} (favori) — ${ingredientSummary(recipe.ingredients)}`,
    );

  const lines = [...regularLines, ...favoriteLines];
  if (lines.length === 0) {
    return "";
  }

  return `
Historique des recettes appréciées par l'utilisateur:
${lines.join("\n")}

Directives liées à l'historique:
- Priorise des recettes similaires aux plats « à refaire régulièrement » quand les promotions le permettent.
- Inspire-toi des favoris pour le style, les ingrédients et le type de cuisine.
- Tu peux proposer des variantes proches de ces recettes sans les copier mot pour mot.`;
}
