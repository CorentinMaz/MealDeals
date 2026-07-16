import type {
  PromotionSnapshot,
  RecipeIngredientRef,
} from "./types";
import type { Promotion } from "../../types";

type PromotionWithStore = Promotion & {
  store: { name: string; slug: string; logoUrl?: string | null };
};

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreIngredientPromotionMatch(
  ingredientName: string,
  promotionName: string,
): number {
  const ingredient = normalizeName(ingredientName);
  const promotion = normalizeName(promotionName);

  if (!ingredient || !promotion) {
    return 0;
  }

  if (ingredient === promotion) {
    return 100;
  }

  if (promotion.includes(ingredient) || ingredient.includes(promotion)) {
    return 80;
  }

  const ingredientWords = ingredient.split(" ").filter((word) => word.length > 2);
  if (ingredientWords.length === 0) {
    return 0;
  }

  const matchedWords = ingredientWords.filter((word) =>
    promotion.includes(word),
  ).length;

  if (matchedWords === 0) {
    return 0;
  }

  return 45 + (matchedWords / ingredientWords.length) * 40;
}

export function serializePromotionSnapshot(
  promotion: PromotionWithStore,
): PromotionSnapshot {
  return {
    id: promotion.id,
    name: promotion.name,
    salePrice: promotion.salePrice?.toString() ?? null,
    regularPrice: promotion.regularPrice?.toString() ?? null,
    unit: promotion.unit,
    discountPct: promotion.discountPct,
    imageUrl: promotion.imageUrl,
    store: {
      name: promotion.store.name,
      slug: promotion.store.slug,
      logoUrl: promotion.store.logoUrl ?? null,
    },
  };
}

export function findPromotionForIngredient(
  ingredient: RecipeIngredientRef,
  promotions: PromotionSnapshot[],
): PromotionSnapshot | null {
  if (!ingredient.isOnSale) {
    return null;
  }

  if (ingredient.promotionId) {
    const byId = promotions.find(
      (promotion) => promotion.id === ingredient.promotionId,
    );
    if (byId) {
      return byId;
    }
  }

  const candidates = promotions.filter(
    (promotion) =>
      !ingredient.storeSlug ||
      promotion.store.slug === ingredient.storeSlug,
  );

  let best: { promotion: PromotionSnapshot; score: number } | null = null;

  for (const promotion of candidates) {
    const score = scoreIngredientPromotionMatch(ingredient.name, promotion.name);
    if (score >= 50 && (!best || score > best.score)) {
      best = { promotion, score };
    }
  }

  return best?.promotion ?? null;
}

export function bindIngredientsToActivePromotions<
  T extends RecipeIngredientRef,
>(ingredients: T[], promotions: PromotionWithStore[]): T[] {
  const snapshots = promotions.map(serializePromotionSnapshot);
  const promotionById = new Map(promotions.map((promotion) => [promotion.id, promotion]));

  return ingredients.map((ingredient) => {
    if (!ingredient.isOnSale) {
      return ingredient;
    }

    const match = findPromotionForIngredient(
      { ...ingredient, isOnSale: true },
      snapshots,
    );

    if (!match) {
      return {
        ...ingredient,
        isOnSale: false,
        promotionId: undefined,
        storeSlug: undefined,
      };
    }

    const promotion = promotionById.get(match.id);
    const salePrice = promotion?.salePrice
      ? Number(promotion.salePrice)
      : ingredient.estimatedPrice;

    return {
      ...ingredient,
      isOnSale: true,
      promotionId: match.id,
      storeSlug: promotion?.store.slug ?? ingredient.storeSlug,
      estimatedPrice: salePrice ?? ingredient.estimatedPrice,
    };
  });
}

/** @deprecated Use bindIngredientsToActivePromotions */
export function attachPromotionIdsToIngredients<
  T extends RecipeIngredientRef,
>(ingredients: T[], promotions: PromotionWithStore[]): T[] {
  return bindIngredientsToActivePromotions(ingredients, promotions);
}
