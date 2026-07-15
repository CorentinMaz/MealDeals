import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
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
import { cn } from "@/lib/utils";
import { getDashboardData, getRecipePlansHistory } from "@/server/queries";

export const dynamic = "force-dynamic";

const DASHBOARD_HISTORY_LIMIT = 4;

export default async function DashboardPage() {
  const [data, recentPlans] = await Promise.all([
    getDashboardData(),
    getRecipePlansHistory(DASHBOARD_HISTORY_LIMIT),
  ]);

  return (
    <PageShell width="2xl">
      <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            Recettes intelligentes basées sur les circulaires du Québec (
            {data.postalCode})
          </p>
        </div>
        <SyncPromotionsButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Épiceries actives</CardTitle>
            <Store className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.enabledStoreCount}</div>
            <p className="text-xs text-muted-foreground">
              sur {data.stores.length} configurées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Promotions actives</CardTitle>
            <Tag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.promotionCount}</div>
            <p className="text-xs text-muted-foreground">
              produits alimentaires en circulaire
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dernier menu</CardTitle>
            <UtensilsCrossed className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.latestPlan?.recipes.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              recettes générées
              {data.latestPlan ? (
                <>
                  {" · "}
                  <Link
                    href={`/resultats/${data.latestPlan.id}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Voir le menu
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
                <CardTitle>Historique des menus</CardTitle>
                <CardDescription>
                  {data.planCount > 0
                    ? `${data.planCount} menu${data.planCount > 1 ? "x" : ""} généré${data.planCount > 1 ? "s" : ""} au total`
                    : "Vos menus générés apparaîtront ici"}
                </CardDescription>
              </div>
              {data.planCount > DASHBOARD_HISTORY_LIMIT ? (
                <Link
                  href="/historique"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Voir tout
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
            <CardTitle>État des épiceries</CardTitle>
            <CardDescription>
              {data.latestSync
                ? `Dernière synchro: ${formatDistanceToNow(data.latestSync.syncedAt, { addSuffix: true, locale: fr })} (${data.latestSync.store.name})`
                : "Aucune synchronisation effectuée"}
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
                  {store.enabled ? "Activée" : "Désactivée"}
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
