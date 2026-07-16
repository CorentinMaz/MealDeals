import type { PromotionSnapshot } from "@/lib/promotions/types";

export type StoreRef = {
  name: string;
  slug?: string;
};

export function buildStoreLookup(
  promotions: PromotionSnapshot[],
): Record<string, StoreRef> {
  const lookup: Record<string, StoreRef> = {};

  for (const promotion of promotions) {
    lookup[promotion.store.slug] = {
      name: promotion.store.name,
      slug: promotion.store.slug,
    };
  }

  return lookup;
}

export function resolveStoreRef(
  storeSlugOrName: string | undefined,
  lookup: Record<string, StoreRef>,
): StoreRef | null {
  if (!storeSlugOrName || storeSlugOrName === "Épicerie locale") {
    return null;
  }

  if (lookup[storeSlugOrName]) {
    return lookup[storeSlugOrName];
  }

  const byName = Object.values(lookup).find(
    (store) => store.name.toLowerCase() === storeSlugOrName.toLowerCase(),
  );

  return byName ?? { name: storeSlugOrName };
}
