"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { setLocaleAction } from "@/server/actions/locale";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale || isPending) {
      return;
    }

    setLocale(nextLocale);

    startTransition(async () => {
      await setLocaleAction(nextLocale);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 px-2 py-2 text-left text-[0.8125rem] transition-colors",
          "hover:bg-sidebar-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0",
          className,
        )}
        aria-label={t("language.title")}
      >
        <Languages
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <span className="truncate group-data-[collapsible=icon]:hidden">
          {t(`language.${locale}`)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(nextLocale) => {
              if (nextLocale) {
                changeLocale(nextLocale as Locale);
              }
            }}
          >
            {LOCALES.map((nextLocale) => (
              <DropdownMenuRadioItem key={nextLocale} value={nextLocale}>
                {t(`language.${nextLocale}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
