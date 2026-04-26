# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-tenant B2B portal connecting Sellers (suppliers) with Vendors, managed by an internal Admin team. Built with Next.js 16 App Router, Prisma + PostgreSQL, and Auth.js v5 (NextAuth).

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npx prisma studio # Open Prisma database GUI
npx prisma migrate dev  # Run database migrations
```

## Architecture

### Route Groups (App Router)

| Group | Purpose | URL Prefix |
|-------|---------|------------|
| `(auth)` | Login, register, onboarding, password reset | `/login`, `/register`, etc. |
| `(dashboard)` | Seller/supplier main portal | `/dashboard/*`, `/projects/*` |
| `(vendor)` | Vendor portal for quotes and projects | `/vendor/*` |
| `(admin)` | Internal Summon admin panel | `/admin/*` |

All authenticated portals share `src/components/layout/DashboardLayout` as their shell (sidebar + header + command bar).

### Data Layer

- **Mock data**: All pages currently import from `src/lib/mock-data.ts` with static data
- **Database**: Prisma schema in `prisma/schema.prisma` defines the full data model — DB integration not yet wired up
- **Prisma client**: `src/lib/prisma.ts` exports a singleton instance with dev-mode query logging
- **Auth**: Auth.js v5 (`next-auth@5.0.0-beta.30`) is installed but not yet configured

### Prisma Schema Summary

- **User** — auth accounts, linked to one of: Seller, Vendor, or AdminTeamMember
- **Seller** — supplier profile with status (PENDING/ACTIVE/SUSPENDED/REJECTED) and tier (PLATINUM/GOLD/SILVER/BRONZE)
- **Vendor** — vendor profile with same status/tier model
- **Project** — PRJ-001 formatted ID, statuses (SUBMITTED → COMPLETED), priority levels, files, status history, notes, comments
- **Quote** — vendor responses to projects with amount, duration, proposal text
- **Product** — factory/Summon product catalog with slug, features, use cases, images
- **Conversation / Message** — messaging system with individual, group, and project-scoped conversations
- **Notification** — typed notifications (PROJECT_SUBMITTED, QUOTE_RECEIVED, etc.)
- **TeamMember** — seller's internal team members

### Styling

Pure CSS with custom properties in `src/app/globals.css` — no Tailwind. The CSS defines:
- Design tokens (colors, typography scale, spacing)
- Utility classes: `.card`, `.btn`, `.badge`, `.table`, `.form-group`, `.kpi-grid`
- Layout classes: `.portal-layout`, `.portal-main`, `.portal-content`
- Animation classes: `.fadeIn`, `.slide-in-right`, `.zoom-in`

Path alias: `@/*` maps to `./src/*`

### Icons

All icons use `lucide-react`. Import directly in components from `lucide-react`.

### Key Files

- `src/components/layout/DashboardLayout.tsx` — shared authenticated shell ('use client')
- `src/components/layout/Sidebar.tsx` — navigation sidebar
- `src/components/layout/Header.tsx` — top bar with search/notifications
- `src/components/layout/CommandBar.tsx` — CMD+K command palette
- `src/lib/mock-data.ts` — current mock data for all pages
- `src/lib/prisma.ts` — Prisma client singleton
