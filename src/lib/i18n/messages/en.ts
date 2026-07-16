import type { Messages } from "@/lib/i18n/types";
import { uiMessagesEn } from "@/lib/i18n/ui-messages";

export const en: Messages = {
  ...uiMessagesEn,
  errors: {
    PREFERENCES_NOT_FOUND: "User preferences not found",
    NO_ACTIVE_PROMOTIONS:
      "No active promotions. Sync flyers first.",
    UNSUPPORTED_PROMOTION_PROVIDER:
      "Unsupported promotion provider: {providerId}",
    STORE_NOT_FOUND: "Grocery store not found",
    SYNC_UNKNOWN_ERROR: "Unknown sync error",
    SYNC_UNKNOWN_ERROR_PER_STORE: "Unknown error",
    FLIPP_FLYERS_FETCH_FAILED:
      "Failed to fetch Flipp flyers ({status}) for {merchant}",
    FLIPP_ITEMS_FETCH_FAILED:
      "Failed to fetch Flipp products ({status}) for flyer {flyerId}",
    ANTHROPIC_API_KEY_REQUIRED:
      "ANTHROPIC_API_KEY is required to generate recipes.",
    OPENAI_API_KEY_REQUIRED:
      "OPENAI_API_KEY is required to generate recipes.",
    AI_INVALID_RESPONSE:
      "Invalid AI response — unexpected format. Please try again.",
    AI_EMPTY_RESPONSE: "Empty AI response — no content received.",
    AI_OVERLOADED:
      "The AI service is overloaded right now. Please try again in a moment.",
    AI_RATE_LIMITED:
      "Too many requests sent to the AI. Wait a moment and try again.",
    UNSUPPORTED_AI_PROVIDER: "Unsupported AI provider: {provider}",
    UPDATE_ERROR: "Update failed",
    SAVE_ERROR: "Save failed",
    GENERATION_ERROR: "Generation failed",
    SYNC_ERROR: "Sync failed",
    SELECT_FITNESS_GOAL: "Choose a nutrition goal.",
    MIN_CALORIE_TARGET: "Calorie target must be at least 1200 kcal.",
  },
  success: {
    POSTAL_CODE_UPDATED: "Postal code updated",
    PREFERENCES_SAVED: "Preferences saved",
    NUTRITION_GOALS_SAVED: "Nutrition goals saved",
    RECIPE_FAVORITE_ADDED: "Recipe added to favorites",
    RECIPE_FAVORITE_REMOVED: "Recipe removed from favorites",
    RECIPE_REGULAR_ADDED:
      "Recipe marked to make regularly — AI will take this into account",
    RECIPE_REGULAR_REMOVED: "Recipe removed from regular meals",
    SYNC_SUCCESS:
      "{successCount}/{total} stores synced ({totalItems} promotions)",
  },
  language: {
    title: "Language",
    description: "Choose the language for the interface and messages.",
    fr: "Français",
    en: "English",
    saved: "Language updated",
  },
};
