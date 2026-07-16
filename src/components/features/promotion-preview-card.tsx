import Image from "next/image";
import { StoreBrandMark } from "@/components/brand/store-brand-mark";
import { Badge } from "@/components/ui/badge";
import type { PromotionSnapshot } from "@/lib/promotions/types";

type PromotionPreviewCardProps = {
  promotion: PromotionSnapshot;
  flyerPriceLabel: string;
  regularPriceLabel: string;
  discountLabel?: string;
};

export function PromotionPreviewCard({
  promotion,
  flyerPriceLabel,
  regularPriceLabel,
  discountLabel,
}: PromotionPreviewCardProps) {
  const discountText =
    discountLabel && promotion.discountPct
      ? discountLabel.replace("{pct}", String(promotion.discountPct))
      : promotion.discountPct
        ? `-${promotion.discountPct}%`
        : null;

  return (
    <div className="w-64 overflow-hidden">
      {promotion.imageUrl ? (
        <div className="relative h-28 w-full bg-muted/40">
          <Image
            src={promotion.imageUrl}
            alt=""
            fill
            unoptimized
            className="object-contain p-2"
          />
        </div>
      ) : null}
      <div className="space-y-2 p-3">
        <StoreBrandMark
          name={promotion.store.name}
          slug={promotion.store.slug}
          logoUrl={promotion.store.logoUrl}
          className="text-xs"
        />
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {promotion.name}
        </p>
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-lg font-semibold text-deal">
            {promotion.salePrice ? `${promotion.salePrice}$` : flyerPriceLabel}
            {promotion.unit ? (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {promotion.unit}
              </span>
            ) : null}
          </p>
          {promotion.regularPrice ? (
            <p className="text-sm text-muted-foreground line-through">
              {regularPriceLabel} {promotion.regularPrice}$
            </p>
          ) : null}
          {discountText ? (
            <Badge variant="deal" className="text-[0.65rem]">
              {discountText}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
}
