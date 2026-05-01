import { test, expect, type Page } from '@playwright/test'
import { loginUser } from './helpers/auth'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/test-users'

/**
 * Admin E2E Tests
 *
 * Tests cover: admin login, project review (approve/reject),
 * seller/vendor management, admin project creation.
 *
 * Pre-requisite: admin account must be ACTIVE.
 *
 * Flow for testing project lifecycle with admin:
 * 1. Seller registers → admin approves seller
 * 2. Seller submits project → admin reviews (approve/reject)
 * 3. Admin creates project (bidding mode) → vendor sees it
 * 4. Admin creates project (assign mode) → specific vendor gets it
 */
test.describe('Admin Portal', () => {
  const timestamp = Date.now()

  test.beforeEach(async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')

    const url = page.url()
    if (url.includes('pending-approval')) {
      test.skip()
    }
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
  })

  // ============================================================
  // ADMIN DASHBOARD / OVERVIEW
  // ============================================================
  test('dashboard: admin overview page loads', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  // ============================================================
  // PROJECT MANAGEMENT
  // ============================================================
  test('projects: view all projects', async ({ page }) => {
    await page.goto('/admin/projects')
    await page.waitForLoadState('networkidle')

    expect(page.url()).toMatch(/\/admin\/projects/i)
    // Should show project-related content (table, filter bar, or empty state)
    const hasTable = await page.locator('table.table').isVisible().catch(() => false)
    const hasSearchInput = await page.getByPlaceholder(/search/i).isVisible().catch(() => false)
    const hasEmptyState = await page.getByText(/no projects|0 projects/i).isVisible().catch(() => false)
    expect(hasTable || hasSearchInput || hasEmptyState).toBeTruthy()
  })

  test('projects: approve a submitted project', async ({ page }) => {
    await page.goto('/admin/projects')

    // Find a submitted project row
    const submittedRow = page.locator('tr, .project-row, [data-status="SUBMITTED" i], [data-status="submitted" i]').first()
    if (await submittedRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submittedRow.click()

      // Look for approve/accept button
      const approveBtn = page
        .locator('button')
        .filter({ hasText: /approve|accept|review/i })
        .first()
      if (await approveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await approveBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test('projects: reject a submitted project', async ({ page }) => {
    await page.goto('/admin/projects')

    const submittedRow = page.locator('tr, .project-row').filter({ hasText: /submitted/i }).first()
    if (await submittedRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submittedRow.click()

      const rejectBtn = page.locator('button').filter({ hasText: /reject/i }).first()
      if (await rejectBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await rejectBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test('projects: request clarification from seller', async ({ page }) => {
    await page.goto('/admin/projects')

    const projectRow = page.locator('tr, .project-row').filter({ hasText: /submitted|under_review/i }).first()
    if (await projectRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectRow.click()

      const clarifyBtn = page.locator('button').filter({ hasText: /clarification|need more/i }).first()
      if (await clarifyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await clarifyBtn.click()
        await page.waitForTimeout(500)

        // Should show a textarea for clarification note
        const noteArea = page.locator('textarea').filter({ hasText: /clarification|note/i }).first()
        if (await noteArea.isVisible({ timeout: 3000 }).catch(() => false)) {
          await noteArea.fill('Please clarify the scope and deliverables.')
          const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /submit|send/i }).first()
          await submitBtn.click()
        }
      }
    }
  })

  test('projects: view project detail', async ({ page }) => {
    await page.goto('/admin/projects')

    const projectLink = page.locator('a[href*="/admin/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/admin\/projects\/[^/]+$/i, { timeout: 10000 })

      await expect(page.getByText(/project|detail|name/i).first()).toBeVisible()
    }
  })

  // ============================================================
  // ADMIN PROJECT CREATION
  // ============================================================
  test.describe('Admin Project Creation', () => {
    /**
     * Fill admin project form using Playwright native methods.
     * page.fill() triggers React onChange for inputs.
     * page.selectOption() triggers React onChange for selects properly.
     */
    async function fillAdminProjectForm(
      page: Page,
      data: {
        projectName: string
        clientName: string
        categoryText: string
        description: string
        mode?: 'bidding' | 'assign'
        vendorText?: string
      },
    ) {
      // Set mode first (changes DOM — vendor select appears in assign mode)
      if (data.mode === 'assign') {
        await page.getByRole('button', { name: /Assign to Vendor/i }).click()
        await page.waitForTimeout(300)
      }

      // Vendor select (only in assign mode — appears first in DOM)
      if (data.mode === 'assign' && data.vendorText) {
        // Use evaluate to find option by partial text match, then select by value
        const vendorValue = await page.evaluate((text) => {
          const selects = document.querySelectorAll<HTMLSelectElement>('select.select')
          if (!selects[0]) return null
          const opts = Array.from(selects[0].options)
          const match = opts.find((o) => o.textContent?.includes(text))
          return match?.value ?? null
        }, data.vendorText)
        if (vendorValue) {
          await page.locator('select.select').first().selectOption(vendorValue)
          await page.waitForTimeout(200)
        }
      }

      // Project name & client name — Playwright fill() triggers React onChange
      await page.locator('input[placeholder*="Enterprise"]').fill(data.projectName)
      await page.locator('input[placeholder*="PT Maju"]').fill(data.clientName)

      // Category select — 2nd select in assign mode, 1st in bidding mode
      const catIndex = data.mode === 'assign' ? 1 : 0
      await page.locator('select.select').nth(catIndex).selectOption({ label: data.categoryText })
      await page.waitForTimeout(200)

      // Description
      await page.locator('textarea[placeholder*="Describe"]').fill(data.description)
    }

    test('create project in bidding mode (open for vendors)', async ({ page }) => {
      await page.goto('/admin/projects/new')

      await fillAdminProjectForm(page, {
        projectName: `Admin Bidding Project ${timestamp}`,
        clientName: `Admin Test Client ${timestamp}`,
        categoryText: 'Cloud Infrastructure',
        description: 'Admin-created project for vendor bidding E2E test.',
        mode: 'bidding',
      })

      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: /next step/i }).click()
        await page.waitForTimeout(500)
      }

      await page.getByRole('button').filter({ hasText: /open for bidding/i }).click()
      await page.waitForTimeout(3000)

      expect(page.url()).toMatch(/\/admin\/projects/i)
    })

    test('create project in assign mode (direct to vendor)', async ({ page }) => {
      await page.goto('/admin/projects/new')

      await fillAdminProjectForm(page, {
        projectName: `Admin Assign Project ${timestamp}`,
        clientName: `Admin Assign Client ${timestamp}`,
        categoryText: 'Cloud Infrastructure',
        description: 'Direct-assigned project from admin E2E test.',
        mode: 'assign',
        vendorText: 'CloudForge Systems',
      })

      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: /next step/i }).click()
        await page.waitForTimeout(500)
      }

      await page.waitForTimeout(500)
      await page.getByRole('button').filter({ hasText: /assign project/i }).click()
      await page.waitForTimeout(3000)

      expect(page.url()).toMatch(/\/admin\/projects/i)
    })
  })

  // ============================================================
  // SELLER MANAGEMENT
  // ============================================================
  test('sellers: view all sellers', async ({ page }) => {
    await page.goto('/admin/sellers')

    const sellersTable = page.locator('table, [role="table"], .sellers-list')
    await expect(sellersTable.first()).toBeVisible({ timeout: 10000 })
  })

  test('sellers: approve a pending seller', async ({ page }) => {
    await page.goto('/admin/sellers')

    // Find pending seller
    const pendingRow = page.locator('tr, .seller-row').filter({ hasText: /pending/i }).first()
    if (await pendingRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      const approveBtn = page.locator('button').filter({ hasText: /approve|activate|active/i }).first()
      if (await approveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await approveBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test('sellers: reject a pending seller', async ({ page }) => {
    await page.goto('/admin/sellers')

    const pendingRow = page.locator('tr, .seller-row').filter({ hasText: /pending/i }).first()
    if (await pendingRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      const rejectBtn = page.locator('button').filter({ hasText: /reject/i }).first()
      if (await rejectBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await rejectBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  // ============================================================
  // VENDOR MANAGEMENT
  // ============================================================
  test('vendors: view all vendors', async ({ page }) => {
    await page.goto('/admin/vendors')

    const vendorsTable = page.locator('table, [role="table"], .vendors-list')
    await expect(vendorsTable.first()).toBeVisible({ timeout: 10000 })
  })

  test('vendors: approve a pending vendor', async ({ page }) => {
    await page.goto('/admin/vendors')

    const pendingRow = page.locator('tr, .vendor-row').filter({ hasText: /pending/i }).first()
    if (await pendingRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      const approveBtn = page.locator('button').filter({ hasText: /approve|activate/i }).first()
      if (await approveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await approveBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  // ============================================================
  // ADMIN NAVIGATION
  // ============================================================
  test('navigation: sidebar links work', async ({ page }) => {
    const navLinks = [
      { href: '/admin/projects', label: /project/i },
      { href: '/admin/sellers', label: /seller/i },
      { href: '/admin/vendors', label: /vendor/i },
      { href: '/admin/notifications', label: /notification/i },
    ]

    for (const { href, label } of navLinks) {
      await page.goto('/admin')
      const link = page.locator(`a[href="${href}"], button`).filter({ hasText: label }).first()
      if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
        await link.click()
        await expect(page).toHaveURL(new RegExp(href, 'i'), { timeout: 10000 })
      }
    }
  })
})
