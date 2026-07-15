import { cookies } from "next/headers";
import { createTranslator } from "@/lib/i18n/translate";
import { parseLocale } from "@/lib/i18n/locale";
import { LOCALE_COOKIE } from "@/lib/i18n/types";

export async function getServerLocale() {
  const cookieStore = await cookies();
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getServerTranslator() {
  const locale = await getServerLocale();
  return createTranslator(locale);
}
