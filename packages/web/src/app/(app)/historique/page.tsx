import { PageShell } from "@/components/layout/page-shell";
import { RecipePlanHistoryList } from "@/components/features/recipe-plan-history-list";
import { SavedRecipeCard } from "@/components/features/saved-recipe-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerTranslator } from "@/lib/i18n/server";
import {
  getRecipePlansHistory,
  getSavedRecipes,
} from "@mealdeals/api";

export const dynamic = "force-dynamic";

export default async function HistoriquePage() {
  const [plans, savedRecipes] = await Promise.all([
    getRecipePlansHistory(),
    getSavedRecipes(),
  ]);
  const t = await getServerTranslator();

  const favorites = savedRecipes.filter((recipe) => recipe.isFavorite);
  const regulars = savedRecipes.filter((recipe) => recipe.makeRegularly);

  return (
    <PageShell width="lg">
      <div className="space-y-6">
        <div>
          <h1>{t("pages.history.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("pages.history.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="menus">
          <TabsList>
            <TabsTrigger value="menus">
              {t("pages.history.tabMenus", { count: plans.length })}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              {t("pages.history.tabFavorites", { count: favorites.length })}
            </TabsTrigger>
            <TabsTrigger value="regulars">
              {t("pages.history.tabRegulars", { count: regulars.length })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menus" className="mt-6">
            <RecipePlanHistoryList plans={plans} />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6 space-y-4">
            {favorites.length > 0 ? (
              favorites.map((recipe) => (
                <SavedRecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("pages.history.noFavorites")}
              </p>
            )}
          </TabsContent>

          <TabsContent value="regulars" className="mt-6 space-y-4">
            {regulars.length > 0 ? (
              regulars.map((recipe) => (
                <SavedRecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("pages.history.noRegulars")}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
