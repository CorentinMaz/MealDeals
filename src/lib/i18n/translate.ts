import { messages } from "@/lib/i18n/messages";
import { DEFAULT_LOCALE, type Locale, type MessageParams } from "@/lib/i18n/types";

function getNestedValue(
  source: Record<string, unknown>,
  path: string,
): string | undefined {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
}

function interpolate(template: string, params?: MessageParams): string {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function createTranslator(locale: Locale) {
  const catalog = messages[locale] ?? messages[DEFAULT_LOCALE];

  return function t(key: string, params?: MessageParams): string {
    const template =
      getNestedValue(catalog as unknown as Record<string, unknown>, key) ??
      getNestedValue(
        messages[DEFAULT_LOCALE] as unknown as Record<string, unknown>,
        key,
      );

    if (!template) {
      return key;
    }

    return interpolate(template, params);
  };
}

export type TranslateFn = ReturnType<typeof createTranslator>;
