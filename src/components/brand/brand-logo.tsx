import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "full" | "icon";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "full",
  className,
  priority = false,
}: BrandLogoProps) {
  const src = variant === "icon" ? "/logo-icon.svg" : "/logo.svg";
  const width = variant === "icon" ? 40 : 140;
  const height = variant === "icon" ? 19 : 59;

  return (
    <Image
      src={src}
      alt="mealdeals."
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto max-w-full shrink-0", className)}
    />
  );
}
