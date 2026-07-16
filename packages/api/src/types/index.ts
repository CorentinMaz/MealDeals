import type {
  groceryStores,
  promotions,
  recipes,
  userPreferences,
} from "../db/schema";

export type GroceryStore = typeof groceryStores.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type PromotionWithStore = Promotion & {
  store: Pick<GroceryStore, "id" | "name" | "slug" | "logoUrl">;
};

export type SerializedUserPreferences = Omit<
  UserPreferences,
  "weeklyBudget" | "updatedAt"
> & {
  weeklyBudget: number;
  updatedAt: string;
};

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export type MessageParams = Record<string, string | number>;

export type ErrorCode =
  | "PREFERENCES_NOT_FOUND"
  | "NO_ACTIVE_PROMOTIONS"
  | "UNSUPPORTED_PROMOTION_PROVIDER"
  | "STORE_NOT_FOUND"
  | "SYNC_UNKNOWN_ERROR"
  | "SYNC_UNKNOWN_ERROR_PER_STORE"
  | "FLIPP_FLYERS_FETCH_FAILED"
  | "FLIPP_ITEMS_FETCH_FAILED"
  | "ANTHROPIC_API_KEY_REQUIRED"
  | "OPENAI_API_KEY_REQUIRED"
  | "AI_INVALID_RESPONSE"
  | "AI_EMPTY_RESPONSE"
  | "AI_OVERLOADED"
  | "AI_RATE_LIMITED"
  | "UNSUPPORTED_AI_PROVIDER";
