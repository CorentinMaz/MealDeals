"use client";

import { ItemPromotionBadges } from "@/components/features/item-promotion-badges";
import {
  PromotionHoverPreview,
  type PromotionPreviewLabels,
} from "@/components/features/promotion-hover-preview";
import { findPromotionForIngredient } from "@mealdeals/api/client";
import type {
  PromotionSnapshot,
  RecipeIngredientRef,
} from "@mealdeals/api/client";
import { buildStoreLookup, resolveStoreRef } from "@mealdeals/api/client";
import { cn } from "@/lib/utils";

type RecipeIngredientListLabels = PromotionPreviewLabels & {
  onSale: string;
};

type RecipeIngredientListProps = {
  ingredients: RecipeIngredientRef[];
  promotions: PromotionSnapshot[];
  labels: RecipeIngredientListLabels;
  ingredientsTitle?: string;
};

export function RecipeIngredientList({
  ingredients,
  promotions,
  labels,
  ingredientsTitle = "Ingrédients",
}: RecipeIngredientListProps) {
  const storeLookup = buildStoreLookup(promotions);

  return (
    <div>
      <h4 className="mb-2 font-medium">{ingredientsTitle}</h4>
      <ul className="space-y-1.5 text-sm">
        {ingredients.map((ingredient) => {
          const promotion = ingredient.isOnSale
            ? findPromotionForIngredient(ingredient, promotions)
            : null;
          const isActivePromo = Boolean(promotion);
          const store = isActivePromo
            ? {
                name: promotion!.store.name,
                slug: promotion!.store.slug,
              }
            : resolveStoreRef(ingredient.storeSlug, storeLookup);
          const storeForBadge = store?.slug ? store : null;

          const rowClassName = cn(
            "flex flex-wrap items-center gap-2 rounded-md px-2 py-1",
            isActivePromo && "bg-deal/6",
            isActivePromo &&
              "cursor-help underline decoration-deal/35 decoration-dotted underline-offset-4 transition-colors hover:bg-deal/10",
          );

          const rowContent = (
            <>
              <span>
                {ingredient.quantity} {ingredient.name}
              </span>
              <ItemPromotionBadges
                store={storeForBadge}
                isOnSale={isActivePromo}
                onSaleLabel={labels.onSale}
              />
            </>
          );

          if (!isActivePromo) {
            return (
              <li
                key={`${ingredient.name}-${ingredient.quantity}`}
                className={rowClassName}
              >
                {rowContent}
              </li>
            );
          }

          return (
            <li key={`${ingredient.name}-${ingredient.quantity}`}>
              <PromotionHoverPreview
                item={ingredient}
                promotion={promotion}
                labels={labels}
                className={rowClassName}
              >
                {rowContent}
              </PromotionHoverPreview>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
