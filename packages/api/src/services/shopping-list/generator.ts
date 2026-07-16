import type { GeneratedRecipe } from "../ai/client";
import { findPromotionForIngredient } from "../promotions/match-ingredient";
import type { PromotionSnapshot } from "../promotions/types";
import { buildStoreLookup, resolveStoreRef } from "../stores/resolve";

export interface ShoppingListItem {
  name: string;
  quantity: string;
  category: string;
  recommendedStore: string;
  storeSlug?: string;
  promotionId?: string;
  estimatedPrice: number;
  isOnSale: boolean;
}

export interface ShoppingListCategory {
  category: string;
  items: ShoppingListItem[];
}

const CATEGORY_RULES: Array<{ category: string; keywords: string[] }> = [
  { category: "Viandes & poissons", keywords: ["poulet", "boeuf", "bœuf", "porc", "saumon", "poisson", "crevette", "viande", "bacon", "jambon", "saucisse"] },
  { category: "Fruits & légumes", keywords: ["légume", "legume", "fruit", "salade", "brocoli", "tomate", "pomme", "banane", "oignon", "ail", "carotte", "courgette", "épinard", "epinard"] },
  { category: "Produits laitiers", keywords: ["lait", "fromage", "yogourt", "yaourt", "beurre", "crème", "creme"] },
  { category: "Épicerie", keywords: ["riz", "pâtes", "pates", "farine", "sucre", "huile", "sauce", "épice", "epice", "conserves", "bouillon"] },
  { category: "Boulangerie", keywords: ["pain", "tortilla", "pita", "bagel", "croûton", "crouton"] },
  { category: "Surgelés", keywords: ["surgelé", "surgele", "congelé", "congele"] },
];

function categorizeIngredient(name: string): string {
  const normalized = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category;
    }
  }
  return "Autres";
}

export function buildShoppingList(
  recipes: GeneratedRecipe[],
  storeNames: Record<string, string> = {},
): ShoppingListCategory[] {
  const aggregated = new Map<string, ShoppingListItem>();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.name.toLowerCase()}::${ingredient.storeSlug ?? "any"}`;
      const existing = aggregated.get(key);

      if (existing) {
        existing.quantity = `${existing.quantity} + ${ingredient.quantity}`;
        existing.estimatedPrice += ingredient.estimatedPrice ?? 0;
        existing.isOnSale = existing.isOnSale || ingredient.isOnSale;
        existing.promotionId = existing.promotionId ?? ingredient.promotionId;
        continue;
      }

      const storeSlug = ingredient.storeSlug;
      aggregated.set(key, {
        name: ingredient.name,
        quantity: ingredient.quantity,
        category: categorizeIngredient(ingredient.name),
        recommendedStore:
          (storeSlug && storeNames[storeSlug]) ||
          storeSlug ||
          "Épicerie locale",
        storeSlug,
        promotionId: ingredient.promotionId,
        estimatedPrice: ingredient.estimatedPrice ?? 0,
        isOnSale: ingredient.isOnSale,
      });
    }
  }

  const grouped = new Map<string, ShoppingListItem[]>();

  for (const item of aggregated.values()) {
    const items = grouped.get(item.category) ?? [];
    items.push(item);
    grouped.set(item.category, items);
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.name.localeCompare(b.name, "fr")),
    }))
    .sort((a, b) => a.category.localeCompare(b.category, "fr"));
}

function getItemStoreName(
  item: ShoppingListItem,
  promotions: PromotionSnapshot[],
  storeLookup: ReturnType<typeof buildStoreLookup>,
): string {
  if (item.isOnSale) {
    const promotion = findPromotionForIngredient(
      {
        name: item.name,
        quantity: item.quantity,
        isOnSale: item.isOnSale,
        storeSlug: item.storeSlug ?? item.recommendedStore,
        promotionId: item.promotionId,
        estimatedPrice: item.estimatedPrice,
      },
      promotions,
    );
    if (promotion) {
      return promotion.store.name;
    }
  }

  const store = resolveStoreRef(
    item.storeSlug ?? item.recommendedStore,
    storeLookup,
  );
  return store?.name ?? item.recommendedStore ?? "Épicerie locale";
}

export function groupShoppingListByStore(
  categories: ShoppingListCategory[],
  promotions: PromotionSnapshot[],
): ShoppingListCategory[] {
  const storeLookup = buildStoreLookup(promotions);
  const grouped = new Map<string, ShoppingListItem[]>();

  for (const category of categories) {
    for (const item of category.items) {
      const storeName = getItemStoreName(item, promotions, storeLookup);
      const items = grouped.get(storeName) ?? [];
      items.push(item);
      grouped.set(storeName, items);
    }
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.name.localeCompare(b.name, "fr")),
    }))
    .sort((a, b) => a.category.localeCompare(b.category, "fr"));
}
