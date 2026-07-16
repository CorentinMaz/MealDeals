import Image from "next/image";
import { getStoreBrandDot } from "@/lib/stores/brand";
import { cn } from "@/lib/utils";

type StoreBrandMarkProps = {
  name: string;
  slug?: string;
  logoUrl?: string | null;
  showDot?: boolean;
  muted?: boolean;
  className?: string;
};

export function StoreBrandMark({
  name,
  slug,
  logoUrl,
  showDot = true,
  muted = true,
  className,
}: StoreBrandMarkProps) {
  const dotColor = slug ? getStoreBrandDot(slug) : undefined;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showDot && dotColor ? (
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
          aria-hidden
        />
      ) : null}
      {logoUrl ? (
        <span className="relative size-5 shrink-0 overflow-hidden">
          <Image
            src={logoUrl}
            alt=""
            fill
            unoptimized
            className="object-contain grayscale brightness-75 contrast-90 opacity-70"
          />
        </span>
      ) : null}
      <span
        className={cn(
          "truncate",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {name}
      </span>
    </span>
  );
}
