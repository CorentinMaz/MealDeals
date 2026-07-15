import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { getServerLocale } from "@/lib/i18n/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MealDeals — Recettes & promotions Québec",
  description:
    "Générez des recettes hebdomadaires basées sur les circulaires des épiceries québécoises.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} min-h-full flex flex-col bg-background text-foreground text-[0.8125rem] leading-relaxed`}
      >
        {children}
      </body>
    </html>
  );
}
