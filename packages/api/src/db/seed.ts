import "../env";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { groceryStores, households, userPreferences } from "./schema";

const QUEBEC_STORES = [
  { slug: "maxi", name: "Maxi", merchant: "Maxi", sortOrder: 1 },
  { slug: "super-c", name: "Super C", merchant: "Super C", sortOrder: 2 },
  { slug: "iga", name: "IGA", merchant: "IGA", sortOrder: 3 },
  { slug: "metro", name: "Metro", merchant: "Metro", sortOrder: 4 },
  { slug: "provigo", name: "Provigo", merchant: "Provigo", sortOrder: 5 },
  { slug: "walmart", name: "Walmart", merchant: "Walmart", sortOrder: 6 },
];

async function main() {
  await db.delete(groceryStores).where(eq(groceryStores.slug, "costco"));

  for (const store of QUEBEC_STORES) {
    await db
      .insert(groceryStores)
      .values({
        slug: store.slug,
        name: store.name,
        merchant: store.merchant,
        provider: "flipp",
        enabled: true,
        sortOrder: store.sortOrder,
        config: {},
      })
      .onConflictDoUpdate({
        target: groceryStores.slug,
        set: {
          name: store.name,
          merchant: store.merchant,
          sortOrder: store.sortOrder,
        },
      });
  }

  await db
    .insert(households)
    .values({ id: "default", postalCode: "G1V4P3" })
    .onConflictDoNothing();

  await db
    .insert(userPreferences)
    .values({
      householdId: "default",
      allergies: [],
      diets: [],
      likedFoods: [],
      dislikedFoods: [],
      maxPrepMinutes: 60,
      weeklyBudget: "150",
    })
    .onConflictDoNothing();

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
