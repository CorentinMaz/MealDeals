import type { Locale } from "../../types";

export type PromotionProviderId = "flipp";

export interface RawPromotion {
  externalId: string;
  name: string;
  brand?: string;
  category?: string;
  salePrice?: number;
  regularPrice?: number;
  unit?: string;
  discountPct?: number;
  imageUrl?: string;
  validFrom: Date;
  validTo: Date;
  isFood: boolean;
  rawData?: Record<string, unknown>;
}

export interface PromotionProvider {
  id: PromotionProviderId;
  fetchPromotions(input: {
    merchant: string;
    postalCode: string;
    config?: Record<string, unknown>;
    locale?: Locale;
  }): Promise<RawPromotion[]>;
}

export interface FlippFlyer {
  id: number;
  merchant: string;
  valid_from: string;
  valid_to: string;
  categories?: string[] | string;
}

export interface FlippFlyerItem {
  id: number;
  flyer_id: number;
  name: string;
  brand?: string | null;
  price?: string;
  pre_price_text?: string;
  post_price_text?: string;
  valid_from: string;
  valid_to: string;
  cutout_image_url?: string;
  display_type?: number;
}

/** Serializable promotion data for client-side ingredient hover previews. */
export type PromotionSnapshot = {
  id: string;
  name: string;
  salePrice: string | null;
  regularPrice: string | null;
  unit: string | null;
  discountPct: number | null;
  imageUrl: string | null;
  store: {
    name: string;
    slug: string;
    logoUrl: string | null;
  };
};

export type RecipeIngredientRef = {
  name: string;
  quantity: string;
  isOnSale?: boolean;
  storeSlug?: string;
  estimatedPrice?: number;
  promotionId?: string;
};
