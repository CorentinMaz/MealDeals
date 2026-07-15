"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat } from "lucide-react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { useTranslate } from "@/components/providers/locale-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { isNavActive, useNavItems } from "@/lib/i18n/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslate();
  const navItems = useNavItems();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-sidebar-border border-b px-2 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
        >
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
            aria-hidden
          >
            <ChefHat className="size-4" strokeWidth={1.75} />
          </span>
          <span className="truncate text-sm font-medium tracking-tight group-data-[collapsible=icon]:hidden">
            {t("nav.brand")}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-2 pt-3 pb-2 group-data-[collapsible=icon]:px-1">
          <LocaleSwitcher />
        </div>
        <SidebarSeparator className="mx-2 mb-1 group-data-[collapsible=icon]:mx-1" />

        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="h-auto px-2 pb-1 pt-0 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/55">
            {t("nav.menu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                      className="h-8 text-[0.8125rem] font-normal text-foreground/75 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-foreground"
                    >
                      <Icon className="size-4 opacity-80" strokeWidth={1.75} />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
