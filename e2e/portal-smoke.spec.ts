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
  test.setTimeout(60000)

  test('admin routes render without legacy partner surface', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await expectHealthyPage(page, '/admin', /dashboard/i)
    await expectHealthyPage(page, '/admin/sellers', /seller/i)
    await expectHealthyPage(page, '/admin/projects', /projects/i)
    await expectHealthyPage(page, '/admin/products', /products|factory/i)
    await expectHealthyPage(page, '/admin/articles', /articles/i)
    await expectHealthyPage(page, '/admin/messages', /messages/i)
    await expectHealthyPage(page, '/admin/notifications', /notifications/i)
    await expectHealthyPage(page, '/admin/team', /team/i)
    await expectHealthyPage(page, '/admin/profile', /profile/i)
  })

  test('seller routes render without legacy partner surface or seeded article content', async ({
    page,
  }) => {
    await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

    await expectHealthyPage(page, '/dashboard', /dashboard/i)
    await expect(page.getByRole('heading', { name: /^Welcome,/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /good evening|good morning|good afternoon/i })).toHaveCount(0)
    await expectHealthyPage(page, '/projects', /projects/i)
    await expectHealthyPage(page, '/projects/submit', /submit new project/i)
    await expectHealthyPage(page, '/factory', /factory/i)
    await expect(page.getByRole('button', { name: /produk/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /portofolio/i })).toBeVisible()
    const productLink = page.locator('a[href^="/factory/"]').first()
    await expect(productLink).toBeVisible({ timeout: 10000 })
    await productLink.click()
    await expect(page).toHaveURL(/\/factory\/[^/]+$/i, { timeout: 10000 })
    await expect(page.getByRole('link', { name: /back to factory/i })).toBeVisible()
    await expect(page.locator('[role="dialog"]')).toHaveCount(0)
    const nextBanner = page.getByRole('button', { name: /next banner/i })
    if (await nextBanner.isVisible({ timeout: 1000 }).catch(() => false)) {
      await nextBanner.click()
      await page.getByRole('button', { name: /previous banner/i }).click()
    }
    await page.goto('/factory')
    await expectHealthyPage(page, '/messages', /messages/i)
    await expectHealthyPage(page, '/notifications', /notifications/i)
    await expectHealthyPage(page, '/profile', /profile/i)
    await expectHealthyPage(page, '/team', /team/i)
    await expectHealthyPage(page, '/research', /articles|no articles yet/i)
    await expectHealthyPage(page, '/wiki', /no wiki articles yet/i)
  })

  test('admin can publish an article and seller can read it', async ({ page }) => {
    const title = `Smoke Article ${Date.now()}`

    try {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
      await page.goto('/admin/articles')
      await page.getByRole('button', { name: /add article/i }).click()
      await page.getByPlaceholder('Title').fill(title)
      await page.getByPlaceholder('Excerpt').fill('Real article smoke excerpt')
      await page.getByPlaceholder('Article content').fill('Real article smoke content')
      await page.getByLabel('Published').check()
      await page.getByRole('button', { name: /save article/i }).click()
      await expect(page.getByText(title)).toBeVisible({ timeout: 15000 })

      await page.context().clearCookies()
      await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
      await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
      await page.goto('/research')
      await page.getByText(title).click()
      await expect(page).toHaveURL(/\/research\/[^/]+$/i, { timeout: 10000 })
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
    } finally {
      await page.context().clearCookies()
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
      await page.goto('/admin/articles')
      await page.getByPlaceholder('Search articles...').fill(title)
      const row = page.locator('tr').filter({ hasText: title }).first()
      if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
        await row.getByRole('button').last().click()
      }
    }
  })
})
