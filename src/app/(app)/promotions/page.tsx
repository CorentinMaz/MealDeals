import { PromotionsBrowser } from "@/components/features/promotions-browser";
import { SyncPromotionsButton } from "@/components/features/sync-promotions-button";
import { PageShell } from "@/components/layout/page-shell";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getServerTranslator } from "@/lib/i18n/server";
import { getPromotionsPageData } from "@/server/queries";
import { Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const { stores, promotions } = await getPromotionsPageData();
  const t = await getServerTranslator();

  const enabledStores = stores
    .filter((store) => store.enabled)
    .map((store) => ({
      id: store.id,
      name: store.name,
    }));

  const promotionItems = promotions.map((promotion) => ({
    id: promotion.id,
    storeId: promotion.storeId,
    name: promotion.name,
    brand: promotion.brand,
    category: promotion.category,
    salePrice: promotion.salePrice?.toString() ?? null,
    unit: promotion.unit,
    imageUrl: promotion.imageUrl,
  }));

  return (
    <PageShell width="2xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {t("pages.promotions.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("pages.promotions.subtitle")}
            </p>
          </div>
          <SyncPromotionsButton />
        </div>

        {promotions.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Tag className="size-4" strokeWidth={1.75} />
              </EmptyMedia>
              <EmptyTitle>{t("pages.promotions.emptyTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("pages.promotions.emptyDescription")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <PromotionsBrowser
            stores={enabledStores}
            promotions={promotionItems}
          />
        )}
      </div>
    </PageShell>
  );
}
