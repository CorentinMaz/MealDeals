import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const groceryStores = pgTable(
  "GroceryStore",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    merchant: text("merchant").notNull(),
    logoUrl: text("logoUrl"),
    provider: text("provider").notNull().default("flipp"),
    enabled: boolean("enabled").notNull().default(true),
    config: jsonb("config").notNull().default({}),
    sortOrder: integer("sortOrder").notNull().default(0),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const promotions = pgTable(
  "Promotion",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    storeId: text("storeId")
      .notNull()
      .references(() => groceryStores.id, { onDelete: "cascade" }),
    externalId: text("externalId").notNull(),
    name: text("name").notNull(),
    brand: text("brand"),
    category: text("category"),
    salePrice: decimal("salePrice", { precision: 10, scale: 2 }),
    regularPrice: decimal("regularPrice", { precision: 10, scale: 2 }),
    unit: text("unit"),
    discountPct: integer("discountPct"),
    imageUrl: text("imageUrl"),
    validFrom: timestamp("validFrom", { precision: 3 }).notNull(),
    validTo: timestamp("validTo", { precision: 3 }).notNull(),
    isFood: boolean("isFood").notNull().default(true),
    rawData: jsonb("rawData"),
    syncedAt: timestamp("syncedAt", { precision: 3 }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("Promotion_storeId_externalId_key").on(
      table.storeId,
      table.externalId,
    ),
    index("Promotion_storeId_validFrom_validTo_idx").on(
      table.storeId,
      table.validFrom,
      table.validTo,
    ),
    index("Promotion_isFood_validTo_idx").on(table.isFood, table.validTo),
  ],
);

export const promotionSyncLogs = pgTable(
  "PromotionSyncLog",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    storeId: text("storeId")
      .notNull()
      .references(() => groceryStores.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    itemCount: integer("itemCount").notNull().default(0),
    error: text("error"),
    syncedAt: timestamp("syncedAt", { precision: 3 }).notNull().defaultNow(),
  },
  (table) => [
    index("PromotionSyncLog_storeId_syncedAt_idx").on(
      table.storeId,
      table.syncedAt,
    ),
  ],
);

export const households = pgTable("Household", {
  id: text("id").primaryKey().default("default"),
  postalCode: text("postalCode").notNull().default("G1V4P3"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userPreferences = pgTable("UserPreferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  householdId: text("householdId")
    .notNull()
    .unique()
    .references(() => households.id, { onDelete: "cascade" }),
  allergies: text("allergies").array().notNull().default([]),
  diets: text("diets").array().notNull().default([]),
  likedFoods: text("likedFoods").array().notNull().default([]),
  dislikedFoods: text("dislikedFoods").array().notNull().default([]),
  maxPrepMinutes: integer("maxPrepMinutes").notNull().default(60),
  weeklyBudget: decimal("weeklyBudget", { precision: 10, scale: 2 })
    .notNull()
    .default("150"),
  nutritionMode: text("nutritionMode").notNull().default("recipes_only"),
  fitnessGoal: text("fitnessGoal"),
  dailyCalorieTarget: integer("dailyCalorieTarget"),
  activityGym: boolean("activityGym").notNull().default(false),
  activityRunning: boolean("activityRunning").notNull().default(false),
  gymSessionsPerWeek: integer("gymSessionsPerWeek"),
  runningSessionsPerWeek: integer("runningSessionsPerWeek"),
  updatedAt: timestamp("updatedAt", { precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const recipePlans = pgTable(
  "RecipePlan",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    householdId: text("householdId")
      .notNull()
      .default("default")
      .references(() => households.id, { onDelete: "cascade" }),
    recipeCount: integer("recipeCount").notNull(),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  },
  (table) => [
    index("RecipePlan_householdId_createdAt_idx").on(
      table.householdId,
      table.createdAt,
    ),
  ],
);

export const recipes = pgTable(
  "Recipe",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    planId: text("planId")
      .notNull()
      .references(() => recipePlans.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    prepMinutes: integer("prepMinutes").notNull(),
    difficulty: text("difficulty").notNull(),
    estimatedCost: decimal("estimatedCost", { precision: 10, scale: 2 }).notNull(),
    calories: integer("calories"),
    proteinG: decimal("proteinG", { precision: 6, scale: 1 }),
    carbsG: decimal("carbsG", { precision: 6, scale: 1 }),
    fatG: decimal("fatG", { precision: 6, scale: 1 }),
    ingredients: jsonb("ingredients").notNull(),
    steps: text("steps").array().notNull(),
    selected: boolean("selected").notNull().default(true),
    isFavorite: boolean("isFavorite").notNull().default(false),
    makeRegularly: boolean("makeRegularly").notNull().default(false),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  },
  (table) => [
    index("Recipe_planId_idx").on(table.planId),
    index("Recipe_isFavorite_idx").on(table.isFavorite),
    index("Recipe_makeRegularly_idx").on(table.makeRegularly),
  ],
);

export const shoppingLists = pgTable("ShoppingList", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  planId: text("planId")
    .notNull()
    .unique()
    .references(() => recipePlans.id, { onDelete: "cascade" }),
  items: jsonb("items").notNull(),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
});

export const groceryStoresRelations = relations(groceryStores, ({ many }) => ({
  promotions: many(promotions),
  syncLogs: many(promotionSyncLogs),
}));

export const promotionsRelations = relations(promotions, ({ one }) => ({
  store: one(groceryStores, {
    fields: [promotions.storeId],
    references: [groceryStores.id],
  }),
}));

export const promotionSyncLogsRelations = relations(
  promotionSyncLogs,
  ({ one }) => ({
    store: one(groceryStores, {
      fields: [promotionSyncLogs.storeId],
      references: [groceryStores.id],
    }),
  }),
);

export const householdsRelations = relations(households, ({ one, many }) => ({
  preferences: one(userPreferences, {
    fields: [households.id],
    references: [userPreferences.householdId],
  }),
  recipePlans: many(recipePlans),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  household: one(households, {
    fields: [userPreferences.householdId],
    references: [households.id],
  }),
}));

export const recipePlansRelations = relations(recipePlans, ({ one, many }) => ({
  household: one(households, {
    fields: [recipePlans.householdId],
    references: [households.id],
  }),
  recipes: many(recipes),
  shoppingList: one(shoppingLists, {
    fields: [recipePlans.id],
    references: [shoppingLists.planId],
  }),
}));

export const recipesRelations = relations(recipes, ({ one }) => ({
  plan: one(recipePlans, {
    fields: [recipes.planId],
    references: [recipePlans.id],
  }),
}));

export const shoppingListsRelations = relations(shoppingLists, ({ one }) => ({
  plan: one(recipePlans, {
    fields: [shoppingLists.planId],
    references: [recipePlans.id],
  }),
}));
