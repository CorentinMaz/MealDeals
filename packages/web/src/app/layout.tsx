import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { getServerLocale } from "@/lib/i18n/server";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "mealdeals. — Recettes & promotions Québec",
  description:
    "Des recettes hebdomadaires basées sur les circulaires québécoises — pour bien manger sans vider ton portefeuille.",
  icons: {
    icon: "/logo-icon.svg",
  },
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
      className={`${geist.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground text-[0.8125rem] leading-relaxed">
        {children}
      </body>
    </html>
  );
}
