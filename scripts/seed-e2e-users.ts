/**
 * Seeds test users for E2E tests.
 * Run with: bun run scripts/seed-e2e-users.ts
 */
import { db } from '../src/db'
import { users, sellers, vendors } from '../src/db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

const PREFIX = 'e2e_test'

const testUsers = [
  // Pre-approved sellers
  { email: `${PREFIX}_seller@test.com`, password: 'Seller123!@#', role: 'SELLER' as const, firstName: 'E2E', lastName: 'Seller', approved: true },
  { email: `${PREFIX}_wrongpwd@test.com`, password: 'Seller123!@#', role: 'SELLER' as const, firstName: 'WrongPwd', lastName: 'Seller', approved: true },
  { email: `${PREFIX}_wrongrole@test.com`, password: 'Seller123!@#', role: 'SELLER' as const, firstName: 'WrongRole', lastName: 'Seller', approved: true },
  // Pre-approved vendors
  { email: `${PREFIX}_vendor@test.com`, password: 'Vendor123!@#', role: 'VENDOR' as const, firstName: 'E2E', lastName: 'Vendor', approved: true },
  // Unapproved users
  { email: `${PREFIX}_seller_reject@test.com`, password: 'Seller123!@#', role: 'SELLER' as const, firstName: 'Reject', lastName: 'Seller', approved: false },
  { email: `${PREFIX}_vendor_reject@test.com`, password: 'Vendor123!@#', role: 'VENDOR' as const, firstName: 'Reject', lastName: 'Vendor', approved: false },
  { email: `${PREFIX}_dup@test.com`, password: 'Seller123!@#', role: 'SELLER' as const, firstName: 'Dup', lastName: 'Seller', approved: false },
]

async function main() {
  console.log('Seeding E2E test users...')

  for (const u of testUsers) {
    try {
      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, u.email))
      if (existing.length > 0) {
        console.log(`  Skipping ${u.email} (already exists)`)
        continue
      }

      const hashedPassword = await hash(u.password, 10)

      const userRows = await db.insert(users).values({
        email: u.email,
        name: `${u.firstName} ${u.lastName}`,
        password: hashedPassword,
        role: u.role,
        emailVerified: true,
      }).returning({ id: users.id })

      const user = userRows[0]
      if (!user) {
        console.error(`  Failed to create user record for ${u.email}`)
        continue
      }

      if (u.approved) {
        if (u.role === 'SELLER') {
          await db.insert(sellers).values({
            userId: user.id,
            companyName: `${u.firstName} ${u.lastName} Corp`,
            status: 'ACTIVE',
          })
        } else {
          await db.insert(vendors).values({
            userId: user.id,
            companyName: `${u.firstName} ${u.lastName} Solutions`,
            status: 'ACTIVE',
          })
        }
      }

      console.log(`  Created ${u.email} (${u.role}, ${u.approved ? 'ACTIVE' : 'PENDING'})`)
    } catch (err) {
      console.error(`  Failed to create ${u.email}:`, err)
    }
  }

  console.log('Done.')
}

main()
