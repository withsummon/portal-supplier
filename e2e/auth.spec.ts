import { test, expect } from '@playwright/test'
import { registerUser, loginUser } from './helpers/auth'
import { approveUser } from './helpers/admin-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/test-users'

const RUN_ID = Date.now()

/**
 * Auth E2E Tests
 *
 * Tests verify: registration, login redirects, login validation,
 * and protected route redirects.
 *
 * Each test handles its own register+approve so they run independently.
 * Uses unique RUN_ID per execution to avoid email collisions across runs.
 */
test.describe('Auth Flow', () => {
  test('workspace roles: only Seller and admin are offered', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /^Seller$/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Summon Team$/i })).toBeVisible()
    await page.goto('/register')
    await expect(page).toHaveURL(/\/register\/seller/i)
  })

  // ============================================================
  // REGISTRATION
  // ============================================================

  test('SELLER: register → pending approval', async ({ page }) => {
    const email = `auth_seller_${RUN_ID}@test.com`
    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'AuthSeller',
      lastName: 'User',
      companyName: 'Auth Seller Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })
  })

  // ============================================================
  // LOGIN WITH APPROVED USER
  // ============================================================

  test('SELLER: login → redirect to dashboard after approval', async ({ page }) => {
    const email = `auth_seller_${RUN_ID}_approved@test.com`

    // Register + approve
    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'AuthSeller',
      lastName: 'Approved',
      companyName: 'Auth Seller Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, email, 'seller')

    // Now login as approved seller
    await loginUser(page, email, 'Seller123!@#', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
  })

  test('ADMIN: login → redirect to admin portal', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
  })

  // ============================================================
  // LOGIN VALIDATION
  // ============================================================

  test('login: show error on invalid credentials', async ({ page }) => {
    await loginUser(page, 'wrong@test.com', 'WrongPass123!', 'seller')
    await expect(page.getByText(/invalid|incorrect|wrong|failed|error/i)).toBeVisible({
      timeout: 8000,
    })
  })

  test('register: show error on weak password', async ({ page }) => {
    await page.goto('/register/seller')
    await page.waitForLoadState('networkidle')

    await page.locator('input[name="firstName"]').fill('Test')
    await page.locator('input[name="lastName"]').fill('User')
    await page.locator('input[name="email"]').fill(`auth_weak_pwd_${RUN_ID}@test.com`)
    await page.locator('input[name="password"]').fill('123')
    await page.locator('input[name="companyName"]').fill('Test Company')

    const ind = page.locator('select[name="industry"]')
    if (await ind.isVisible({ timeout: 2000 }).catch(() => false)) {
      await ind.selectOption({ index: 1 })
    }

    const size = page.locator('select[name="companySize"]')
    if (await size.isVisible({ timeout: 2000 }).catch(() => false)) {
      await size.selectOption({ index: 1 })
    }

    const cb = page.locator('input[type="checkbox"]')
    if (await cb.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cb.check()
    }

    await page.locator('form').locator('button[type="submit"]').click()
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible({
      timeout: 8000,
    })
  })

  // ============================================================
  // PROTECTED ROUTES
  // ============================================================

  test('redirect to login when accessing protected routes unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/i, { timeout: 5000 })

    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/i, { timeout: 5000 })
  })
})
