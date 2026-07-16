"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useShoppingListSort } from "@/components/features/shopping-list-sort-context";
import { buttonVariants } from "@/components/ui/button";
import type { PlanPdfExportType } from "@/lib/pdf/generate-plan-pdf";
import { cn } from "@/lib/utils";

interface PlanExportButtonsProps {
  planId: string;
}

const EXPORT_OPTIONS: Array<{
  type: PlanPdfExportType;
  label: string;
}> = [
  { type: "all", label: "Menu complet (PDF)" },
  { type: "recipes", label: "Recettes (PDF)" },
  { type: "shopping", label: "Liste d'épicerie (PDF)" },
];

function buildPdfHref(
  planId: string,
  type: PlanPdfExportType,
  sortMode: "category" | "store",
) {
  const params = new URLSearchParams({ type });
  if (type === "shopping" || type === "all") {
    params.set("sort", sortMode);
  }
  return `/resultats/${planId}/pdf?${params.toString()}`;
}

export function PlanExportButtons({ planId }: PlanExportButtonsProps) {
  const { sortMode } = useShoppingListSort();

  return (
    <div className="flex flex-wrap gap-2">
      {EXPORT_OPTIONS.map((option) => (
        <Link
          key={option.type}
          href={buildPdfHref(planId, option.type, sortMode)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Download className="mr-1.5 size-3.5" />
          {option.label}
        </Link>
      ))}
    </div>
  );
}
