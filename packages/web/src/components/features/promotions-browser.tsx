"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Tag, X } from "lucide-react";
import { PromotionCard } from "@/components/features/promotion-card";
import { StoreBrandMark } from "@/components/brand/store-brand-mark";
import { PagePanel } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export type PromotionListItem = {
  id: string;
  storeId: string;
  name: string;
  brand: string | null;
  category: string | null;
  salePrice: string | null;
  unit: string | null;
  imageUrl: string | null;
};

export type StoreListItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
};

interface PromotionsBrowserProps {
  stores: StoreListItem[];
  promotions: PromotionListItem[];
}

function matchesSearch(
  promotion: PromotionListItem,
  storeName: string,
  query: string,
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return (
    promotion.name.toLowerCase().includes(normalized) ||
    promotion.brand?.toLowerCase().includes(normalized) ||
    promotion.category?.toLowerCase().includes(normalized) ||
    storeName.toLowerCase().includes(normalized)
  );
}

export function PromotionsBrowser({
  stores,
  promotions,
}: PromotionsBrowserProps) {
  const t = useTranslate();
  const [query, setQuery] = useState("");
  const [selectedStoreIds, setSelectedStoreIds] = useState<Set<string>>(
    () => new Set(stores.map((store) => store.id)),
  );

  const storeNameById = useMemo(
    () => new Map(stores.map((store) => [store.id, store.name])),
    [stores],
  );

  const promotionCountByStore = useMemo(() => {
    const counts = new Map<string, number>();
    for (const promotion of promotions) {
      counts.set(promotion.storeId, (counts.get(promotion.storeId) ?? 0) + 1);
    }
    return counts;
  }, [promotions]);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      if (!selectedStoreIds.has(promotion.storeId)) return false;
      const storeName = storeNameById.get(promotion.storeId) ?? "";
      return matchesSearch(promotion, storeName, query);
    });
  }, [promotions, selectedStoreIds, query, storeNameById]);

  const promotionsByStore = useMemo(() => {
    const hasSearch = query.trim() !== "";

    return stores
      .filter((store) => selectedStoreIds.has(store.id))
      .map((store) => ({
        store,
        items: filteredPromotions.filter(
          (promotion) => promotion.storeId === store.id,
        ),
      }))
      .filter(({ items }) => !hasSearch || items.length > 0);
  }, [stores, selectedStoreIds, filteredPromotions, query]);

  const selectedCount = selectedStoreIds.size;
  const hasActiveFilters =
    query.trim() !== "" || selectedCount < stores.length;

  function toggleStore(storeId: string, checked: boolean) {
    setSelectedStoreIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(storeId);
      } else {
        next.delete(storeId);
      }
      return next;
    });
  }

  function selectAllStores() {
    setSelectedStoreIds(new Set(stores.map((store) => store.id)));
  }

  function deselectAllStores() {
    setSelectedStoreIds(new Set());
  }

  if (selectedCount === 0) {
    return (
      <div className="space-y-6">
        <SearchBar query={query} onQueryChange={setQuery} />
        <StoreFilterPanel
          stores={stores}
          promotionCountByStore={promotionCountByStore}
          selectedStoreIds={selectedStoreIds}
          onToggleStore={toggleStore}
          onSelectAll={selectAllStores}
          onDeselectAll={deselectAllStores}
        />
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Tag className="size-4" strokeWidth={1.75} />
            </EmptyMedia>
            <EmptyTitle>{t("pages.promotions.noStoreSelected")}</EmptyTitle>
            <EmptyDescription>
              {t("pages.promotions.selectStoreHint")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  if (filteredPromotions.length === 0) {
    return (
      <div className="space-y-6">
        <SearchBar query={query} onQueryChange={setQuery} />
        <StoreFilterPanel
          stores={stores}
          promotionCountByStore={promotionCountByStore}
          selectedStoreIds={selectedStoreIds}
          onToggleStore={toggleStore}
          onSelectAll={selectAllStores}
          onDeselectAll={deselectAllStores}
        />
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search className="size-4" strokeWidth={1.75} />
            </EmptyMedia>
            <EmptyTitle>{t("pages.promotions.noResults")}</EmptyTitle>
            <EmptyDescription>
              {t("pages.promotions.noResultsHint")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar query={query} onQueryChange={setQuery} />
      <StoreFilterPanel
        stores={stores}
        promotionCountByStore={promotionCountByStore}
        selectedStoreIds={selectedStoreIds}
        onToggleStore={toggleStore}
        onSelectAll={selectAllStores}
        onDeselectAll={deselectAllStores}
      />

      {hasActiveFilters ? (
        <p className="text-sm text-muted-foreground">
          {t("pages.promotions.foundCount", {
            count: filteredPromotions.length,
          })}
        </p>
      ) : null}

      <div className="space-y-4">
        {promotionsByStore.map(({ store, items }) => (
          <StorePromotionsSection key={store.id} store={store} items={items} />
        ))}
      </div>
    </div>
  );
}

function SearchBar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const t = useTranslate();

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
      <Input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t("pages.promotions.searchPlaceholder")}
        className="pr-9 pl-9"
        aria-label={t("pages.promotions.searchAria")}
      />
      {query ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          onClick={() => onQueryChange("")}
          aria-label={t("pages.promotions.clearSearchAria")}
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
}

function StoreFilterPanel({
  stores,
  promotionCountByStore,
  selectedStoreIds,
  onToggleStore,
  onSelectAll,
  onDeselectAll,
}: {
  stores: StoreListItem[];
  promotionCountByStore: Map<string, number>;
  selectedStoreIds: Set<string>;
  onToggleStore: (storeId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}) {
  const t = useTranslate();
  const selectedCount = selectedStoreIds.size;

  return (
    <PagePanel className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-6 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            {t("pages.promotions.filterByStore")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("pages.promotions.selectedOf", {
              selected: selectedCount,
              total: stores.length,
            })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="xs" onClick={onSelectAll}>
            {t("common.all")}
          </Button>
          <Button type="button" variant="ghost" size="xs" onClick={onDeselectAll}>
            {t("common.none")}
          </Button>
        </div>
      </div>
      <ul className="grid gap-1 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => {
          const checked = selectedStoreIds.has(store.id);
          const count = promotionCountByStore.get(store.id) ?? 0;

          return (
            <li key={store.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] px-4 py-3 hover:bg-muted/40">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    onToggleStore(store.id, value === true)
                  }
                />
                <StoreBrandMark
                  name={store.name}
                  slug={store.slug}
                  logoUrl={store.logoUrl}
                  muted={false}
                  className="flex-1 text-sm font-medium"
                />
                <Badge variant="secondary" className="text-xs tabular-nums">
                  {count}
                </Badge>
              </label>
            </li>
          );
        })}
      </ul>
    </PagePanel>
  );
}

function StorePromotionsSection({
  store,
  items,
}: {
  store: StoreListItem;
  items: PromotionListItem[];
}) {
  const t = useTranslate();
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <PagePanel className="overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <StoreBrandMark
              name={store.name}
              slug={store.slug}
              logoUrl={store.logoUrl}
              muted={false}
              className="text-base font-medium"
            />
            <Badge variant="secondary">
              {items.length} {t("common.products")}
            </Badge>
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
          {items.length === 0 ? (
            <p className="px-6 py-4 text-sm text-muted-foreground">
              {t("pages.promotions.noStorePromotions")}
            </p>
          ) : (
            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  name={promotion.name}
                  storeName={store.name}
                  storeSlug={store.slug}
                  storeLogoUrl={store.logoUrl}
                  salePrice={promotion.salePrice}
                  unit={promotion.unit}
                  imageUrl={promotion.imageUrl}
                  flyerPriceLabel={t("common.flyerPrice")}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </PagePanel>
    </Collapsible>
  );
}
