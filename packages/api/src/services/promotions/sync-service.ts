import { and, asc, desc, eq, gte, inArray, lt, lte, notInArray } from "drizzle-orm";
import { db } from "../../db/client";
import {
  groceryStores,
  promotionSyncLogs,
  promotions,
} from "../../db/schema";
import { createAppError, parseAppError } from "../../errors";
import type { Locale } from "../../types";
import { flippProvider } from "./providers/flipp";
import type { PromotionProvider, RawPromotion } from "./types";

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

function resolveErrorMessage(error: unknown): string {
  const parsed = parseAppError(error);
  if (parsed) {
    return parsed.code;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "SYNC_UNKNOWN_ERROR";
}

export async function syncStorePromotions(
  storeId: string,
  postalCode: string,
  locale: Locale,
): Promise<{ itemCount: number }> {
  const store = await db.query.groceryStores.findFirst({
    where: eq(groceryStores.id, storeId),
  });

  if (!store) {
    throw createAppError("STORE_NOT_FOUND");
  }

  try {
    const provider = getProvider(store.provider);
    const fetchedPromotions = await provider.fetchPromotions({
      merchant: store.merchant,
      postalCode,
      config: store.config as Record<string, unknown>,
      locale,
    });

    await persistPromotions(store.id, fetchedPromotions);

    await db.insert(promotionSyncLogs).values({
      storeId: store.id,
      status: "success",
      itemCount: fetchedPromotions.length,
    });

    return { itemCount: fetchedPromotions.length };
  } catch (error) {
    const message = resolveErrorMessage(error);

    await db.insert(promotionSyncLogs).values({
      storeId: store.id,
      status: "error",
      itemCount: 0,
      error: message,
    });

    throw error;
  }
}

export async function syncAllEnabledStores(
  postalCode: string,
  locale: Locale,
) {
  const stores = await db.query.groceryStores.findMany({
    where: eq(groceryStores.enabled, true),
    orderBy: [asc(groceryStores.sortOrder)],
  });

  const results = [];

  for (const store of stores) {
    try {
      const result = await syncStorePromotions(store.id, postalCode, locale);
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
            ? resolveErrorMessage(error)
            : "SYNC_UNKNOWN_ERROR_PER_STORE",
      });
    }
  }

  return results;
}

async function persistPromotions(storeId: string, rawPromotions: RawPromotion[]) {
  const now = new Date();
  const externalIds = rawPromotions.map((promotion) => promotion.externalId);

  await db.transaction(async (tx) => {
    await tx
      .delete(promotions)
      .where(
        and(eq(promotions.storeId, storeId), lt(promotions.validTo, now)),
      );

    if (externalIds.length > 0) {
      await tx
        .delete(promotions)
        .where(
          and(
            eq(promotions.storeId, storeId),
            notInArray(promotions.externalId, externalIds),
          ),
        );
    } else {
      await tx.delete(promotions).where(eq(promotions.storeId, storeId));
    }

    for (const promotion of rawPromotions) {
      const values = {
        storeId,
        externalId: promotion.externalId,
        name: promotion.name,
        brand: promotion.brand,
        category: promotion.category,
        salePrice: promotion.salePrice?.toString(),
        regularPrice: promotion.regularPrice?.toString(),
        unit: promotion.unit,
        discountPct: promotion.discountPct,
        imageUrl: promotion.imageUrl,
        validFrom: promotion.validFrom,
        validTo: promotion.validTo,
        isFood: promotion.isFood,
        rawData: promotion.rawData,
        syncedAt: now,
      };

      await tx
        .insert(promotions)
        .values(values)
        .onConflictDoUpdate({
          target: [promotions.storeId, promotions.externalId],
          set: values,
        });
    }
  });
}

export async function getActivePromotions(storeIds?: string[]) {
  const now = new Date();

  const conditions = [
    eq(promotions.isFood, true),
    lte(promotions.validFrom, now),
    gte(promotions.validTo, now),
    eq(groceryStores.enabled, true),
  ];

  if (storeIds?.length) {
    conditions.push(inArray(groceryStores.id, storeIds));
  }

  const rows = await db
    .select({ promotion: promotions, store: groceryStores })
    .from(promotions)
    .innerJoin(groceryStores, eq(promotions.storeId, groceryStores.id))
    .where(and(...conditions))
    .orderBy(desc(promotions.discountPct), asc(promotions.salePrice));

  return rows.map((row) => ({
    ...row.promotion,
    store: {
      id: row.store.id,
      name: row.store.name,
      slug: row.store.slug,
      logoUrl: row.store.logoUrl,
    },
  }));
}
