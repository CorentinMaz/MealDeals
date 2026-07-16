import { notFound } from "next/navigation";
import type { Recipe } from "@/generated/prisma/client";
import { serializePromotionSnapshot } from "@/lib/promotions/match-ingredient";
import { getActivePromotions } from "@/lib/promotions/sync-service";
import {
  groupShoppingListByStore,
  type ShoppingListCategory,
} from "@/lib/shopping-list/generator";
import {
  generatePlanPdf,
  planPdfFilename,
  type PlanPdfExportType,
  type PlanPdfRecipe,
} from "@/lib/pdf/generate-plan-pdf";
import { getRecipePlan } from "@/server/queries";

const VALID_TYPES: PlanPdfExportType[] = ["recipes", "shopping", "all"];
const VALID_SORT_MODES = ["category", "store"] as const;
type ShoppingListSortMode = (typeof VALID_SORT_MODES)[number];

function isExportType(value: string | null): value is PlanPdfExportType {
  return value !== null && VALID_TYPES.includes(value as PlanPdfExportType);
}

function isSortMode(value: string | null): value is ShoppingListSortMode {
  return value !== null && VALID_SORT_MODES.includes(value as ShoppingListSortMode);
}

function toPdfRecipe(recipe: Recipe): PlanPdfRecipe {
  return {
    name: recipe.name,
    description: recipe.description,
    prepMinutes: recipe.prepMinutes,
    difficulty: recipe.difficulty,
    estimatedCost: Number(recipe.estimatedCost),
    calories: recipe.calories,
    proteinG: recipe.proteinG ? Number(recipe.proteinG) : null,
    carbsG: recipe.carbsG ? Number(recipe.carbsG) : null,
    fatG: recipe.fatG ? Number(recipe.fatG) : null,
    ingredients: recipe.ingredients as PlanPdfRecipe["ingredients"],
    steps: recipe.steps,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type") ?? "all";
  const type: PlanPdfExportType = isExportType(typeParam) ? typeParam : "all";
  const sortParam = searchParams.get("sort");
  const sortMode: ShoppingListSortMode = isSortMode(sortParam)
    ? sortParam
    : "category";

  const [plan, promotions] = await Promise.all([
    getRecipePlan(id),
    sortMode === "store" ? getActivePromotions() : Promise.resolve([]),
  ]);
  if (!plan) {
    notFound();
  }

  let shoppingList = (plan.shoppingList?.items ??
    []) as unknown as ShoppingListCategory[];

  if (sortMode === "store" && shoppingList.length > 0) {
    const promotionSnapshots = promotions.map(serializePromotionSnapshot);
    shoppingList = groupShoppingListByStore(shoppingList, promotionSnapshots);
  }

  const pdf = generatePlanPdf(
    {
      createdAt: plan.createdAt,
      recipes: plan.recipes.map(toPdfRecipe),
      shoppingList,
    },
    type,
    { shoppingListGroupedByStore: sortMode === "store" },
  );

  const filename = planPdfFilename(plan.createdAt, type);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
