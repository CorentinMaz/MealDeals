"use client";

import { PromotionPreviewCard } from "@/components/features/promotion-preview-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  PromotionSnapshot,
  RecipeIngredientRef,
} from "@/lib/promotions/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type PromotionPreviewLabels = {
  flyerPrice: string;
  regularPrice: string;
  discount: string;
  promoUnavailable: string;
};

function PromotionFallback({
  item,
  labels,
}: {
  item: RecipeIngredientRef;
  labels: PromotionPreviewLabels;
}) {
  return (
    <div className="w-56 space-y-2 p-3">
      <p className="text-sm font-medium text-foreground">{item.name}</p>
      {item.estimatedPrice ? (
        <p className="text-lg font-semibold text-deal">
          ~{item.estimatedPrice.toFixed(2)}$
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">{labels.promoUnavailable}</p>
    </div>
  );
};

type PromotionHoverPreviewProps = {
  item: RecipeIngredientRef;
  promotion: PromotionSnapshot | null;
  labels: PromotionPreviewLabels;
  className?: string;
  children: ReactNode;
};

export function PromotionHoverPreview({
  item,
  promotion,
  labels,
  className,
  children,
}: PromotionHoverPreviewProps) {
  return (
    <Tooltip>
      <TooltipTrigger className={cn(className, "w-full text-left")}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        sideOffset={8}
        className="max-w-none border border-border bg-popover p-0 text-popover-foreground shadow-lg [&>svg]:hidden"
      >
        {promotion ? (
          <PromotionPreviewCard
            promotion={promotion}
            flyerPriceLabel={labels.flyerPrice}
            regularPriceLabel={labels.regularPrice}
            discountLabel={labels.discount}
          />
        ) : (
          <PromotionFallback item={item} labels={labels} />
        )}
      </TooltipContent>
    </Tooltip>
  );
}
