# MealDeals

Next.js web app that generates weekly recipes based on Quebec grocery store promotions.

## Stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS + shadcn/ui
- Prisma + PostgreSQL
- Anthropic Claude / OpenAI (configurable via `AI_PROVIDER`)

## Quick start

```bash
npm install
cp .env.example .env

# Start PostgreSQL (Docker)
docker compose up -d

npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The app runs at **http://localhost:4782** (PostgreSQL on port **5434**, Prisma Studio on **4783**).

## Features

- Automatic flyer sync (Flipp API)
- Grocery store management (Maxi, Super C, IGA, Metro, Provigo, Walmart)
- Dietary preferences (allergies, diets, budget, prep time)
- AI recipe generation based on current promotions
- Categorized shopping list

## Architecture

```
src/
  app/(app)/          # Pages: dashboard, promotions, recipes, results, settings
  components/         # UI and feature components
  lib/
    promotions/       # Providers (Flipp) + sync service
    ai/               # Pluggable AI client
    shopping-list/    # Shopping list generation
  server/
    actions/          # Server Actions
    queries/          # Server queries
  generated/prisma/   # Generated Prisma client
prisma/
  schema.prisma
  seed.ts
```

## Promotion source

Flyers are fetched via the **Flipp NG** API (`flyers-ng.flippback.com`), used by most Quebec retailers (Maxi, Metro, Super C, IGA, Provigo, Walmart).

## Planned improvements

- Multi-user authentication
- Meal calendar
- PDF export
- Favorites and notifications
