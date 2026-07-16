import Image from "next/image";
import { StoreBrandMark } from "@/components/brand/store-brand-mark";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromotionCardProps {
  name: string;
  storeName: string;
  storeSlug?: string;
  storeLogoUrl?: string | null;
  salePrice?: string | null;
  unit?: string | null;
  imageUrl?: string | null;
  flyerPriceLabel?: string;
}

export function PromotionCard({
  name,
  storeName,
  storeSlug,
  storeLogoUrl,
  salePrice,
  unit,
  imageUrl,
  flyerPriceLabel = "Prix en circulaire",
}: PromotionCardProps) {
  return (
    <Card className="overflow-hidden">
      {imageUrl ? (
        <div className="relative h-36 w-full bg-muted/40">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-3"
            unoptimized
          />
        </div>
      ) : null}
      <CardHeader className="space-y-2 pb-2">
        <StoreBrandMark
          name={storeName}
          slug={storeSlug}
          logoUrl={storeLogoUrl}
          className="text-xs"
        />
        <CardTitle className="line-clamp-2 text-base leading-snug text-foreground">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-deal">
          {salePrice ? `${salePrice}$` : flyerPriceLabel}
          {unit ? (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </p>
      </CardContent>
    </Card>
  );
}
