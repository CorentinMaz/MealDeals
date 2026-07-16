import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { localeToDateLocale } from "@/lib/i18n/locale";
import type { Locale } from "@/lib/i18n/types";

export function getDateFnsLocale(locale: Locale) {
  return locale === "fr" ? fr : enUS;
}

export function formatLocalizedDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
) {
  return date.toLocaleDateString(localeToDateLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatMoney(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(localeToDateLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatLocalizedDistance(
  date: Date,
  locale: Locale,
  options?: { addSuffix?: boolean },
) {
  return formatDistanceToNow(date, {
    addSuffix: options?.addSuffix ?? true,
    locale: getDateFnsLocale(locale),
  });
}
