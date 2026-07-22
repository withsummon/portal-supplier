# Portal Supplier Transcript Tasks - 2026-07-22

Source: Gemini transcript summary from audio `22 Jul, 21.59_.m4a`.

## Current Code Evidence

- Seller dashboard already fetches real project/seller data in `src/app/(dashboard)/dashboard/page.tsx`.
- Product create/update already persists product currency as `IDR` in `src/lib/actions/products.ts`.
- Factory seller page already has `Produk` and `Portofolio` filters through `src/hooks/use-factory-products.ts`.
- Product detail already exists at `/factory/[slug]` with banner slider, description, features, use cases, clients, and pitch deck link.
- Existing smoke test covers `/factory`, product detail navigation, banner previous/next, and legacy vendor wording guard.

## Task 1 - Dashboard Data And Currency Audit

Status: Done on 2026-07-23. Existing dashboard code was audited; seller/admin dashboard data is DB-backed and money labels use `formatIDR`. Seller Factory surfaces are covered by smoke checks that reject visible `Rp`, `IDR`, `USD`, and dollar price text.

Problem: The dashboard must not show foreign currency or placeholder/static business data.

Outcome: Seller and admin dashboard values are real DB-backed values and all money is formatted as Rupiah.

Implementation scope:

- Audit `src/app/(dashboard)/dashboard/page.tsx`, `src/components/dashboard/InsightsCharts.tsx`, and `src/app/(admin)/admin/AdminDashboardClient.tsx`.
- Replace any remaining static dashboard metrics with existing DB data helpers or add the smallest server-side query needed.
- Use `formatIDR` from `src/lib/currency.ts` for all dashboard money labels.
- Keep product pricing hidden from seller-facing factory pages.

Acceptance criteria:

- No seller/admin dashboard visible text contains `USD`, `$`, dollar wording, mock values, or placeholder revenue.
- Dashboard still renders for sellers with zero projects.
- `rtk bun run lint` passes.
- Seller smoke at `/dashboard` passes with system Chrome Playwright.

## Task 2 - Factory List Vertical Layout

Status: Superseded on 2026-07-23. User explicitly asked to keep the grid card layout.

Problem: Transcript asks product listing to be a vertical downward list, not a sideways/card grid.

Outcome: `/factory` shows a scan-friendly vertical list where each product/portfolio item is one full-width row.

Implementation scope:

- Change `src/app/(dashboard)/factory/FactoryPageClient.tsx` from `repeat(3, 1fr)` card grid to a single-column vertical list.
- Keep existing search and `Produk` / `Portofolio` category behavior.
- Keep the first banner image, product/portfolio badge, name, description, and detail link.
- Do not show price.

Acceptance criteria:

- `/factory` item container uses a one-column vertical layout on desktop and mobile.
- Product/portfolio filters still work.
- Product cards/rows still link to `/factory/[slug]`.
- No price or currency is visible on `/factory`.
- Existing factory smoke test passes after selector updates if needed.

## Task 3 - Factory Detail Page Polish

Status: Done on 2026-07-23. Detail page now has clearer `Overview`, `Features`, `Use Cases`, and `Clients` sections while keeping the existing banner slider and grid-card entry flow.

Problem: Detail page should read like a professional product workspace inspired by DoraHacks-style information hierarchy.

Outcome: `/factory/[slug]` is easier to scan, with strong banner media, clear overview, features, clients, and attachments.

Implementation scope:

- Refine `src/app/(dashboard)/factory/[slug]/page.tsx` layout using existing CSS tokens/classes.
- Keep `FactoryProductBanner` as the slider; improve spacing/section hierarchy only where needed.
- Make long description, features, use cases, clients, and pitch deck link easy to read.
- Rename user-facing copy away from "makelar"; current app terminology is seller/supplier/admin.

Acceptance criteria:

- Detail page includes banner slider, description, features, use cases, clients when present, and pitch deck link when present.
- Detail page works with one image, multiple images, and no image.
- No modal is introduced.
- No price or currency is visible on product detail.

## Task 4 - Seller Factory Portfolio Proof

Status: Done on 2026-07-23. `/factory` derives a unique client proof strip from existing product `clients` data and hides it when no clients exist.

Problem: Seller portal needs stronger portfolio proof, especially previous clients/partners under the main banner.

Outcome: Factory experience makes prior clients visible as portfolio evidence.

Implementation scope:

- On `/factory`, derive a compact unique client list from visible portfolio/product items with `clients`.
- Show that client strip near the top of the page, below the page header/search area.
- Keep per-item client chips on detail pages.
- Do not add a new table unless existing product `clients` data is insufficient.

Acceptance criteria:

- A seller can see prior clients/partners before opening a detail page.
- The client strip hides cleanly when no products have clients.
- Duplicate client names are shown once.
- Existing product form `clients` field remains the source of truth.

## Task 5 - Summon Factory UI Cleanup

Status: Done on 2026-07-23. Factory grid cards are preserved, responsive grid behavior is kept, and detail/banner spacing now uses shared CSS classes.

Problem: The Factory UI needs to feel more polished and functional without introducing a new design dependency.

Outcome: Factory list and detail pages look consistent with the current portal design system.

Implementation scope:

- Use existing `src/app/globals.css` tokens and utilities.
- Adjust spacing, row density, responsive behavior, image aspect ratios, and button/icon alignment.
- Add or reuse focused classes only if inline styles become repeated/noisy.
- Do not add Lovable output or Figma export code directly to the repo.

Acceptance criteria:

- Desktop and mobile layouts do not overlap or clip text.
- Buttons use existing `btn` classes and lucide icons where applicable.
- Palette stays within existing portal tokens.
- `rtk bun run lint` and focused Playwright factory smoke pass.

## Suggested Order

1. Task 1: dashboard audit, because it catches data/currency correctness.
2. Task 2: superseded; keep grid cards.
3. Task 4: client proof strip, because it extends existing `clients` data.
4. Task 3: detail polish, because the slider/detail foundations already exist.
5. Task 5: final UI cleanup and responsive verification.

## Verification Commands

```bash
rtk bun run lint
rtk env BASE_URL=http://localhost:3001 PLAYWRIGHT_USE_SYSTEM_CHROME=1 bunx playwright test e2e/portal-smoke.spec.ts
```
