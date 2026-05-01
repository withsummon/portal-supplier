import { type Page, expect } from '@playwright/test'
import type { TestUser } from './test-users'

const roleText: Record<string, string> = {
  seller: 'Seller',
  vendor: 'Vendor',
  admin: 'Summon Team',
}

export async function registerUser(page: Page, user: TestUser): Promise<void> {
  const rolePath = user.role === 'SELLER' ? '/register/seller' : '/register/vendor'
  await page.goto(rolePath)
  await page.waitForLoadState('networkidle')

  // Fill text inputs using evaluate to ensure React synthetic events fire
  // useActionState needs native DOM events with bubbles: true
  await page.locator('input[name="firstName"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, user.firstName ?? '')

  await page.locator('input[name="lastName"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, user.lastName ?? '')

  await page.locator('input[name="email"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, user.email)

  await page.locator('input[name="password"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, user.password)

  await page.locator('input[name="companyName"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, user.companyName ?? '')

  // Select industry and company size (plain select elements, not combobox)
  await page.locator('select[name="industry"]').selectOption({ index: 1 })
  await page.locator('select[name="companySize"]').selectOption({ index: 1 })

  // Check terms checkbox
  await page.locator('input[type="checkbox"]').first().check()

  // Click submit
  await page.locator('button[type="submit"]').click()
  await page.waitForTimeout(3000)

  const url = page.url()
  if (url.includes('pending-approval')) return

  // If not redirected, check for visible error
  const errorEl = page.locator('[class*="danger"], [class*="error"], [role="alert"]').first()
  if (await errorEl.isVisible({ timeout: 2000 }).catch(() => false)) {
    const errorText = await errorEl.textContent().catch(() => '')
    throw new Error('Registration failed: ' + errorText)
  }

  // Wait for redirect to pending-approval
  await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })
}

export async function loginUser(
  page: Page,
  email: string,
  password: string,
  role: 'seller' | 'vendor' | 'admin',
): Promise<void> {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  // Click role button first (fires React onClick to set selectedRole state)
  const roleBtn = page.locator('button').filter({ hasText: new RegExp('^' + roleText[role] + '$', 'i') }).first()
  if (await roleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await roleBtn.click()
    await page.waitForTimeout(200)
  }

  // Fill controlled inputs using evaluate to trigger React synthetic events
  await page.locator('input[name="email"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, email)

  await page.locator('input[name="password"]').evaluate((el, val) => {
    const input = el as HTMLInputElement
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, password)

  await page.getByRole('button', { name: /sign in/i }).click()
}

export async function expectToBeLoggedIn(page: Page, portalPath: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(portalPath, 'i'), { timeout: 15000 })
}

export async function logoutUser(page: Page): Promise<void> {
  // Logout button is in the sidebar with title="Sign Out"
  const logoutBtn = page.locator('button[title="Sign Out"]').first()
  if (await logoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await logoutBtn.click()
    await page.waitForTimeout(2000)
  } else {
    // Fallback: navigate directly to login
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
  }
}

export async function expectError(page: Page, message: string): Promise<void> {
  await expect(page.getByText(new RegExp(message, 'i'))).toBeVisible({ timeout: 5000 })
}
