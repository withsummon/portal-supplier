import { test as base } from '@playwright/test'

export type TestUser = {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName: string
  role: 'SELLER' | 'ADMIN'
}

// Seeded admin credentials (from scripts/seed.ts)
// All tests share the same admin account
export const ADMIN_EMAIL = 'admin@withsummon.com'
export const ADMIN_PASSWORD = 'Password123!'

export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    firstName: 'Admin',
    lastName: 'E2E',
    companyName: 'Summon HQ',
    role: 'ADMIN',
  },
}

export interface ExtendedFixtures {
  testUsers: typeof TEST_USERS
  registeredUsers: TestUser[]
}

export const test = base.extend<ExtendedFixtures>({
  testUsers: TEST_USERS,
  registeredUsers: async ({}, use) => {
    await use([])
  },
})
