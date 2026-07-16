import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PromoBadgeProps = {
  label?: string;
  className?: string;
};

export function PromoBadge({
  label = "En promo",
  className,
}: PromoBadgeProps) {
  return (
    <Badge variant="deal" className={cn("gap-1 font-semibold", className)}>
      <Tag className="size-3 shrink-0" strokeWidth={2.25} aria-hidden />
      {label}
    </Badge>
  );
}
