import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromotionCardProps {
  name: string;
  storeName: string;
  salePrice?: string | null;
  unit?: string | null;
  imageUrl?: string | null;
}

export function PromotionCard({
  name,
  storeName,
  salePrice,
  unit,
  imageUrl,
}: PromotionCardProps) {
  return (
    <Card className="overflow-hidden">
      {imageUrl ? (
        <div className="relative h-36 w-full bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-2"
            unoptimized
          />
        </div>
      ) : null}
      <CardHeader className="space-y-2 pb-2">
        <Badge variant="secondary" className="w-fit">
          {storeName}
        </Badge>
        <CardTitle className="line-clamp-2 text-base leading-snug">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-primary">
          {salePrice ? `${salePrice}$` : "Prix en circulaire"}
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
