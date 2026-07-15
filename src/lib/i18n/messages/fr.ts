import type { Messages } from "@/lib/i18n/types";
import { uiMessagesFr } from "@/lib/i18n/ui-messages";

export const fr: Messages = {
  ...uiMessagesFr,
  errors: {
    PREFERENCES_NOT_FOUND: "Préférences utilisateur introuvables",
    NO_ACTIVE_PROMOTIONS:
      "Aucune promotion active. Synchronisez d'abord les circulaires.",
    UNSUPPORTED_PROMOTION_PROVIDER:
      "Fournisseur de promotions non pris en charge : {providerId}",
    STORE_NOT_FOUND: "Épicerie introuvable",
    SYNC_UNKNOWN_ERROR: "Erreur de synchronisation inconnue",
    SYNC_UNKNOWN_ERROR_PER_STORE: "Erreur inconnue",
    FLIPP_FLYERS_FETCH_FAILED:
      "Échec de la récupération des circulaires Flipp ({status}) pour {merchant}",
    FLIPP_ITEMS_FETCH_FAILED:
      "Échec de la récupération des produits Flipp ({status}) pour la circulaire {flyerId}",
    ANTHROPIC_API_KEY_REQUIRED:
      "La clé ANTHROPIC_API_KEY est requise pour générer des recettes.",
    OPENAI_API_KEY_REQUIRED:
      "La clé OPENAI_API_KEY est requise pour générer des recettes.",
    AI_INVALID_RESPONSE:
      "Réponse IA invalide — format inattendu. Veuillez réessayer.",
    AI_EMPTY_RESPONSE: "Réponse IA vide — aucun contenu reçu.",
    UNSUPPORTED_AI_PROVIDER: "Fournisseur IA non pris en charge : {provider}",
    UPDATE_ERROR: "Erreur de mise à jour",
    SAVE_ERROR: "Erreur de sauvegarde",
    GENERATION_ERROR: "Erreur lors de la génération",
    SYNC_ERROR: "Erreur lors de la synchronisation",
    SELECT_FITNESS_GOAL: "Choisissez un objectif nutritionnel.",
    MIN_CALORIE_TARGET:
      "L'objectif calorique doit être d'au moins 1200 kcal.",
  },
  success: {
    POSTAL_CODE_UPDATED: "Code postal mis à jour",
    PREFERENCES_SAVED: "Préférences enregistrées",
    NUTRITION_GOALS_SAVED: "Objectifs nutritionnels enregistrés",
    RECIPE_FAVORITE_ADDED: "Recette ajoutée aux favoris",
    RECIPE_FAVORITE_REMOVED: "Recette retirée des favoris",
    RECIPE_REGULAR_ADDED:
      "Recette marquée à refaire régulièrement — l'IA en tiendra compte",
    RECIPE_REGULAR_REMOVED: "Recette retirée des plats réguliers",
    SYNC_SUCCESS:
      "{successCount}/{total} épiceries synchronisées ({totalItems} promotions)",
  },
  language: {
    title: "Langue",
    description: "Choisissez la langue de l'interface et des messages.",
    fr: "Français",
    en: "English",
    saved: "Langue mise à jour",
  },
};
