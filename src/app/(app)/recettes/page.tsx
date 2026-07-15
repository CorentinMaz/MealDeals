import { GenerateRecipesForm } from "@/components/features/generate-recipes-form";
import { NutritionGoalsSummary } from "@/components/features/nutrition-goals-form";
import { PageShell } from "@/components/layout/page-shell";
import { getServerTranslator } from "@/lib/i18n/server";
import { getDashboardData, getSettingsData } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const [data, { household }] = await Promise.all([
    getDashboardData(),
    getSettingsData(),
  ]);
  const preferences = household?.preferences;
  const t = await getServerTranslator();

  return (
    <PageShell width="md">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {t("pages.recipes.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("pages.recipes.subtitle")}
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
