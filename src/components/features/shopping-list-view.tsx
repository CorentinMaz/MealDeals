"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { ItemPromotionBadges } from "@/components/features/item-promotion-badges";
import {
  PromotionHoverPreview,
  type PromotionPreviewLabels,
} from "@/components/features/promotion-hover-preview";
import {
  useShoppingListSort,
  type ShoppingListSortMode,
} from "@/components/features/shopping-list-sort-context";
import { PagePanel } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findPromotionForIngredient } from "@/lib/promotions/match-ingredient";
import type { PromotionSnapshot } from "@/lib/promotions/types";
import {
  groupShoppingListByStore,
  type ShoppingListCategory,
  type ShoppingListItem,
} from "@/lib/shopping-list/generator";
import { buildStoreLookup, resolveStoreRef } from "@/lib/stores/resolve";
import { cn } from "@/lib/utils";

type ShoppingListLabels = PromotionPreviewLabels & {
  onSale: string;
  sortByCategory: string;
  sortByStore: string;
};

function ShoppingListItemRow({
  category,
  item,
  promotions,
  storeLookup,
  labels,
}: {
  category: string;
  item: ShoppingListItem;
  promotions: PromotionSnapshot[];
  storeLookup: ReturnType<typeof buildStoreLookup>;
  labels: ShoppingListLabels;
}) {
  const ingredientRef = {
    name: item.name,
    quantity: item.quantity,
    isOnSale: item.isOnSale,
    storeSlug: item.storeSlug ?? item.recommendedStore,
    promotionId: item.promotionId,
    estimatedPrice: item.estimatedPrice,
  };
  const promotion = item.isOnSale
    ? findPromotionForIngredient(ingredientRef, promotions)
    : null;
  const isActivePromo = Boolean(promotion);
  const store = isActivePromo
    ? {
        name: promotion!.store.name,
        slug: promotion!.store.slug,
      }
    : resolveStoreRef(item.storeSlug ?? item.recommendedStore, storeLookup);
  const storeForBadge = store?.slug ? store : null;

  const rowClassName = cn(
    "flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
    isActivePromo && "rounded-md bg-deal/6 px-2 py-2",
    isActivePromo && "cursor-help transition-colors hover:bg-deal/10",
  );

  const badgesRow = (
    <div className="flex flex-wrap items-center gap-2">
      <ItemPromotionBadges
        store={storeForBadge}
        isOnSale={isActivePromo}
        onSaleLabel={labels.onSale}
      />
      {item.estimatedPrice > 0 ? (
        <span className="text-sm font-medium">
          ~{item.estimatedPrice.toFixed(2)}$
        </span>
      ) : null}
    </div>
  );

  const nameBlock = (
    <div
      className={cn(
        isActivePromo &&
          "underline decoration-deal/35 decoration-dotted underline-offset-4",
      )}
    >
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-muted-foreground">{item.quantity}</p>
    </div>
  );

  const row = (
    <>
      {nameBlock}
      {badgesRow}
    </>
  );

  if (!isActivePromo) {
    return (
      <div key={`${category}-${item.name}`} className={rowClassName}>
        {row}
      </div>
    );
  }

  return (
    <PromotionHoverPreview
      key={`${category}-${item.name}`}
      item={ingredientRef}
      promotion={promotion}
      labels={labels}
      className={rowClassName}
    >
      {row}
    </PromotionHoverPreview>
  );
}

function ShoppingListSection({
  category,
  items,
  promotions,
  storeLookup,
  labels,
}: {
  category: ShoppingListCategory;
  items: ShoppingListItem[];
  promotions: PromotionSnapshot[];
  storeLookup: ReturnType<typeof buildStoreLookup>;
  labels: ShoppingListLabels;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <PagePanel className="overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-muted/40">
          <div className="flex min-w-0 items-center gap-3">
            <h3 className="truncate text-base font-medium">{category.category}</h3>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            strokeWidth={1.75}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-border/60">
          <div className="space-y-3 px-6 py-4">
            {items.map((item) => (
              <ShoppingListItemRow
                key={`${category.category}-${item.name}`}
                category={category.category}
                item={item}
                promotions={promotions}
                storeLookup={storeLookup}
                labels={labels}
              />
            ))}
          </div>
        </CollapsibleContent>
      </PagePanel>
    </Collapsible>
  );
}

export function ShoppingListView({
  categories,
  promotions,
  labels,
}: {
  categories: ShoppingListCategory[];
  promotions: PromotionSnapshot[];
  labels: ShoppingListLabels;
}) {
  const { sortMode, setSortMode } = useShoppingListSort();
  const storeLookup = buildStoreLookup(promotions);

  const displayCategories = useMemo(
    () =>
      sortMode === "store"
        ? groupShoppingListByStore(categories, promotions)
        : categories,
    [categories, promotions, sortMode],
  );

  return (
    <div className="space-y-4">
      <Tabs
        value={sortMode}
        onValueChange={(value) => setSortMode(value as ShoppingListSortMode)}
      >
        <TabsList>
          <TabsTrigger value="category">{labels.sortByCategory}</TabsTrigger>
          <TabsTrigger value="store">{labels.sortByStore}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {displayCategories.map((category) => (
          <ShoppingListSection
            key={category.category}
            category={category}
            items={category.items}
            promotions={promotions}
            storeLookup={storeLookup}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}
