# MealDeals

Monorepo for a Quebec grocery promotion–based meal planner.

## Stack

- **packages/web** — Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui
- **packages/api** — Drizzle ORM + PostgreSQL, queries, domain services (promotions, AI, recipes)
- Anthropic Claude / OpenAI (configurable via `AI_PROVIDER`)

## Quick start

```bash
npm install
cp .env.example .env
cp .env packages/web/.env   # optional; root .env is also loaded by the API

# Start PostgreSQL (Docker)
npm run db:up

npm run db:push
npm run db:seed
npm run dev
```

The app runs at **http://localhost:4782** (PostgreSQL on port **5434**, Drizzle Studio on **4783**).

## Monorepo layout

```
packages/
  api/                  # @mealdeals/api — database & backend logic
    src/db/             # Drizzle schema, client, seed, migrations
    src/queries/        # Read queries
    src/services/       # Promotions sync, AI, recipes, shopping list
    src/client.ts       # Browser-safe exports (types, pure helpers)
  web/                  # @mealdeals/web — Next.js frontend
    src/app/            # Pages & routes
    src/components/     # UI
    src/server/actions/ # Thin wrappers (revalidate, redirect, locale)
```

### Import conventions

- **Server** (pages, actions, route handlers): `@mealdeals/api`
- **Client components** (types, promotion matching, shopping list helpers): `@mealdeals/api/client`

## Database scripts

| Script | Description |
|--------|-------------|
| `npm run db:push` | Push Drizzle schema to PostgreSQL |
| `npm run db:seed` | Seed stores and default household |
| `npm run db:generate` | Generate SQL migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Drizzle Studio on port 4783 |

## Features

- Automatic flyer sync (Flipp API)
- Grocery store management (Maxi, Super C, IGA, Metro, Provigo, Walmart)
- Dietary preferences (allergies, diets, budget, prep time)
- AI recipe generation based on current promotions
- Categorized shopping list + PDF export

## Promotion source

Flyers are fetched via the **Flipp NG** API (`flyers-ng.flippback.com`), used by most Quebec retailers.
