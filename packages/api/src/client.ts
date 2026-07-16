export * from "./types";
export * from "./services/promotions/types";
export {
  serializePromotionSnapshot,
  findPromotionForIngredient,
  bindIngredientsToActivePromotions,
  attachPromotionIdsToIngredients,
} from "./services/promotions/match-ingredient";
export {
  buildShoppingList,
  groupShoppingListByStore,
  type ShoppingListItem,
  type ShoppingListCategory,
} from "./services/shopping-list/generator";
export {
  buildStoreLookup,
  resolveStoreRef,
  type StoreRef,
} from "./services/stores/resolve";
export * from "./services/nutrition/types";
export {
  estimateDailyCalories,
  caloriesPerMeal,
  type CalorieTargetResult,
} from "./services/nutrition/calorie-target";
export {
  ACTIVITY_LEVEL_LABELS,
  calculateBmr,
  calculateDailyCalories,
  type BiologicalSex,
  type GeneralActivityLevel,
  type CalorieCalculatorInput,
  type CalorieCalculatorResult,
} from "./services/nutrition/calorie-calculator";
export type { GeneratedRecipe } from "./services/ai/client";
export type { SerializedUserPreferences } from "./types";
export { serializeUserPreferences } from "./preferences/serialize";
