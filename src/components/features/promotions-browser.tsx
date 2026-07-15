"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Tag, X } from "lucide-react";
import { PromotionCard } from "@/components/features/promotion-card";
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
            <EmptyTitle>Aucune épicerie sélectionnée</EmptyTitle>
            <EmptyDescription>
              Sélectionnez au moins une épicerie pour afficher les promotions.
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
            <EmptyTitle>Aucun résultat</EmptyTitle>
            <EmptyDescription>
              Aucune promotion ne correspond à votre recherche ou à vos filtres.
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
          {filteredPromotions.length} promotion
          {filteredPromotions.length > 1 ? "s" : ""} trouvée
          {filteredPromotions.length > 1 ? "s" : ""}
        </p>
      ) : null}

      <div className="space-y-4">
        {promotionsByStore.map(({ store, items }) => (
          <StorePromotionsSection
            key={store.id}
            storeName={store.name}
            items={items}
          />
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
        placeholder="Rechercher un produit, une marque ou une épicerie…"
        className="pr-9 pl-9"
        aria-label="Rechercher dans les promotions"
      />
      {query ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          onClick={() => onQueryChange("")}
          aria-label="Effacer la recherche"
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
  const selectedCount = selectedStoreIds.size;

  return (
    <PagePanel className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Filtrer par épicerie</p>
          <p className="text-xs text-muted-foreground">
            {selectedCount} sur {stores.length} sélectionnée
            {selectedCount > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="xs" onClick={onSelectAll}>
            Tout
          </Button>
          <Button type="button" variant="ghost" size="xs" onClick={onDeselectAll}>
            Aucun
          </Button>
        </div>
      </div>
      <ul className="grid gap-1 p-2 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => {
          const checked = selectedStoreIds.has(store.id);
          const count = promotionCountByStore.get(store.id) ?? 0;

          return (
            <li key={store.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    onToggleStore(store.id, value === true)
                  }
                />
                <span className="flex-1 text-sm font-medium">{store.name}</span>
                <Badge variant="secondary" className="text-xs">
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
  storeName,
  items,
}: {
  storeName: string;
  items: PromotionListItem[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <PagePanel className="overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-medium">{storeName}</h2>
            <Badge variant="secondary">{items.length} produits</Badge>
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
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Aucune promotion pour cette épicerie.
            </p>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  name={promotion.name}
                  storeName={storeName}
                  salePrice={promotion.salePrice}
                  unit={promotion.unit}
                  imageUrl={promotion.imageUrl}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </PagePanel>
    </Collapsible>
  );
}
