import { cn } from "@/lib/utils";

const widthClass = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-7xl",
  full: "max-w-none",
} as const;

const paddingClass = {
  default: "px-6 py-6 sm:px-8 sm:py-8",
  compact: "px-4 py-4 sm:px-6 sm:py-6",
  none: "p-0",
} as const;

export type PageShellWidth = keyof typeof widthClass;
export type PageShellPadding = keyof typeof paddingClass;

export function PageShell({
  children,
  width = "2xl",
  padding = "default",
  scroll = true,
  className,
}: {
  children: React.ReactNode;
  width?: PageShellWidth;
  padding?: PageShellPadding;
  scroll?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        scroll ? "overflow-y-auto overscroll-contain" : "overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-0 w-full flex-1 flex-col",
          paddingClass[padding],
          widthClass[width],
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PagePanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-card)] border border-border/60 bg-card shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PageAside({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-xl border border-border/50 bg-muted/20 px-4 py-4 text-[0.8125rem] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </aside>
  );
}
