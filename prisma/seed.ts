import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

const QUEBEC_STORES = [
  { slug: "maxi", name: "Maxi", merchant: "Maxi", sortOrder: 1 },
  { slug: "super-c", name: "Super C", merchant: "Super C", sortOrder: 2 },
  { slug: "iga", name: "IGA", merchant: "IGA", sortOrder: 3 },
  { slug: "metro", name: "Metro", merchant: "Metro", sortOrder: 4 },
  { slug: "provigo", name: "Provigo", merchant: "Provigo", sortOrder: 5 },
  { slug: "walmart", name: "Walmart", merchant: "Walmart", sortOrder: 6 },
];

async function main() {
  await db.groceryStore.deleteMany({ where: { slug: "costco" } });

  for (const store of QUEBEC_STORES) {
    await db.groceryStore.upsert({
      where: { slug: store.slug },
      create: {
        slug: store.slug,
        name: store.name,
        merchant: store.merchant,
        provider: "flipp",
        enabled: store.enabled ?? true,
        sortOrder: store.sortOrder,
        config: store.config ?? {},
      },
      update: {
        name: store.name,
        merchant: store.merchant,
        sortOrder: store.sortOrder,
      },
    });
  }

  await db.household.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      postalCode: "G1V4P3",
      preferences: {
        create: {
          allergies: [],
          diets: [],
          likedFoods: [],
          dislikedFoods: [],
          maxPrepMinutes: 60,
          weeklyBudget: 150,
        },
      },
    },
    update: {},
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
