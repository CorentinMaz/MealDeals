"use client";

import Link from "next/link";
import { Download } from "lucide-react";
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

export function PlanExportButtons({ planId }: PlanExportButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXPORT_OPTIONS.map((option) => (
        <Link
          key={option.type}
          href={`/resultats/${planId}/pdf?type=${option.type}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Download className="mr-1.5 size-3.5" />
          {option.label}
        </Link>
      ))}
    </div>
  );
}
