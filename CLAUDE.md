# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run check` - Type check with svelte-check
- `npm run check:watch` - Type check in watch mode
- `npm run format` - Format code with Prettier
- `npm run lint` - Check code formatting

## Tech Stack

- **SvelteKit 2.22.0** with Svelte 5.0.0 - Full-stack framework with file-based routing
- **TypeScript 5.0.0** - Strict type checking enabled
- **TailwindCSS 4.0.0** - Utility-first CSS framework
- **Vite 7.0.4** - Build tool and dev server

## Architecture

**File-based Routing**: Routes are defined by files in `src/routes/`

- `+page.svelte` - Page components
- `+layout.svelte` - Layout components
- Use `$lib` alias for shared components/utilities

**Key Directories**:

- `src/lib/` - Shared components and utilities (import via `$lib/`)
- `src/routes/` - Pages and layouts (file-based routing)
- `static/` - Static assets served from root

Backend api:

- use svelte server routes for backend api calls

## Configuration Notes

- **Node Version**: Managed by Volta (Node 22.19.0)
- **Prettier**: Uses tabs, single quotes, 100 char width, automatic TailwindCSS class sorting
- **TypeScript**: Strict mode with modern module resolution
- **Adapter**: Uses `@sveltejs/adapter-auto` for automatic deployment detection

## Testing

No testing framework is currently configured. Consider adding Vitest for unit testing.

