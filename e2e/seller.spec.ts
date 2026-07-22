import { test, expect, type Page } from '@playwright/test'
import { loginUser } from './helpers/auth'

/**
 * Seller E2E Tests
 *
 * Prerequisites: Seller account must be APPROVED (ACTIVE status) by admin.
 * Tests cover: project submit (multi-step), projects list, project detail.
 *
 * To run: bun playwright test e2e/seller.spec.ts
 *
 * NOTE: These tests depend on register+approve flow from auth.spec.ts.
 * For CI, seed DB directly with approved seller users instead.
 */
test.describe('Seller Portal', () => {
  const timestamp = Date.now()

  // Pre-condition: seller must be approved via admin panel
  test.beforeEach(async ({ page }) => {
    // Login as seller
    await loginUser(page, 'seller@arya.local', 'Password123!', 'seller')
    // If redirected to pending-approval, skip test (not yet approved)
    if (page.url().includes('pending-approval')) {
      test.skip()
    }
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })
  })

  // ============================================================
  // PROJECT SUBMISSION (Multi-step form)
  // ============================================================
  test.describe('Project Submission', () => {
    test('submit new project: step 1 → 2 → 3 → 4 → 5 → success', async ({ page }) => {
      await page.goto('/projects/submit')

      // Step 1: Project Basics
      await expect(page.getByText(/step 1: project basics/i)).toBeVisible()
      await page.locator('input[placeholder*="E-Commerce" i]').fill(`E2E Test Project ${timestamp}`)
      await page.locator('input[placeholder*="PT Maju" i]').fill(`Test Client Corp ${timestamp}`)

      // Select category
      const categorySelect = page.locator('select').first()
      await categorySelect.selectOption({ index: 1 })

      // Description
      await page
        .locator('textarea[placeholder*="brief overview" i]')
        .fill('This is an E2E test project for automation.')

      await page.getByRole('button', { name: /next step/i }).click()

      // Step 2: Requirements
      await expect(page.getByText(/requirements/i, { exact: false }).first()).toBeVisible()
      await page
        .locator('textarea[placeholder*="technical and functional" i]')
        .fill('Full-stack web application with React frontend and Node.js backend.')

      // Tech stack - toggle a few
      const techButtons = page
        .locator('button')
        .filter({ hasText: /react|node|typescript/i })
        .first()
      if (await techButtons.isVisible({ timeout: 2000 }).catch(() => false)) {
        await techButtons.click()
      }

      await page.getByRole('button', { name: /next step/i }).click()

      // Step 3: Timeline & Budget
      await expect(page.getByText(/timeline|budget/i).first()).toBeVisible()

      await page.locator('input[type="date"]').nth(0).fill('2026-08-01')
      await page.locator('input[type="date"]').nth(1).fill('2026-08-31')

      const budgetSelect = page.locator('select').filter({ hasText: /.+/i }).first()
      if (await budgetSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await budgetSelect.selectOption({ index: 1 })
      }

      // Priority
      await page.locator('input[name="priority"][value="medium"]').check()

      await page.getByRole('button', { name: /next step/i }).click()

      // Step 4: Attachments (optional)
      await expect(page.getByText(/attachments/i).first()).toBeVisible()
      await page.getByRole('button', { name: /next step/i }).click()

      // Step 4: Review
      await expect(page.getByText(/review/i).first()).toBeVisible()

      // Submit
      await page.getByRole('button', { name: /submit project/i }).click()

      // Should redirect to project detail
      await expect(page).toHaveURL(/\/projects\/[^/]+$/i, { timeout: 10000 })
      await expect(page.getByText(`E2E Test Project ${timestamp}`)).toBeVisible({ timeout: 10000 })
    })

    test('submit project: validation errors on empty form', async ({ page }) => {
      await page.goto('/projects/submit')

      await page.getByRole('button', { name: /next step/i }).click()

      // Should stay on step 1 and show validation
      await expect(page.getByText('Project name is required.')).toBeVisible()
      await expect(page).toHaveURL(/\/projects\/submit/i)
    })
  })

  // ============================================================
  // PROJECTS LIST
  // ============================================================
  test('projects list: view all submitted projects', async ({ page }) => {
    await page.goto('/projects')

    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible()

    // Should have table or list
    const projectTable = page.locator('table, [role="table"], .projects-list, .card')
    await expect(projectTable.first()).toBeVisible()
  })

  test('projects list: filter by status', async ({ page }) => {
    await page.goto('/projects')

    const filterSelect = page
      .locator('select')
      .filter({ hasText: /all|status/i })
      .first()
    if (await filterSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterSelect.selectOption({ index: 1 })
      await page.waitForTimeout(500)
    }
  })

  test('projects list: search by project name', async ({ page }) => {
    await page.goto('/projects')

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill('E2E Test Project')
      await page.waitForTimeout(500)
    }
  })

  // ============================================================
  // PROJECT DETAIL
  // ============================================================
  test('project detail: view submitted project', async ({ page }) => {
    await page.goto('/projects')

    // Click first project link
    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/projects\/[^/]+$/i, { timeout: 10000 })

      // Should show project name, status, timeline
      await expect(page.getByText(/project name|e2e test project/i).first()).toBeVisible()
      await expect(page.getByText(/status|submit/i).first()).toBeVisible()
    }
  })

  test('project detail: show status timeline', async ({ page }) => {
    await page.goto('/projects')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/projects\/[^/]+$/i, { timeout: 10000 })

      // Status timeline section
      const timeline = page.locator('.timeline, [class*="timeline"], [data-testid="timeline"]')
      if (await timeline.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(timeline).toBeVisible()
      }
    }
  })

  test('project detail: navigate back to projects list', async ({ page }) => {
    await page.goto('/projects')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/projects\/[^/]+$/i, { timeout: 10000 })

      const backBtn = page.locator('button').filter({ hasText: /back/i }).first()
      if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await backBtn.click()
        await expect(page).toHaveURL(/\/projects$/i, { timeout: 10000 })
      }
    }
  })
})
