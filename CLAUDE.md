# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow

Always develop on feature branches and open a PR to merge into `main`. Never commit directly to `main`.

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run dev:staging` - Start dev server in staging mode
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run check` - Type check with svelte-check
- `npm run format` - Format code with Prettier (run before committing)
- `npm run lint` - Check code formatting
- `npm run health` - Ping `/api/health` on the running dev server

## Database Commands

- `npm run db:init` - Initialize database schema
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Complete reset (wipe + init + seed)
- `npm run db:export` - Export database to `productseed.json`
- `npm run db:wipe` - Wipe all data from database

## Docker

- `npm run docker:build` - Build image locally
- `npm run docker:run` - Run image with `.env` file on port 3000
- `npm run start` - Docker entrypoint (uses `scripts/docker-entrypoint.js`)

## Tech Stack

- **SvelteKit 2** with Svelte 5 - full-stack framework with file-based routing
- **TypeScript 5** - strict mode
- **TailwindCSS 4** - utility-first CSS (class order enforced by Prettier plugin)
- **SQLite** via `better-sqlite3` - server-side only; DB path from `DATABASE_PATH` env var (default `./data/db.sqlite`)
- **PostHog** - client-side analytics (`posthog-js`)
- **Adapter**: `@sveltejs/adapter-node` (builds a Node.js server)

## Architecture

This is **KeyCraft**, a mechanical keyboard e-commerce shop (keyboards, keycaps, switches, cables, accessories).

### Route Structure

```
src/routes/
  +layout.svelte              # Global layout (Header, Footer, Chatbot)
  +page.svelte                # Homepage
  [category]/                 # Category listing (e.g. /keyboards)
    +page.ts                  # Load function — fetches products by category slug
    +page.svelte
    [product]/                # Product detail (e.g. /keyboards/some-board)
      +page.ts
      +page.svelte
  products/                   # All-products listing with filters
  search/                     # Search results
  cart/                       # Cart page (reads Svelte store)
  checkout/                   # 3-step checkout (Step1/Step2/Step3 components)
  order-confirmation/[id]/    # Post-checkout confirmation
  track-order/[trackingNumber]/
  faq/
  doc/                        # In-app documentation pages
  api/                        # SvelteKit server routes (backend)
    products/         GET     # list with ?category, ?search, ?featured, ?sort, ?limit, ?offset
    products/[id]/    GET
    categories/       GET
    categories/[slug]/GET
    search/           GET
    faqs/             GET
    health/           GET
```

### Key Shared Code (`src/lib/`)

- **`config.ts`** — central `APP_CONFIG` with category definitions, navigation, image paths, currency. Import this instead of hardcoding category slugs.
- **`db/index.ts`** — singleton `better-sqlite3` DB connection, typed interfaces (`Product`, `Category`, `ProductPicture`, `FAQ`), and pre-compiled `queries` object (lazy-initialised). All DB access goes through this module.
- **`db/schema.sql`** — tables: `categories`, `products`, `product_pictures`, `faqs`, `faq_products`.
- **`stores/cart.ts`** — Svelte writable store with localStorage persistence (`keycraft-cart`). Exposes `addItem`, `updateQuantity`, `removeItem`, `clearCart`.
- **`stores/checkout.ts`** — checkout flow state store.
- **`chat/eliza.ts`** — rule-based sales chatbot types and logic; rendered by `Chatbot.svelte` in the global layout.

### Data Flow Pattern

Pages use `+page.ts` load functions to fetch from the `/api/*` server routes. API routes query the SQLite DB via `$lib/db/index.ts`. Product images live in `static/images/{category}/`.

## Configuration Notes

- **Node Version**: Managed by Volta (Node 24.8.0)
- **Prettier**: Tabs, single quotes, 100-char width; `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`
- **Env**: Copy `.env` for local config; `DATABASE_PATH` controls SQLite location

## Testing

No testing framework is currently configured.
