import { test, expect, type Page } from '@playwright/test'
import { registerUser, loginUser, expectError } from '../helpers/auth'
import { approveUser, rejectUser } from '../helpers/admin-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../helpers/test-users'

const RUN_ID = Date.now()

test.describe('Flow 1: Registration & Admin Approval', () => {
  test.describe.configure({ mode: 'serial' })

  // ============================================================
  // T1: Seller registers -> admin approves -> seller can login
  // ============================================================
  test('T1: Seller registers and gets approved by admin', async ({ page }) => {
    const sellerEmail = `seller_${RUN_ID}@test.com`

    // Step 1: Seller registers
    await registerUser(page, {
      email: sellerEmail,
      password: 'Seller123!@#',
      firstName: 'Seller',
      lastName: 'One',
      companyName: 'Seller One Corp',
      role: 'SELLER',
    })

    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Step 2: Admin approves
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await approveUser(page, sellerEmail, 'seller')

    // Step 3: Seller can now login
    await page.goto('/login')
    await loginUser(page, sellerEmail, 'Seller123!@#', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

    // Cleanup: logout
    const logoutBtn = page.locator('button').filter({ hasText: /logout|sign out/i }).first()
    if (await logoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutBtn.click()
    }
  })

  // ============================================================
  // T2: Vendor registers -> admin approves -> vendor can login
  // ============================================================
  test('T2: Vendor registers and gets approved by admin', async ({ page }) => {
    const vendorEmail = `vendor_${RUN_ID}@test.com`

    // Step 1: Vendor registers
    await registerUser(page, {
      email: vendorEmail,
      password: 'Vendor123!@#',
      firstName: 'Vendor',
      lastName: 'One',
      companyName: 'Vendor One Solutions',
      role: 'VENDOR',
    })

    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Step 2: Admin approves
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await approveUser(page, vendorEmail, 'vendor')

    // Step 3: Vendor can now login
    await page.goto('/login')
    await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')
    await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })
  })

  // ============================================================
  // T3: Seller registers -> admin rejects -> seller sees rejection
  // ============================================================
  test('T3: Seller registers and gets rejected by admin', async ({ page }) => {
    const sellerEmail = `seller_reject_${RUN_ID}@test.com`

    await registerUser(page, {
      email: sellerEmail,
      password: 'Seller123!@#',
      firstName: 'Seller',
      lastName: 'Reject',
      companyName: 'Rejected Seller Inc',
      role: 'SELLER',
    })

    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await rejectUser(page, sellerEmail, 'seller')

    // Seller tries to login - should still be rejected
    await page.goto('/login')
    await loginUser(page, sellerEmail, 'Seller123!@#', 'seller')

    // Login should fail or redirect to pending
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('/dashboard')
  })

  // ============================================================
  // T4: Vendor registers -> admin rejects -> vendor sees rejection
  // ============================================================
  test('T4: Vendor registers and gets rejected by admin', async ({ page }) => {
    const vendorEmail = `vendor_reject_${RUN_ID}@test.com`

    await registerUser(page, {
      email: vendorEmail,
      password: 'Vendor123!@#',
      firstName: 'Vendor',
      lastName: 'Reject',
      companyName: 'Rejected Vendor Inc',
      role: 'VENDOR',
    })

    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await rejectUser(page, vendorEmail, 'vendor')

    await page.goto('/login')
    await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')

    const currentUrl = page.url()
    expect(currentUrl).not.toContain('/vendor')
  })

  // ============================================================
  // T5: Registration with missing required fields shows validation
  // ============================================================
  test('T5: Registration with missing fields shows validation error', async ({ page }) => {
    await page.goto('/register/seller')
    await page.waitForLoadState('networkidle')

    // Submit without filling required fields
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(1000)

    // Should show validation errors (browser native validation or React validation)
    const errorEls = page.locator('[class*="error"], [class*="danger"], [role="alert"], [aria-invalid="true"]')
    const count = await errorEls.count()
    // Either browser validation or React validation should show errors
    expect(count).toBeGreaterThan(0)
  })

  // ============================================================
  // T6: Duplicate email registration fails
  // ============================================================
  test('T6: Registering with existing email fails', async ({ page }) => {
    const email = `duplicate_${RUN_ID}@test.com`

    await registerUser(page, {
      email,
      password: 'Seller123!@#',
      firstName: 'Seller',
      lastName: 'Dup',
      companyName: 'Dup Corp',
      role: 'SELLER',
    })

    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Try registering again with same email
    await page.goto('/register/seller')
    await page.waitForLoadState('networkidle')

    // Use evaluate to set all field values (bypasses React controlled state temporarily)
    // Then click submit via Playwright for proper React event handling
    await page.evaluate((e: string) => {
      const setInput = (sel: string, val: string) => {
        const el = document.querySelector(sel) as HTMLInputElement
        if (!el) return
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        setter?.call(el, val)
        el.dispatchEvent(new Event('input', { bubbles: true }))
        el.dispatchEvent(new Event('change', { bubbles: true }))
      }
      setInput('input[name="firstName"]', 'Another')
      setInput('input[name="lastName"]', 'Seller')
      setInput('input[name="email"]', e)
      setInput('input[name="password"]', 'Seller123!@#')
      setInput('input[name="companyName"]', 'Another Corp')
    }, email)

    await page.locator('select[name="industry"]').selectOption({ index: 1 })
    await page.locator('select[name="companySize"]').selectOption({ index: 1 })
    await page.locator('input[type="checkbox"]').first().check()
    await page.locator('button[type="submit"]').click()

    await page.waitForTimeout(2000)

    // Should show error about duplicate email
    await expectError(page, 'email already registered')
  })
})
