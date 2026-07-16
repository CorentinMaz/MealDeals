import {
  extractUnit,
  isLikelyFoodItem,
  parsePrice,
} from "../food-filter";
import { createAppError } from "../../../errors";
import { localeToFlippLocale } from "../../../locale";
import type { Locale } from "../../../types";
import type {
  FlippFlyer,
  FlippFlyerItem,
  PromotionProvider,
  RawPromotion,
} from "../types";

const FLIPP_DATA_URL = "https://flyers-ng.flippback.com/api/flipp/data";
const FLIPP_ITEMS_URL = "https://flyers-ng.flippback.com/api/flipp/flyers";

function generateSessionId(): string {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 10).toString(),
  ).join("");
}

function normalizeCategories(
  categories?: string[] | string,
): string[] {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories;
  return categories.split(",").map((value) => value.trim());
}

function pickCurrentFlyer(
  flyers: FlippFlyer[],
  merchant: string,
): FlippFlyer | undefined {
  const now = Date.now();
  const matches = flyers
    .filter((flyer) => flyer.merchant.toLowerCase() === merchant.toLowerCase())
    .filter((flyer) => {
      const categories = normalizeCategories(flyer.categories);
      return (
        categories.length === 0 ||
        categories.some((category) =>
          ["groceries", "épicerie", "epicerie", "all flyers"].includes(
            category.toLowerCase(),
          ),
        )
      );
    })
    .filter((flyer) => {
      const validFrom = new Date(flyer.valid_from).getTime();
      const validTo = new Date(flyer.valid_to).getTime();
      return validFrom <= now && now <= validTo;
    })
    .sort((a, b) => b.id - a.id);

  return matches[0];
}

function mapFlyerItem(item: FlippFlyerItem): RawPromotion | null {
  const salePrice = parsePrice(item.price);
  if (!salePrice || salePrice <= 0) return null;
  if (!isLikelyFoodItem(item.name)) return null;

  return {
    externalId: String(item.id),
    name: item.name.trim(),
    brand: item.brand ?? undefined,
    salePrice,
    unit: extractUnit(item.name),
    imageUrl: item.cutout_image_url,
    validFrom: new Date(item.valid_from),
    validTo: new Date(item.valid_to),
    isFood: true,
    rawData: item as unknown as Record<string, unknown>,
  };
}

export class FlippPromotionProvider implements PromotionProvider {
  id = "flipp" as const;

  async fetchPromotions(input: {
    merchant: string;
    postalCode: string;
    locale?: Locale;
  }): Promise<RawPromotion[]> {
    const sid = generateSessionId();
    const postalCode = input.postalCode.replace(/\s/g, "").toUpperCase();
    const flippLocale = localeToFlippLocale(input.locale ?? "fr");

    const flyersResponse = await fetch(
      `${FLIPP_DATA_URL}?locale=${flippLocale}&postal_code=${postalCode}&sid=${sid}`,
      { next: { revalidate: 0 } },
    );

    if (!flyersResponse.ok) {
      throw createAppError("FLIPP_FLYERS_FETCH_FAILED", {
        status: flyersResponse.status,
        merchant: input.merchant,
      });
    }

    const flyersData = (await flyersResponse.json()) as {
      flyers?: FlippFlyer[];
    };

    const flyer = pickCurrentFlyer(flyersData.flyers ?? [], input.merchant);
    if (!flyer) {
      return [];
    }

    const itemsResponse = await fetch(
      `${FLIPP_ITEMS_URL}/${flyer.id}/flyer_items?locale=${flippLocale}&sid=${sid}`,
      { next: { revalidate: 0 } },
    );

    if (!itemsResponse.ok) {
      throw createAppError("FLIPP_ITEMS_FETCH_FAILED", {
        status: itemsResponse.status,
        flyerId: flyer.id,
      });
    }

    const items = (await itemsResponse.json()) as FlippFlyerItem[];

    return items
      .map(mapFlyerItem)
      .filter((item): item is RawPromotion => item !== null);
  }
}

export const flippProvider = new FlippPromotionProvider();
