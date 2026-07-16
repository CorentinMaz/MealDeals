import { LOCALES, type Locale } from "./types";

export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function parseLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}

export function localeToFlippLocale(locale: Locale): "fr" | "en" {
  return locale === "fr" ? "fr" : "en";
}
