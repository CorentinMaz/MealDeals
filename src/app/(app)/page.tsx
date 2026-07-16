import Link from "next/link";
import { Store, Tag, UtensilsCrossed } from "lucide-react";
import { RecipePlanHistoryList } from "@/components/features/recipe-plan-history-list";
import { SyncPromotionsButton } from "@/components/features/sync-promotions-button";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatLocalizedDistance } from "@/lib/i18n/format";
import { getServerLocale, getServerTranslator } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { getDashboardData, getRecipePlansHistory } from "@/server/queries";

export const dynamic = "force-dynamic";

const DASHBOARD_HISTORY_LIMIT = 4;

export default async function DashboardPage() {
  const [data, recentPlans] = await Promise.all([
    getDashboardData(),
    getRecipePlansHistory(DASHBOARD_HISTORY_LIMIT),
  ]);
  const t = await getServerTranslator();
  const locale = await getServerLocale();

  return (
    <PageShell width="2xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1>{t("pages.dashboard.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("pages.dashboard.subtitle", { postalCode: data.postalCode })}
            </p>
          </div>
          <SyncPromotionsButton />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t("pages.dashboard.activeStores")}
              </CardTitle>
              <Store className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.enabledStoreCount}</div>
              <p className="text-xs text-muted-foreground">
                {t("pages.dashboard.activeStoresOf", {
                  total: data.stores.length,
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t("pages.dashboard.activePromotions")}
              </CardTitle>
              <Tag className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.promotionCount}</div>
              <p className="text-xs text-muted-foreground">
                {t("pages.dashboard.foodItemsInFlyers")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t("pages.dashboard.latestMenu")}
              </CardTitle>
              <UtensilsCrossed className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.latestPlan?.recipes.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("pages.dashboard.recipesGenerated")}
                {data.latestPlan ? (
                  <>
                    {" · "}
                    <Link
                      href={`/resultats/${data.latestPlan.id}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {t("common.viewMenu")}
                    </Link>
                  </>
                ) : null}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{t("pages.dashboard.menuHistory")}</CardTitle>
                  <CardDescription>
                    {data.planCount > 0
                      ? t("pages.dashboard.plansTotal", {
                          count: data.planCount,
                        })
                      : t("pages.dashboard.plansEmpty")}
                  </CardDescription>
                </div>
                {data.planCount > DASHBOARD_HISTORY_LIMIT ? (
                  <Link
                    href="/historique"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    {t("common.viewAll")}
                  </Link>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <RecipePlanHistoryList plans={recentPlans} variant="compact" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("pages.dashboard.storeStatus")}</CardTitle>
              <CardDescription>
                {data.latestSync
                  ? t("pages.dashboard.lastSync", {
                      time: formatLocalizedDistance(
                        data.latestSync.syncedAt,
                        locale,
                      ),
                      store: data.latestSync.store.name,
                    })
                  : t("pages.dashboard.noSync")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.stores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="font-medium">{store.name}</span>
                  <Badge variant={store.enabled ? "default" : "secondary"}>
                    {store.enabled
                      ? t("common.enabled")
                      : t("common.disabled")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
