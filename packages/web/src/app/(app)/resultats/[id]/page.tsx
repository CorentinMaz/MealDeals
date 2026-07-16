import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecipeCard } from "@/components/features/recipe-card";
import { PlanExportButtons } from "@/components/features/plan-export-buttons";
import { PlanNutritionSummary } from "@/components/features/plan-nutrition-summary";
import { ShoppingListSortProvider } from "@/components/features/shopping-list-sort-context";
import { ShoppingListView } from "@/components/features/shopping-list-view";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShoppingListCategory } from "@mealdeals/api";
import { cn } from "@/lib/utils";
import { getServerLocale, getServerTranslator } from "@/lib/i18n/server";
import { serializePromotionSnapshot } from "@mealdeals/api";
import { getActivePromotions } from "@mealdeals/api";
import { getRecipePlan, getSettingsData } from "@mealdeals/api";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plan, { household }, promotions, t, locale] = await Promise.all([
    getRecipePlan(id),
    getSettingsData(),
    getActivePromotions(),
    getServerTranslator(),
    getServerLocale(),
  ]);

  if (!plan) {
    notFound();
  }

  const shoppingList = (plan.shoppingList?.items ??
    []) as unknown as ShoppingListCategory[];

  const promotionSnapshots = promotions.map(serializePromotionSnapshot);
  const promoLabels = {
    onSale: t("common.onSale"),
    flyerPrice: t("common.flyerPrice"),
    regularPrice: t("common.regularPrice"),
    discount: t("common.discountOff"),
    promoUnavailable: t("common.promoUnavailable"),
    sortByCategory: t("pages.results.shoppingListSortCategory"),
    sortByStore: t("pages.results.shoppingListSortStore"),
  };
  const recipeCardLabels = {
    ...promoLabels,
    ingredients: t("common.ingredients"),
    steps: t("common.steps"),
    regular: t("common.regular"),
    favorite: t("common.favorite"),
  };

  return (
    <PageShell width="lg">
      <ShoppingListSortProvider>
        <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/recettes"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mb-2 -ml-2 h-8 px-2 text-muted-foreground",
              )}
            >
              <ArrowLeft className="mr-1.5 size-3.5" strokeWidth={1.75} />
              {t("common.backToGeneration")}
            </Link>
            <h1>
              {t("pages.results.title", { count: plan.recipes.length })}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("pages.results.generatedOn", {
                date: plan.createdAt.toLocaleDateString(
                  locale === "fr" ? "fr-CA" : "en-CA",
                ),
              })}
            </p>
          </div>
          <PlanExportButtons planId={plan.id} />
        </div>

        <PlanNutritionSummary
          recipes={plan.recipes}
          preferences={household?.preferences ?? null}
        />

        <Tabs defaultValue="recipes">
          <TabsList>
            <TabsTrigger value="recipes">Recettes</TabsTrigger>
            <TabsTrigger value="shopping-list">Liste d&apos;épicerie</TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="mt-6 space-y-6">
            {plan.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                promotions={promotionSnapshots}
                labels={recipeCardLabels}
              />
            ))}
          </TabsContent>

          <TabsContent value="shopping-list" className="mt-6">
            {shoppingList.length > 0 ? (
              <ShoppingListView
                categories={shoppingList}
                promotions={promotionSnapshots}
                labels={promoLabels}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune liste d&apos;épicerie générée.
              </p>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </ShoppingListSortProvider>
    </PageShell>
  );
}
