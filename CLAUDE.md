# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-tenant B2B portal connecting Sellers (suppliers) with Vendors, managed by an internal Admin team. Built with Next.js 16 App Router, **Drizzle ORM**, PostgreSQL, and **Better Auth**.

## Common Commands

```bash
bun run dev       # Start development server
bun run build     # Production build
bun run lint      # Run ESLint
bun run lint:fix  # Fix ESLint issues
bun run format    # Format with Prettier
bun run db:generate  # Generate Drizzle migrations
bun run db:push   # Push schema to database (dev only)
bun run db:migrate # Run pending migrations (production)
bun run db:studio # Open Drizzle Studio (GUI)
```

## Architecture

### Route Groups (App Router)

| Group | Purpose | URL Prefix |
|-------|---------|------------|
| `(auth)` | Login, register, onboarding, password reset | `/login`, `/register`, etc. |
| `(dashboard)` | Seller/supplier main portal | `/dashboard/*`, `/projects/*` |
| `(vendor)` | Vendor portal for quotes and projects | `/vendor/*` |
| `(admin)` | Internal Summon admin panel | `/admin/*` |

### Data Layer

- **Database client**: `src/db/index.ts` exports `db` (Drizzle instance) and all schema exports
- **Schema**: `src/db/schema.ts` — all tables and relations defined with Drizzle ORM
- **DB enums**: Stored as PostgreSQL enums via `pgEnum()`, mapped with Drizzle
- **Server Actions**: `src/lib/actions/*.ts` — all DB mutations via server actions
- **Auth**: Better Auth + `@auth/drizzle-adapter` for session management
- **Utilities**: `src/lib/utils/data.ts` — date formatting, status mapping, labels

### Schema Pattern

- Tables use `uuid` primary keys with `defaultRandom()`
- Timestamps use `{ withTimezone: true }`
- JSON arrays use `jsonb` with explicit `$type<T[]>()`
- Relations defined in `schema.ts` using `relations()` from `drizzle-orm`
- All tables have `createdAt` / `updatedAt` via `.defaultNow()` / `.$onUpdate()`
- Status enums in DB use UPPERCASE (e.g., `SUBMITTED`), UI uses lowercase snake_case (e.g., `submitted`)
- Use `dbToMockStatus` / `mockToDbStatus` from `src/lib/utils/data.ts` for mapping

### Component Pattern

- **Server Components**: Fetch data directly from `db` via async functions
- **Client Components**: Receive serialized (JSON-compatible) data via props from server wrappers
- **Server wrapper**: `page.tsx` — async component that fetches data and passes to client
- **Client component**: Named `XxxClient.tsx` or within page file with `'use client'` directive
- Never import `db` directly in client components — serialize dates with `.toISOString()`

### Auth

- Better Auth handles sessions, cookies, and user management
- Server actions use `cookies()` from `next/headers` to get session
- User role (SELLER/VENDOR/ADMIN) stored in `users.role` enum
- Profile data stored in `sellers` or `vendors` table linked by `userId`

### Styling

Pure CSS with custom properties in `src/app/globals.css` — no Tailwind. The CSS defines:
- Design tokens (colors, typography scale, spacing)
- Utility classes: `.card`, `.btn`, `.badge`, `.table`, `.form-group`, `.kpi-grid`
- Layout classes: `.portal-layout`, `.portal-main`, `.portal-content`
- Animation classes: `.fadeIn`, `.slide-in-right`, `.zoom-in`

Path alias: `@/*` maps to `./src/*`. `@/db` maps to `./src/db/index.ts`.

### Icons

All icons use `lucide-react`. Import directly from `lucide-react`.

### Key Files

- `src/db/schema.ts` — Drizzle ORM schema (all tables, enums, relations)
- `src/db/index.ts` — Drizzle client singleton
- `src/lib/auth.ts` — Better Auth configuration
- `src/lib/actions/auth.ts` — Auth server actions (signIn, signOut, registerUser)
- `src/lib/actions/projects.ts` — Project CRUD server actions
- `src/lib/utils/data.ts` — Date formatting, status mapping, UI labels
- `src/components/layout/DashboardLayout.tsx` — Server wrapper (fetches projects for CommandBar)
- `src/components/layout/DashboardLayoutClient.tsx` — Client shell (sidebar state)
- `src/components/layout/Sidebar.tsx` — Navigation sidebar
- `src/components/layout/Header.tsx` — Top bar with notifications
- `src/components/layout/CommandBar.tsx` — CMD+K command palette (receives projects as prop)

## Type Safety Rules

### Strict TypeScript (tsconfig.json)

The project enables strict mode plus:
- `strictNullChecks: true` — explicit null/undefined handling
- `noUncheckedIndexedAccess: true` — array access returns `T | undefined`
- `exactOptionalPropertyTypes: true` — `?:` vs `: undefined` distinction
- `noImplicitReturns: true` — all code paths must return
- `noFallthroughCasesInSwitch: true` — exhaustive switch statements

### Best Practices

1. **No `any`** — Use `unknown` when type is truly unknown, then narrow
2. **No type assertions (`as`)** — Prefer type guards or narrowing
3. **No non-null assertions (`!`)** — Handle null explicitly
4. **Use `InferSelectModel`** from `drizzle-orm` for DB row types
5. **Use `InferInsertModel`** for insert payloads
6. **Use `zod`** for form validation (add when needed)
7. **Use `Result` types** for server action returns: `{ success: true, data } | { error: string }`
8. **Use `React.ReactNode`** for children, not `ReactNode` (imported correctly)
9. **Always serialize dates** before passing to client components
10. **Use `dbToMockStatus`** when displaying DB status values in UI
