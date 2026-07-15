import { AppShell } from "@/components/layout/app-shell";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getServerLocale } from "@/lib/i18n/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();

  return (
    <LocaleProvider initialLocale={locale}>
      <TooltipProvider>
        <AppShell>
          {children}
          <Toaster richColors position="top-right" />
        </AppShell>
      </TooltipProvider>
    </LocaleProvider>
  );
}
