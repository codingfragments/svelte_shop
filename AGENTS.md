# Repository Guidelines

## Project Structure & Module Organization
The SvelteKit app lives in `src/`. Routes follow `src/routes/**/+page.svelte` and companion `+page.ts` or `+server.ts`. Shared UI sits in `src/lib/components`, database helpers in `src/lib/db`, and runtime config in `src/lib/config.ts`. Public assets belong in `static/` (e.g., `static/images/<category>`), build artifacts in `build/`, and operational scripts in `scripts/`. Environment defaults stay in `.env`, and SQLite data is persisted in `data/db.sqlite`.

## Build, Test, and Development Commands
Use `npm run dev` to start the Vite dev server (`npm run dev -- --open` auto-opens a browser). Build production bundles with `npm run build`, then inspect via `npm run preview`. `npm run check` executes Svelte + TypeScript checks, while `npm run lint` and `npm run format` run Prettier and Tailwind sorting. Database workflows are handled through `npm run db:init | wipe | seed | export | reset`. Confirm the dev server with `npm run health`. Docker users can run `npm run docker:build` then `npm run docker:run`.

## Coding Style & Naming Conventions
Code is TypeScript, Svelte 5, and Tailwind 4 with two-space indentation. Prefer `$lib/...` imports for shared modules. Component files use PascalCase in `src/lib/components`, while routes rely on SvelteKit naming (`+page.*`, `+layout.*`). Always run `npm run format` before committing; Prettier 3 with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss` enforces style.

## Testing Guidelines
No unit test framework ships yet; add Vitest when introducing automated tests. Place specs alongside sources as `*.spec.ts` (e.g., `src/lib/utils/foo.spec.ts`). Keep API route tests deterministic by mocking the DB or using an in-memory SQLite file. Document manual test steps in pull requests when automated coverage is absent.

## Commit & Pull Request Guidelines
Write commits in imperative mood with concise subjects ≤72 characters and optional rationale bodies. Pull requests should link issues when available, explain scope, list verification steps, and include screenshots or GIFs for UI updates. Note any database or environment changes explicitly and keep diffs focused.

## Security & Configuration Tips
Never commit secrets; read configuration from `.env`. When exposing API routes under `src/routes/api`, validate inputs and avoid revealing internal error details. Use `npm run db:reset` to rebuild the local SQLite database and ensure migrations stay reproducible.
