import { PageShell } from "@/components/layout/page-shell";
import { RecipePlanHistoryList } from "@/components/features/recipe-plan-history-list";
import { SavedRecipeCard } from "@/components/features/saved-recipe-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getRecipePlansHistory,
  getSavedRecipes,
} from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function HistoriquePage() {
  const [plans, savedRecipes] = await Promise.all([
    getRecipePlansHistory(),
    getSavedRecipes(),
  ]);

  const favorites = savedRecipes.filter((recipe) => recipe.isFavorite);
  const regulars = savedRecipes.filter((recipe) => recipe.makeRegularly);

  return (
    <PageShell width="lg">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Historique</h1>
          <p className="text-sm text-muted-foreground">
            Consultez vos menus passés, marquez vos recettes favorites et
            indiquez celles à refaire régulièrement — l&apos;IA en tiendra
            compte lors des prochaines générations.
          </p>
        </div>

        <Tabs defaultValue="menus">
          <TabsList>
            <TabsTrigger value="menus">
              Menus ({plans.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favoris ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="regulars">
              À refaire ({regulars.length})
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
                Aucune recette favorite. Marquez une recette avec le bouton
                « Favori » sur un menu généré.
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
                Aucune recette marquée à refaire. Utilisez le bouton « À
                refaire » pour indiquer à l&apos;IA les plats que vous aimez
                refaire souvent.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
