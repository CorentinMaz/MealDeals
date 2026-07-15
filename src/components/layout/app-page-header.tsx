"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { isNavActive, NAV_ITEMS } from "@/lib/nav-items";

export function AppPageHeader() {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => isNavActive(pathname, item.href));

  return (
    <header className="flex min-h-11 shrink-0 flex-col border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="flex h-11 items-center gap-2 px-3 sm:px-4">
        <SidebarTrigger className="size-7 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4 bg-border/80" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-medium text-foreground">
            {current?.label ?? "MealDeals"}
          </p>
        </div>
      </div>
      {current?.description ? (
        <p className="border-t border-border/40 px-3 py-2 text-[0.75rem] leading-relaxed text-muted-foreground sm:px-4">
          {current.description}
        </p>
      ) : null}
    </header>
  );
}
