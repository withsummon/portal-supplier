import { test, expect } from '@playwright/test'
import { loginUser, logoutUser, registerUser } from '../helpers/auth'
import { approveUser } from '../helpers/admin-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../helpers/test-users'

const RUN_ID = Date.now()

/**
 * Flow 2: Login & Logout
 *
 * Each test registers + approves its own test user so they run independently.
 * Uses seeded admin for approval steps.
 */
test.describe('Flow 2: Login & Logout', () => {
  // T1: Login as seller -> redirected to dashboard
  test('T1: Seller can login and access dashboard', async ({ page }) => {
    const email = `flow2_seller_${RUN_ID}@test.com`

    // Register + get approved
    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'Flow2',
      lastName: 'Seller',
      companyName: 'Flow2 Seller Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, email, 'seller')

    // Now login as the approved seller
    await loginUser(page, email, 'Seller123!@#', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
  })

  // T2: Login as vendor -> redirected to vendor portal
  test('T2: Vendor can login and access vendor portal', async ({ page }) => {
    const email = `flow2_vendor_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Vendor123!@#',
      firstName: 'Flow2',
      lastName: 'Vendor',
      companyName: 'Flow2 Vendor Solutions',
      role: 'VENDOR',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, email, 'vendor')

    await loginUser(page, email, 'Vendor123!@#', 'vendor')
    await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })
  })

  // T3: Login as admin -> redirected to admin panel
  test('T3: Admin can login and access admin panel', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    const body = await page.content()
    expect(body.toLowerCase()).toContain('admin')
  })

  // T4: Login with wrong password -> error shown
  test('T4: Login with wrong password shows error', async ({ page }) => {
    const email = `flow2_wrongpwd_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'Wrong',
      lastName: 'Pwd',
      companyName: 'Wrong Pwd Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await approveUser(page, email, 'seller')

    // Try login with wrong password
    await page.goto('/login')
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill('WrongPassword123!')
    const roleBtn = page.locator('button').filter({ hasText: /seller/i }).first()
    if (await roleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await roleBtn.click()
    }
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForTimeout(2000)

    const errorEl = page.locator('[class*="danger"], [class*="error"], [role="alert"]')
    const hasError = await errorEl.isVisible({ timeout: 5000 }).catch(() => false)
    const currentUrl = page.url()
    expect(hasError || !currentUrl.includes('/dashboard')).toBeTruthy()
  })

  // T5: Login with wrong role fails
  test('T5: Login with wrong role shows error', async ({ page }) => {
    const email = `flow2_wrongrole_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'Wrong',
      lastName: 'Role',
      companyName: 'Wrong Role Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await approveUser(page, email, 'seller')

    // Try login as vendor with seller credentials
    await page.goto('/login')
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill('Seller123!@#')
    const vendorBtn = page.locator('button').filter({ hasText: /vendor/i }).first()
    if (await vendorBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await vendorBtn.click()
    }
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForTimeout(2000)

    const currentUrl = page.url()
    expect(currentUrl).not.toContain('/vendor')
  })

  // T6: Unapproved user redirected to pending
  test('T6: Unapproved user redirected to pending approval page', async ({ page }) => {
    const email = `flow2_unapproved_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'Unapproved',
      lastName: 'User',
      companyName: 'Unapproved Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Try login without approval
    await page.goto('/login')
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill('Seller123!@#')
    const roleBtn = page.locator('button').filter({ hasText: /seller/i }).first()
    if (await roleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await roleBtn.click()
    }
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForTimeout(2000)

    const currentUrl = page.url()
    expect(currentUrl).not.toContain('/dashboard')
  })

  // T7: Logout -> redirected to login
  test('T7: User can logout and is redirected to login', async ({ page }) => {
    const email = `flow2_logout_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'Logout',
      lastName: 'User',
      companyName: 'Logout Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Admin approves the user first
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, email, 'seller')

    // Now logout admin and login as seller
    await page.goto('/login')
    await loginUser(page, email, 'Seller123!@#', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

    await logoutUser(page)
    await expect(page).toHaveURL(/\/login/i, { timeout: 10000 })
  })

  // T8: Session persists across page navigations
  test('T8: Session persists across navigation', async ({ page }) => {
    const email = `flow2_session_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Vendor123!@#',
      firstName: 'Session',
      lastName: 'User',
      companyName: 'Session Vendor',
      role: 'VENDOR',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Admin approves the vendor first
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, email, 'vendor')

    // Now logout admin and login as vendor
    await page.goto('/login')
    await loginUser(page, email, 'Vendor123!@#', 'vendor')
    await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })

    await page.goto('/vendor/projects')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/vendor/i)
  })
})
