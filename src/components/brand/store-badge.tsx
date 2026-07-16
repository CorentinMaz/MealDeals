import { Badge } from "@/components/ui/badge";
import { getStoreBrandDot } from "@/lib/stores/brand";
import { cn } from "@/lib/utils";

type StoreBadgeProps = {
  name: string;
  slug?: string;
  className?: string;
};

export function StoreBadge({ name, slug, className }: StoreBadgeProps) {
  const brandColor = slug ? getStoreBrandDot(slug) : undefined;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border font-medium",
        !brandColor && "border-border text-foreground",
        className,
      )}
      style={
        brandColor
          ? {
              backgroundColor: `color-mix(in srgb, ${brandColor} 14%, white)`,
              borderColor: `color-mix(in srgb, ${brandColor} 35%, transparent)`,
              color: brandColor,
            }
          : undefined
      }
    >
      {brandColor ? (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: brandColor }}
          aria-hidden
        />
      ) : null}
      {name}
    </Badge>
  );
}
