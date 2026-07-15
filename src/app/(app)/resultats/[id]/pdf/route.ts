import { notFound } from "next/navigation";
import type { Recipe } from "@/generated/prisma/client";
import type { ShoppingListCategory } from "@/lib/shopping-list/generator";
import {
  generatePlanPdf,
  planPdfFilename,
  type PlanPdfExportType,
  type PlanPdfRecipe,
} from "@/lib/pdf/generate-plan-pdf";
import { getRecipePlan } from "@/server/queries";

const VALID_TYPES: PlanPdfExportType[] = ["recipes", "shopping", "all"];

function isExportType(value: string | null): value is PlanPdfExportType {
  return value !== null && VALID_TYPES.includes(value as PlanPdfExportType);
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

  const plan = await getRecipePlan(id);
  if (!plan) {
    notFound();
  }

  const shoppingList = (plan.shoppingList?.items ??
    []) as unknown as ShoppingListCategory[];

  const pdf = generatePlanPdf(
    {
      createdAt: plan.createdAt,
      recipes: plan.recipes.map(toPdfRecipe),
      shoppingList,
    },
    type,
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
