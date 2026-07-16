"use client";

import { ChefHat, Soup, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type RecipeGenerationOverlayProps = {
  open: boolean;
  title: string;
  subtitle: string;
};

export function RecipeGenerationOverlay({
  open,
  title,
  subtitle,
}: RecipeGenerationOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        aria-hidden
      />

      <div
        className={cn(
          "relative flex w-full max-w-sm flex-col items-center gap-6 rounded-[var(--radius-card)]",
          "border border-border/50 bg-card/90 px-8 py-10 text-center shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-300",
        )}
      >
        <div className="relative mx-auto size-36">
          <span
            className="recipe-gen-ring absolute inset-3 rounded-full border border-secondary/25"
            aria-hidden
          />
          <span
            className="recipe-gen-ring recipe-gen-ring-delay absolute inset-6 rounded-full border border-primary/20"
            aria-hidden
          />

          <div
            className="recipe-gen-plate absolute inset-x-5 bottom-3 h-9 rounded-[100%] border-2 border-primary/20 bg-gradient-to-b from-card to-muted/40 shadow-md"
            aria-hidden
          />

          <ChefHat
            className="recipe-gen-float absolute left-1/2 top-1 size-16 -translate-x-1/2 text-primary"
            strokeWidth={1.5}
            aria-hidden
          />

          <Soup
            className="recipe-gen-orbit-a absolute right-1 top-10 size-8 text-secondary"
            strokeWidth={1.75}
            aria-hidden
          />

          <UtensilsCrossed
            className="recipe-gen-orbit-b absolute left-0 top-12 size-8 text-deal"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>

        <div className="space-y-2">
          <p className="font-heading text-lg font-bold tracking-tight text-primary">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
