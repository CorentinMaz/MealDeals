import { PromoBadge } from "@/components/features/promo-badge";
import { StoreBadge } from "@/components/brand/store-badge";
import type { StoreRef } from "@/lib/stores/resolve";
import { cn } from "@/lib/utils";

type ItemPromotionBadgesProps = {
  store: StoreRef | null;
  isOnSale: boolean;
  onSaleLabel: string;
  className?: string;
};

export function ItemPromotionBadges({
  store,
  isOnSale,
  onSaleLabel,
  className,
}: ItemPromotionBadgesProps) {
  if (!store && !isOnSale) {
    return null;
  }

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {store ? (
        <StoreBadge name={store.name} slug={store.slug} className="text-[0.65rem]" />
      ) : null}
      {isOnSale ? (
        <PromoBadge label={onSaleLabel} className="text-[0.65rem]" />
      ) : null}
    </span>
  );
}
