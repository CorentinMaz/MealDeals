import {
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Tableau de bord",
    description: "Vue d'ensemble des promotions et de votre menu.",
    icon: LayoutDashboard,
  },
  {
    href: "/promotions",
    label: "Promotions",
    description: "Circulaires synchronisées via Flipp.",
    icon: Tag,
  },
  {
    href: "/recettes",
    label: "Générer",
    description: "Créez un menu basé sur les aubaines.",
    icon: Sparkles,
  },
  {
    href: "/historique",
    label: "Historique",
    description: "Menus passés, favoris et recettes régulières.",
    icon: History,
  },
  {
    href: "/parametres",
    label: "Paramètres",
    description: "Épiceries, localisation et préférences.",
    icon: Settings,
  },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
