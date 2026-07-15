import { GenerateRecipesForm } from "@/components/features/generate-recipes-form";
import { NutritionGoalsSummary } from "@/components/features/nutrition-goals-form";
import { PageShell } from "@/components/layout/page-shell";
import { getDashboardData, getSettingsData } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const [data, { household }] = await Promise.all([
    getDashboardData(),
    getSettingsData(),
  ]);
  const preferences = household?.preferences;

  return (
    <PageShell width="md">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Générer des recettes
          </h1>
          <p className="text-sm text-muted-foreground">
            L&apos;IA crée un menu hebdomadaire en privilégiant les produits en
            promotion et en réutilisant les ingrédients.
          </p>
          {preferences ? (
            <NutritionGoalsSummary preferences={preferences} />
          ) : null}
        </div>

        <GenerateRecipesForm promotionCount={data.promotionCount} />
      </div>
    </PageShell>
  );
}
