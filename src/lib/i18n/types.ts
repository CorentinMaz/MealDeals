export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_COOKIE = "meal-deals-locale";

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
  | "UNSUPPORTED_AI_PROVIDER"
  | "UPDATE_ERROR"
  | "SAVE_ERROR"
  | "GENERATION_ERROR"
  | "SYNC_ERROR"
  | "SELECT_FITNESS_GOAL"
  | "MIN_CALORIE_TARGET";

export type SuccessCode =
  | "POSTAL_CODE_UPDATED"
  | "PREFERENCES_SAVED"
  | "NUTRITION_GOALS_SAVED"
  | "RECIPE_FAVORITE_ADDED"
  | "RECIPE_FAVORITE_REMOVED"
  | "RECIPE_REGULAR_ADDED"
  | "RECIPE_REGULAR_REMOVED"
  | "SYNC_SUCCESS";

export interface Messages {
  errors: Record<ErrorCode, string>;
  success: Record<SuccessCode, string>;
  language: {
    title: string;
    description: string;
    fr: string;
    en: string;
    saved: string;
  };
  nav: {
    menu: string;
    brand: string;
    dashboard: { label: string; description: string };
    promotions: { label: string; description: string };
    recipes: { label: string; description: string };
    history: { label: string; description: string };
    settings: { label: string; description: string };
  };
  common: Record<string, string>;
  notifications: Record<string, string>;
  pages: Record<string, Record<string, string>>;
  forms: Record<string, string>;
  nutrition: {
    modes: Record<string, string>;
    goals: Record<string, string>;
    goalDescriptions: Record<string, string>;
    difficulty: Record<string, string>;
    activity: Record<string, string>;
  };
}
