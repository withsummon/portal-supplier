import { test, expect, type Page } from '@playwright/test'
import { loginUser } from './helpers/auth'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/test-users'

async function expectHealthyPage(page: Page, path: string, text: RegExp) {
  const response = await page.goto(path)
  expect(response?.status() ?? 200).toBeLessThan(500)
  await expect(page.getByText(text).first()).toBeVisible({ timeout: 15000 })
  await expect(
    page.getByText(new RegExp(`application error|internal server error|${'ven'}${'dor'}`, 'i')),
  ).toHaveCount(0)
}

test.describe('Portal smoke', () => {
  test('admin routes render without legacy partner surface', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await expectHealthyPage(page, '/admin', /dashboard/i)
    await expectHealthyPage(page, '/admin/sellers', /makelar|seller/i)
    await expectHealthyPage(page, '/admin/projects', /projects/i)
    await expectHealthyPage(page, '/admin/products', /products|factory/i)
    await expectHealthyPage(page, '/admin/messages', /messages/i)
    await expectHealthyPage(page, '/admin/notifications', /notifications/i)
    await expectHealthyPage(page, '/admin/team', /team/i)
    await expectHealthyPage(page, '/admin/profile', /profile/i)
  })

  test('seller routes render without legacy partner surface or article fixtures', async ({
    page,
  }) => {
    await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

    await expectHealthyPage(page, '/dashboard', /dashboard/i)
    await expectHealthyPage(page, '/projects', /projects/i)
    await expectHealthyPage(page, '/projects/submit', /submit new project/i)
    await expectHealthyPage(page, '/factory', /factory/i)
    await expectHealthyPage(page, '/messages', /messages/i)
    await expectHealthyPage(page, '/notifications', /notifications/i)
    await expectHealthyPage(page, '/profile', /profile/i)
    await expectHealthyPage(page, '/team', /team/i)
    await expectHealthyPage(page, '/research', /no research articles yet/i)
    await expectHealthyPage(page, '/wiki', /no wiki articles yet/i)
  })
})
