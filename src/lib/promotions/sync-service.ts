import { db } from "@/lib/db";
import { createAppError, formatAppErrorMessage, parseAppError } from "@/lib/errors";
import { getServerLocale, getServerTranslator } from "@/lib/i18n/server";
import { flippProvider } from "@/lib/promotions/providers/flipp";
import type { PromotionProvider, RawPromotion } from "@/lib/promotions/types";
import type { Prisma } from "@/generated/prisma/client";

const providers: Record<string, PromotionProvider> = {
  flipp: flippProvider,
};

function getProvider(providerId: string): PromotionProvider {
  const provider = providers[providerId];
  if (!provider) {
    throw createAppError("UNSUPPORTED_PROMOTION_PROVIDER", { providerId });
  }
  return provider;
}

async function resolveErrorMessage(error: unknown): Promise<string> {
  const t = await getServerTranslator();
  const parsed = parseAppError(error);

  if (parsed) {
    return formatAppErrorMessage(parsed.code, t, parsed.params);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return formatAppErrorMessage("SYNC_UNKNOWN_ERROR", t);
}

export async function syncStorePromotions(
  storeId: string,
  postalCode: string,
): Promise<{ itemCount: number }> {
  const store = await db.groceryStore.findUnique({ where: { id: storeId } });
  if (!store) {
    throw createAppError("STORE_NOT_FOUND");
  }

  try {
    const locale = await getServerLocale();
    const provider = getProvider(store.provider);
    const promotions = await provider.fetchPromotions({
      merchant: store.merchant,
      postalCode,
      config: store.config as Record<string, unknown>,
      locale,
    });

    await persistPromotions(store.id, promotions);

    await db.promotionSyncLog.create({
      data: {
        storeId: store.id,
        status: "success",
        itemCount: promotions.length,
      },
    });

    return { itemCount: promotions.length };
  } catch (error) {
    const message = await resolveErrorMessage(error);

    await db.promotionSyncLog.create({
      data: {
        storeId: store.id,
        status: "error",
        itemCount: 0,
        error: message,
      },
    });

    throw error;
  }
}

export async function syncAllEnabledStores(postalCode: string) {
  const stores = await db.groceryStore.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });

  const results = [];
  const t = await getServerTranslator();

  for (const store of stores) {
    try {
      const result = await syncStorePromotions(store.id, postalCode);
      results.push({
        storeId: store.id,
        storeName: store.name,
        status: "success" as const,
        itemCount: result.itemCount,
      });
    } catch (error) {
      results.push({
        storeId: store.id,
        storeName: store.name,
        status: "error" as const,
        itemCount: 0,
        error:
          error instanceof Error
            ? await resolveErrorMessage(error)
            : formatAppErrorMessage("SYNC_UNKNOWN_ERROR_PER_STORE", t),
      });
    }
  }

  return results;
}

async function persistPromotions(storeId: string, promotions: RawPromotion[]) {
  const now = new Date();
  const externalIds = promotions.map((promotion) => promotion.externalId);

  await db.$transaction(async (tx) => {
    await tx.promotion.deleteMany({
      where: {
        storeId,
        validTo: { lt: now },
      },
    });

    if (externalIds.length > 0) {
      await tx.promotion.deleteMany({
        where: {
          storeId,
          externalId: { notIn: externalIds },
        },
      });
    } else {
      await tx.promotion.deleteMany({ where: { storeId } });
    }

    for (const promotion of promotions) {
      await tx.promotion.upsert({
        where: {
          storeId_externalId: {
            storeId,
            externalId: promotion.externalId,
          },
        },
        create: {
          storeId,
          externalId: promotion.externalId,
          name: promotion.name,
          brand: promotion.brand,
          category: promotion.category,
          salePrice: promotion.salePrice,
          regularPrice: promotion.regularPrice,
          unit: promotion.unit,
          discountPct: promotion.discountPct,
          imageUrl: promotion.imageUrl,
          validFrom: promotion.validFrom,
          validTo: promotion.validTo,
          isFood: promotion.isFood,
          rawData: promotion.rawData as Prisma.InputJsonValue | undefined,
        },
        update: {
          name: promotion.name,
          brand: promotion.brand,
          category: promotion.category,
          salePrice: promotion.salePrice,
          regularPrice: promotion.regularPrice,
          unit: promotion.unit,
          discountPct: promotion.discountPct,
          imageUrl: promotion.imageUrl,
          validFrom: promotion.validFrom,
          validTo: promotion.validTo,
          isFood: promotion.isFood,
          rawData: promotion.rawData as Prisma.InputJsonValue | undefined,
          syncedAt: now,
        },
      });
    }
  });
}

export async function getActivePromotions(storeIds?: string[]) {
  const now = new Date();

  return db.promotion.findMany({
    where: {
      isFood: true,
      validFrom: { lte: now },
      validTo: { gte: now },
      store: {
        enabled: true,
        ...(storeIds?.length ? { id: { in: storeIds } } : {}),
      },
    },
    include: {
      store: {
        select: { id: true, name: true, slug: true, logoUrl: true },
      },
    },
    orderBy: [{ discountPct: "desc" }, { salePrice: "asc" }],
  });
}
