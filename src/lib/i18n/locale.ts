import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/types";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function parseLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}

export function localeToDateLocale(locale: Locale): string {
  return locale === "fr" ? "fr-CA" : "en-CA";
}

export function localeToFlippLocale(locale: Locale): "fr" | "en" {
  return locale === "fr" ? "fr" : "en";
}
