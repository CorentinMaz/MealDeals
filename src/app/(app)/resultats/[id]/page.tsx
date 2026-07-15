import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecipeCard } from "@/components/features/recipe-card";
import { PlanExportButtons } from "@/components/features/plan-export-buttons";
import { PlanNutritionSummary } from "@/components/features/plan-nutrition-summary";
import { ShoppingListView } from "@/components/features/shopping-list-view";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShoppingListCategory } from "@/lib/shopping-list/generator";
import { cn } from "@/lib/utils";
import { getRecipePlan, getSettingsData } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plan, { household }] = await Promise.all([
    getRecipePlan(id),
    getSettingsData(),
  ]);

  if (!plan) {
    notFound();
  }

  const shoppingList = (plan.shoppingList?.items ??
    []) as unknown as ShoppingListCategory[];

  return (
    <PageShell width="lg">
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
              Retour à la génération
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">
              Résultats — {plan.recipes.length} recettes
            </h1>
            <p className="text-sm text-muted-foreground">
              Menu généré le {plan.createdAt.toLocaleDateString("fr-CA")}
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
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </TabsContent>

          <TabsContent value="shopping-list" className="mt-6">
            {shoppingList.length > 0 ? (
              <ShoppingListView categories={shoppingList} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune liste d&apos;épicerie générée.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
