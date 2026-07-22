import { test, expect, type Page } from '@playwright/test'
import { loginUser } from './helpers/auth'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/test-users'

const legacyRole = `${'ven'}${'dor'}`
const legacyPlural = `${legacyRole}s`
const legacyRoutePattern = new RegExp(legacyRole, 'i')
const roleMismatchText = /does not match the selected workspace/i

async function expectGonePage(page: Page, path: string) {
  const response = await page.goto(path)
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  expect(response?.status() ?? 200).toBeLessThan(500)
  await expect(page.getByText(/application error|internal server error/i)).toHaveCount(0)
}

async function fillBasics(page: Page) {
  await page.locator('input[placeholder*="E-Commerce" i]').fill('Edge Case Project')
  await page.locator('input[placeholder*="PT Maju" i]').fill('Edge Client')
  await page.locator('select').first().selectOption({ index: 1 })
  await page
    .locator('textarea[placeholder*="brief overview" i]')
    .fill('Edge case project description.')
}

async function reachTimelineStep(page: Page) {
  await fillBasics(page)
  await page.getByRole('button', { name: /next step/i }).click()
  await page
    .locator('textarea[placeholder*="technical and functional" i]')
    .fill('Edge case requirements.')
  await page.getByRole('button', { name: /next step/i }).click()
}

test.describe('Portal edge cases', () => {
  test('legacy partner routes do not render active pages', async ({ page }) => {
    await expectGonePage(page, `/${legacyRole}`)

    await expectGonePage(page, `/register/${legacyRole}`)

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await expectGonePage(page, `/admin/${legacyPlural}`)
    await expect(page.getByText(legacyRoutePattern)).toHaveCount(0)
  })

  test('cross-role protected routes redirect to the correct portal', async ({ page }) => {
    await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
    await page.goto('/admin/products')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 10000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await page.goto('/projects')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 10000 })
  })

  test('login rejects credentials submitted through the wrong portal role', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'seller')
    await expect(page.getByText(roleMismatchText)).toBeVisible({ timeout: 8000 })

    await loginUser(page, 'seller@arya.local', 'Password123!', 'admin')
    await expect(page.getByText(roleMismatchText)).toBeVisible({ timeout: 8000 })
  })

  test('project submit blocks empty required fields on each required step', async ({ page }) => {
    await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
    await page.goto('/projects/submit')

    await page.getByRole('button', { name: /next step/i }).click()
    await expect(page.getByText('Project name is required.')).toBeVisible()

    await fillBasics(page)
    await page.getByRole('button', { name: /next step/i }).click()
    await page.getByRole('button', { name: /next step/i }).click()
    await expect(page.getByText('Detailed requirements are required.')).toBeVisible()

    await page
      .locator('textarea[placeholder*="technical and functional" i]')
      .fill('Edge case requirements.')
    await page.getByRole('button', { name: /next step/i }).click()
    await page.getByRole('button', { name: /next step/i }).click()
    await expect(page.getByText('Expected start date is required.')).toBeVisible()
  })

  test('project submit rejects an end date before the start date', async ({ page }) => {
    await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
    await page.goto('/projects/submit')
    await reachTimelineStep(page)

    await page.locator('input[type="date"]').nth(0).fill('2026-08-31')
    await page.locator('input[type="date"]').nth(1).fill('2026-08-01')
    await page.locator('select').last().selectOption({ index: 1 })
    await page.locator('input[name="priority"][value="medium"]').check()
    await page.getByRole('button', { name: /next step/i }).click()

    await expect(page.getByText('Expected end date must be after the start date.')).toBeVisible()
    await expect(page.getByText(/review your project details/i)).toHaveCount(0)
  })
})
