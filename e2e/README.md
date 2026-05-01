# E2E Test Suite

## Setup

1. Start the dev server: `bun run dev`
2. Run tests: `bun run test:e2e`

## Scripts

| Command | Description |
|---------|-------------|
| `bun run test:e2e` | Run all e2e tests |
| `bun run test:e2e:ui` | Run with Playwright UI (debug mode) |
| `bun run test:e2e:headed` | Run with visible browser |
| `bun run test:e2e:auth` | Auth flow tests only |
| `bun run test:e2e:seller` | Seller portal tests only |
| `bun run test:e2e:admin` | Admin portal tests only |
| `bun run test:e2e:vendor` | Vendor bidding tests only |

## Test Flow

Tests use the **register → admin approves → login** flow:

1. **Auth tests** (`auth.spec.ts`) — Register seller/vendor, test login validation, test auth redirect
2. **Seller tests** (`seller.spec.ts`) — Login as approved seller, submit multi-step project, view projects
3. **Admin tests** (`admin.spec.ts`) — Login as admin, approve sellers/vendors, review/approve/reject projects, create projects (bidding + assign mode)
4. **Vendor tests** (`vendor-bidding.spec.ts`) — Login as approved vendor, discover projects, submit bid, track bid status

## Order of Execution

For full integration flow, run in order:

```bash
# 1. Auth creates users (pending approval)
bun run test:e2e:auth

# 2. Admin approves users and projects
bun run test:e2e:admin

# 3. Seller submits project (after approval)
bun run test:e2e:seller

# 4. Vendor bids on projects
bun run test:e2e:vendor
```

## Design Decisions

- **Serial mode** for auth tests (same email can't register twice)
- **Conditional selectors** — tests check visibility before interacting (UI may vary)
- **Skip on pending** — tests skip if user not yet approved by admin
- **No DB seeding** — tests go through the full register+approve flow for realism
- **Single worker** (`workers: 1`) — avoids race conditions with shared DB state

## Key Files

- `helpers/auth.ts` — Login/register helpers
- `helpers/test-users.ts` — Test user factory
- `helpers/project-helpers.ts` — Project form step helpers
