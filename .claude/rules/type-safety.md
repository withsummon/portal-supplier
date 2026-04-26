# Project Type Safety Rules

This document defines the type safety rules enforced in this project.

## TypeScript Strict Mode

All rules from `tsconfig.json` are active:
- `strict: true` — enables all strict type-checking options
- `strictNullChecks: true` — null/undefined must be handled explicitly
- `noUncheckedIndexedAccess: true` — array/object index access returns `T | undefined`
- `exactOptionalPropertyTypes: true` — `?:` vs `: undefined` are distinct
- `noImplicitReturns: true` — every code path must return
- `noFallthroughCasesInSwitch: true` — exhaustive switch statements

## ESLint Rules

From `.eslintrc` (via `typescript-eslint/strict`):

### Type Safety

- **`@typescript-eslint/no-explicit-any`** (error) — never use `any`, use `unknown` + narrowing
- **`@typescript-eslint/no-non-null-assertion`** (error) — never use `!`, handle null explicitly
- **`@typescript-eslint/no-unnecessary-type-assertion`** (error) — remove redundant `as` casts
- **`@typescript-eslint/consistent-type-imports`** (error) — use `import type` for types
- **`@typescript-eslint/no-floating-promises`** (error) — always await or `.catch()` promises
- **`@typescript-eslint/no-misused-promises`** (error) — don't pass sync values to async callbacks

### React

- **`react-hooks/rules-of-hooks`** (error) — hooks called unconditionally at top level
- **`react-hooks/exhaustive-deps`** (warn) — all dependencies in useEffect/useCallback deps

### Best Practices

- **`no-console`** (warn) — only `warn` and `error` allowed in code
- **`prettier/prettier`** (error) — code must be formatted per `.prettierrc`

## Project-Specific Rules

### No Prisma Imports

Prisma has been replaced with Drizzle ORM. All database access must use:
```typescript
import { db } from "@/db";
import { tableName } from "@/db/schema";
```

Never import from `@prisma/client`.

### Database Client Usage

- **Server Components**: Can import `db` directly for async queries
- **Client Components**: Never import `db` directly. Server wrapper fetches data, serializes dates, passes via props
- **Server Actions**: Use `db` for all mutations in `src/lib/actions/`

### Serialization Rule

When passing data from server to client components, serialize dates:
```typescript
// ❌ Date objects cannot cross server-client boundary
<ClientComponent project={project} />

// ✅ Serialize dates to ISO strings
<ClientComponent project={{ ...project, createdAt: project.createdAt.toISOString() }} />
```

### Status Enum Mapping

DB uses UPPERCASE status values (`SUBMITTED`), UI uses lowercase snake_case (`submitted`).

Use mapping utilities from `src/lib/utils/data.ts`:
```typescript
import { dbToMockStatus, mockToDbStatus } from "@/lib/utils/data";

// DB → UI
const uiStatus = dbToMockStatus[dbProject.status] ?? dbProject.status;

// UI → DB
const dbStatus = mockToDbStatus[uiStatus] ?? "SUBMITTED";
```

### Return Type Pattern for Server Actions

Use discriminated unions for action results:
```typescript
// ✅ Correct
async function createProject(data: ProjectInput) {
  try {
    const project = await db.insert(projects).values(data).returning();
    return { success: true, data: project } as const;
  } catch {
    return { error: "Failed to create project" } as const;
  }
}

// ❌ Don't return raw values that can throw
async function createProject(data: ProjectInput) {
  return db.insert(projects).values(data).returning(); // can throw
}
```

### No `as` Assertions

Avoid type assertions. When types don't match:
1. Use type guards or narrowing
2. Use intermediate variables with explicit types
3. Use `zod` for validation

```typescript
// ❌
const status = row.status as ProjectStatus;

// ✅
const status = dbToMockStatus[row.status] ?? row.status;
```

### Auth Context

- User role is `SELLER | VENDOR | ADMIN` (all uppercase)
- Server actions should verify session before mutating data
- Never trust client-supplied user IDs — get from session

### Import Conventions

```typescript
// ✅ Correct import patterns
import { db } from "@/db";                        // Drizzle client
import { users, projects } from "@/db/schema";    // Schema tables
import { eq, desc, and } from "drizzle-orm";    // Drizzle query builders
import { auth } from "@/lib/auth";                // Better Auth instance
import { signIn, signOut } from "@/lib/actions/auth"; // Server actions
import { formatDate, dbToMockStatus } from "@/lib/utils/data"; // Utilities
import type { InferSelectModel } from "drizzle-orm"; // Type utilities

// ❌ Never do this
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
```

### InferSelectModel for Row Types

When you need the type of a database row:
```typescript
import type { InferSelectModel } from "drizzle-orm";
import { projects } from "@/db/schema";

type Project = InferSelectModel<typeof projects>;
```

### Zod for Form Validation

Use Zod for validating form data before DB operations:
```typescript
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export async function createProject(formData: FormData) {
  const parsed = CreateProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid form data" };
  // ... proceed with parsed.data
}
```
