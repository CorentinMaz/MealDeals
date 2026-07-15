import { jsPDF } from "jspdf";
import type { ShoppingListCategory } from "@/lib/shopping-list/generator";

export type PlanPdfExportType = "recipes" | "shopping" | "all";

export interface PlanPdfRecipe {
  name: string;
  description: string;
  prepMinutes: number;
  difficulty: string;
  estimatedCost: number;
  calories?: number | null;
  proteinG?: number | null;
  carbsG?: number | null;
  fatG?: number | null;
  ingredients: Array<{
    name: string;
    quantity: string;
    isOnSale?: boolean;
  }>;
  steps: string[];
}

export interface PlanPdfInput {
  createdAt: Date;
  recipes: PlanPdfRecipe[];
  shoppingList: ShoppingListCategory[];
}

const MARGIN_X = 14;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const PAGE_BOTTOM = 285;

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(value: number): string {
  return `${value.toFixed(2).replace(".", ",")} $`;
}

class PdfWriter {
  private doc: jsPDF;
  private y = 20;

  constructor() {
    this.doc = new jsPDF({ unit: "mm", format: "a4" });
  }

  private ensureSpace(height: number) {
    if (this.y + height > PAGE_BOTTOM) {
      this.doc.addPage();
      this.y = 20;
    }
  }

  addTitle(text: string) {
    this.ensureSpace(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(18);
    this.doc.text(text, MARGIN_X, this.y);
    this.y += 10;
  }

  addSubtitle(text: string) {
    this.ensureSpace(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(11);
    this.doc.setTextColor(90, 90, 90);
    this.doc.text(text, MARGIN_X, this.y);
    this.doc.setTextColor(0, 0, 0);
    this.y += 8;
  }

  addSectionTitle(text: string) {
    this.ensureSpace(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(14);
    this.doc.text(text, MARGIN_X, this.y);
    this.y += 8;
  }

  addParagraph(text: string, fontSize = 10) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(fontSize);
    const lines = this.doc.splitTextToSize(text, CONTENT_WIDTH);
    this.ensureSpace(lines.length * 5 + 2);
    this.doc.text(lines, MARGIN_X, this.y);
    this.y += lines.length * 5 + 3;
  }

  addBulletLine(text: string, indent = 0) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    const prefix = "• ";
    const lines = this.doc.splitTextToSize(
      `${prefix}${text}`,
      CONTENT_WIDTH - indent,
    );
    this.ensureSpace(lines.length * 5 + 1);
    this.doc.text(lines, MARGIN_X + indent, this.y);
    this.y += lines.length * 5 + 1;
  }

  addNumberedLine(index: number, text: string) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    const prefix = `${index}. `;
    const lines = this.doc.splitTextToSize(
      `${prefix}${text}`,
      CONTENT_WIDTH - 4,
    );
    this.ensureSpace(lines.length * 5 + 1);
    this.doc.text(lines, MARGIN_X + 4, this.y);
    this.y += lines.length * 5 + 1;
  }

  addSpacer(height = 4) {
    this.y += height;
  }

  addDivider() {
    this.ensureSpace(6);
    this.doc.setDrawColor(220, 220, 220);
    this.doc.line(MARGIN_X, this.y, PAGE_WIDTH - MARGIN_X, this.y);
    this.y += 6;
  }

  toArrayBuffer(): ArrayBuffer {
    return this.doc.output("arraybuffer");
  }
}

function nutritionLine(recipe: PlanPdfRecipe): string | null {
  const parts: string[] = [];
  if (recipe.calories) parts.push(`${recipe.calories} kcal`);
  if (recipe.proteinG) parts.push(`${recipe.proteinG} g protéines`);
  if (recipe.carbsG) parts.push(`${recipe.carbsG} g glucides`);
  if (recipe.fatG) parts.push(`${recipe.fatG} g lipides`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function writeRecipesSection(writer: PdfWriter, recipes: PlanPdfRecipe[]) {
  writer.addSectionTitle("Recettes");

  recipes.forEach((recipe, index) => {
    if (index > 0) {
      writer.addDivider();
    }

    writer.addSectionTitle(recipe.name);
    writer.addParagraph(
      `${recipe.difficulty} · ${recipe.prepMinutes} min · ~${formatMoney(recipe.estimatedCost)}`,
      9,
    );

    const nutrition = nutritionLine(recipe);
    if (nutrition) {
      writer.addParagraph(nutrition, 9);
    }

    writer.addParagraph(recipe.description);

    writer.addSpacer(2);
    writer.addParagraph("Ingrédients", 11);
    for (const ingredient of recipe.ingredients) {
      const promo = ingredient.isOnSale ? " (en promo)" : "";
      writer.addBulletLine(
        `${ingredient.quantity} ${ingredient.name}${promo}`,
      );
    }

    writer.addSpacer(2);
    writer.addParagraph("Étapes", 11);
    recipe.steps.forEach((step, stepIndex) => {
      writer.addNumberedLine(stepIndex + 1, step);
    });

    writer.addSpacer(4);
  });
}

function writeShoppingSection(
  writer: PdfWriter,
  shoppingList: ShoppingListCategory[],
) {
  writer.addSectionTitle("Liste d'épicerie");

  if (shoppingList.length === 0) {
    writer.addParagraph("Aucun article dans la liste d'épicerie.");
    return;
  }

  let total = 0;

  for (const category of shoppingList) {
    writer.addSpacer(2);
    writer.addParagraph(category.category, 12);

    for (const item of category.items) {
      const promo = item.isOnSale ? " · promo" : "";
      const price =
        item.estimatedPrice > 0
          ? ` · ~${formatMoney(item.estimatedPrice)}`
          : "";
      writer.addBulletLine(
        `${item.name} — ${item.quantity} (${item.recommendedStore})${promo}${price}`,
      );
      total += item.estimatedPrice;
    }
  }

  if (total > 0) {
    writer.addSpacer(4);
    writer.addParagraph(`Total estimé : ~${formatMoney(total)}`, 11);
  }
}

export function generatePlanPdf(
  input: PlanPdfInput,
  type: PlanPdfExportType,
): ArrayBuffer {
  const writer = new PdfWriter();

  const title =
    type === "shopping"
      ? "MealDeals — Liste d'épicerie"
      : type === "recipes"
        ? "MealDeals — Recettes"
        : "MealDeals — Menu complet";

  writer.addTitle(title);
  writer.addSubtitle(`Généré le ${formatDate(input.createdAt)}`);
  writer.addSubtitle(`${input.recipes.length} recettes`);
  writer.addSpacer(4);

  if (type === "recipes" || type === "all") {
    writeRecipesSection(writer, input.recipes);
  }

  if (type === "all") {
    writer.addDivider();
    writer.addSpacer(4);
  }

  if (type === "shopping" || type === "all") {
    writeShoppingSection(writer, input.shoppingList);
  }

  return writer.toArrayBuffer();
}

export function planPdfFilename(
  createdAt: Date,
  type: PlanPdfExportType,
): string {
  const date = createdAt.toISOString().slice(0, 10);
  switch (type) {
    case "recipes":
      return `mealdeals-recettes-${date}.pdf`;
    case "shopping":
      return `mealdeals-epicerie-${date}.pdf`;
    case "all":
      return `mealdeals-menu-complet-${date}.pdf`;
  }
}
