import {
  caloriesPerMeal,
  estimateDailyCalories,
} from "@/lib/nutrition/calorie-target";
import {
  FITNESS_GOAL_LABELS,
  type NutritionProfileInput,
} from "@/lib/nutrition/types";

export function buildNutritionPromptSection(
  profile: NutritionProfileInput,
  recipeCount: number,
): string {
  if (profile.nutritionMode === "recipes_only") {
    return `
Mode nutrition: recettes seulement (pas d'objectif calorique).
- Propose des recettes équilibrées et savoureuses.
- Les valeurs nutritionnelles par portion sont optionnelles mais appréciées.`;
  }

  if (!profile.fitnessGoal) {
    return `
Mode nutrition: objectifs activés mais objectif principal non défini.
- Propose des recettes équilibrées avec valeurs nutritionnelles par portion.`;
  }

  const calorieTarget = estimateDailyCalories(profile);
  const goalLabel = FITNESS_GOAL_LABELS[profile.fitnessGoal];

  const activities: string[] = [];
  if (profile.activityGym) {
    const sessions = profile.gymSessionsPerWeek ?? 0;
    activities.push(
      `musculation (${sessions} séance${sessions > 1 ? "s" : ""}/semaine)`,
    );
  }
  if (profile.activityRunning) {
    const sessions = profile.runningSessionsPerWeek ?? 0;
    activities.push(
      `course à pied (${sessions} séance${sessions > 1 ? "s" : ""}/semaine)`,
    );
  }

  const activityLine =
    activities.length > 0
      ? `- Activités physiques: ${activities.join(", ")}`
      : "- Activités physiques: non précisées";

  let calorieSection = "";
  if (calorieTarget) {
    const perMeal = caloriesPerMeal(calorieTarget.dailyCalories, recipeCount);
    const source = calorieTarget.isEstimated
      ? "estimé selon objectif et activité"
      : "objectif manuel";
    calorieSection = `
- Objectif calorique journalier: ~${calorieTarget.dailyCalories} kcal (${source})
- Cible par repas (sur ${recipeCount} recettes): ~${perMeal} kcal/repas`;
  }

  const goalGuidance = goalGuidanceFor(profile.fitnessGoal, profile);

  return `
Mode nutrition: objectifs guidés
- Objectif principal: ${goalLabel}
${activityLine}
${calorieSection}

Directives selon l'objectif:
${goalGuidance}

Règles nutritionnelles:
- Inclus OBLIGATOIREMENT calories, protéines (g), glucides (g) et lipides (g) par portion pour chaque recette.
- Ajuste les portions et la densité calorique selon l'objectif et l'activité physique.
- Pour la prise de masse avec entraînement intense: privilégie protéines élevées (30-45g/repas) et glucides autour des besoins énergétiques.
- Pour la course: inclure des glucides complexes et une bonne hydratation dans les recettes adaptées.`;
}

function goalGuidanceFor(
  goal: NutritionProfileInput["fitnessGoal"],
  profile: NutritionProfileInput,
): string {
  switch (goal) {
    case "bulking":
      return `- Prise de masse: repas caloriques, portions généreuses, protéines à chaque repas.
- Favorise riz, pâtes, patates, viandes, œufs, produits laitiers selon les préférences.
${profile.activityGym ? "- Post-entraînement: repas avec protéines + glucides pour la récupération." : ""}
${profile.activityRunning ? "- Compense l'effort de course avec des glucides et calories suffisantes." : ""}`;
    case "cutting":
      return `- Perte de poids: repas rassasiants mais moins caloriques, protéines élevées.
- Privilégie légumes, protéines maigres, portions contrôlées.
- Évite les sauces très caloriques et les excès de gras ajoutés.`;
    case "maintenance":
      return `- Maintien: équilibre calorique, variété, portions modérées.
- Protéines adéquates pour soutenir l'activité physique sans surplus calorique.`;
    default:
      return "- Équilibre les macronutriments de façon réaliste.";
  }
}
