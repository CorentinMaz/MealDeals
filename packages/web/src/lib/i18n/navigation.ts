"use client";

import {
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useTranslate } from "@/components/providers/locale-provider";

export type NavItemKey =
  | "dashboard"
  | "promotions"
  | "recipes"
  | "history"
  | "settings";

export type NavItem = {
  href: string;
  key: NavItemKey;
  label: string;
  description?: string;
  icon: LucideIcon;
};

const NAV_ITEM_DEFS: Array<{
  href: string;
  key: NavItemKey;
  icon: LucideIcon;
}> = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/promotions", key: "promotions", icon: Tag },
  { href: "/recettes", key: "recipes", icon: Sparkles },
  { href: "/historique", key: "history", icon: History },
  { href: "/parametres", key: "settings", icon: Settings },
];

export function useNavItems(): NavItem[] {
  const t = useTranslate();

  return NAV_ITEM_DEFS.map((item) => ({
    ...item,
    label: t(`nav.${item.key}.label`),
    description: t(`nav.${item.key}.description`),
  }));
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
