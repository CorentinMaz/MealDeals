import type { Locale } from "@/lib/i18n/types";

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
