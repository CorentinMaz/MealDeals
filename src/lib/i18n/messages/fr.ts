import type { Messages } from "@/lib/i18n/types";
import { uiMessagesFr } from "@/lib/i18n/ui-messages";

export const fr: Messages = {
  ...uiMessagesFr,
  errors: {
    PREFERENCES_NOT_FOUND: "On n'a pas trouvé tes préférences",
    NO_ACTIVE_PROMOTIONS:
      "Aucun rabais actif pour l'instant. Actualise les circulaires d'abord.",
    UNSUPPORTED_PROMOTION_PROVIDER:
      "Cette source de circulaires n'est pas encore supportée : {providerId}",
    STORE_NOT_FOUND: "Épicerie introuvable",
    SYNC_UNKNOWN_ERROR: "La mise à jour des circulaires a échoué",
    SYNC_UNKNOWN_ERROR_PER_STORE: "Erreur inconnue",
    FLIPP_FLYERS_FETCH_FAILED:
      "Impossible de récupérer les circulaires Flipp ({status}) pour {merchant}",
    FLIPP_ITEMS_FETCH_FAILED:
      "Impossible de récupérer les produits Flipp ({status}) pour la circulaire {flyerId}",
    ANTHROPIC_API_KEY_REQUIRED:
      "Il manque la clé ANTHROPIC_API_KEY pour créer des recettes.",
    OPENAI_API_KEY_REQUIRED:
      "Il manque la clé OPENAI_API_KEY pour créer des recettes.",
    AI_INVALID_RESPONSE:
      "Réponse inattendue — réessaie dans un instant.",
    AI_EMPTY_RESPONSE: "Réponse vide — on n'a rien reçu. Réessaie ?",
    UNSUPPORTED_AI_PROVIDER: "Ce fournisseur n'est pas supporté : {provider}",
    UPDATE_ERROR: "La mise à jour a échoué",
    SAVE_ERROR: "L'enregistrement a échoué",
    GENERATION_ERROR: "La création du menu a échoué",
    SYNC_ERROR: "La mise à jour des circulaires a échoué",
    SELECT_FITNESS_GOAL: "Choisis un objectif nutritionnel.",
    MIN_CALORIE_TARGET:
      "L'objectif calorique doit être d'au moins 1200 kcal.",
  },
  success: {
    POSTAL_CODE_UPDATED: "Code postal enregistré",
    PREFERENCES_SAVED: "Préférences enregistrées",
    NUTRITION_GOALS_SAVED: "Objectifs enregistrés",
    RECIPE_FAVORITE_ADDED: "Ajouté à tes coups de cœur",
    RECIPE_FAVORITE_REMOVED: "Retiré de tes coups de cœur",
    RECIPE_REGULAR_ADDED:
      "Marqué comme classique — on s'en souviendra pour la prochaine fois",
    RECIPE_REGULAR_REMOVED: "Retiré de tes classiques",
    SYNC_SUCCESS:
      "{successCount}/{total} épiceries mises à jour ({totalItems} rabais)",
  },
  language: {
    title: "Langue",
    description: "Choisis la langue de l'interface.",
    fr: "Français",
    en: "English",
    saved: "Langue mise à jour",
  },
};
