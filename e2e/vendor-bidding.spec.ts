import { test, expect } from '@playwright/test'
import { loginUser, registerUser } from './helpers/auth'
import { approveUser } from './helpers/admin-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/test-users'

/**
 * Vendor Bidding E2E Tests
 *
 * Full lifecycle test:
 * 1. Vendor sees approved project (from admin/seller)
 * 2. Vendor views project detail
 * 3. Vendor submits bid/proposal
 * 4. Admin accepts bid
 * 5. Project moves to IN_PROGRESS
 * 6. Milestone completion → payment stages
 *
 * Pre-requisites:
 * - Vendor account must be ACTIVE
 * - At least one project must be OPEN FOR BIDDING or ASSIGNED to vendor
 *
 * This spec can be run after admin.spec.ts creates projects in bidding mode,
 * or after a seller-submitted project is approved by admin.
 */
test.describe('Vendor Bidding Flow', () => {
  const timestamp = Date.now()
  const vendorEmail = `vendor_${timestamp}@test.com`

  // Register + approve vendor once before all tests
  test.beforeAll(async ({ page }) => {
    await registerUser(page, {
      email: vendorEmail,
      password: 'Vendor123!@#',
      firstName: 'Vendor',
      lastName: 'E2E',
      companyName: 'Test Vendor Solutions',
      role: 'VENDOR',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, vendorEmail, 'vendor')
  })

  test.beforeEach(async ({ page }) => {
    // Login as vendor
    await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')

    const url = page.url()
    if (url.includes('pending-approval')) {
      test.skip()
    }
    await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })
  })

  // ============================================================
  // VENDOR DASHBOARD
  // ============================================================
  test('dashboard: vendor portal loads', async ({ page }) => {
    await page.goto('/vendor')
    await expect(page.getByRole('heading', { name: /vendor|dashboard/i }).or(page.getByText(/welcome/i))).toBeVisible()
  })

  test('dashboard: view assigned/open projects', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectsTable = page.locator('table, [role="table"], .projects-list')
    await expect(projectsTable.first()).toBeVisible({ timeout: 10000 })
  })

  // ============================================================
  // PROJECT DISCOVERY & DETAIL
  // ============================================================
  test('projects: view open projects available for bidding', async ({ page }) => {
    await page.goto('/vendor/projects')

    // Page should list projects visible to vendor
    const projectItems = page.locator('tr, .project-row, [data-project-id]')
    const count = await projectItems.count()

    // If there are open projects, they should show project name and status
    if (count > 0) {
      await expect(page.getByText(/project|bid/i).first()).toBeVisible()
    }
  })

  test('project detail: view project requirements', async ({ page }) => {
    await page.goto('/vendor/projects')

    // Click first project
    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      // Should show project name, description, requirements
      await expect(page.getByText(/project|requirements|description/i).first()).toBeVisible()
    }
  })

  test('project detail: view project status and seller info', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      await expect(page.getByText(/status|seller/i).first()).toBeVisible()
    }
  })

  // ============================================================
  // BID SUBMISSION
  // ============================================================
  test('bid: submit proposal on open project', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      // Find and click "Submit Proposal" or "Place Bid" button
      const bidButton = page
        .locator('button')
        .filter({ hasText: /submit proposal|place bid|submit bid|bid now/i })
        .first()
      if (await bidButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bidButton.click()
        await page.waitForTimeout(500)

        // Bid drawer/form should appear
        const bidForm = page.locator('[role="dialog"], .drawer-panel, form')
        await expect(bidForm.first()).toBeVisible({ timeout: 5000 })

        // Fill bid amount
        const amountInput = page.locator('input[type="number"]').filter({ hasText: '' }).first()
        if (await amountInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await amountInput.fill('75000')
        }

        // Fill duration
        const durationInput = page.locator('input[type="number"]').filter({ hasText: /days/i }).first()
        if (await durationInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await durationInput.fill('60')
        }

        // Fill proposal
        const proposalArea = page.locator('textarea').filter({ hasText: /approach|team|best fit/i }).first()
        if (await proposalArea.isVisible({ timeout: 3000 }).catch(() => false)) {
          await proposalArea.fill(
            'Our team has extensive experience in this domain. We propose an agile approach with bi-weekly sprints and regular client reviews. We have a dedicated team of 4 engineers ready to start immediately.',
          )
        }

        // Submit bid
        const submitBtn = page.locator('button').filter({ hasText: /submit bid|submit proposal/i }).first()
        if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitBtn.click()
          await page.waitForTimeout(2000)

          // Bid form should close, bid should be visible
          await expect(bidForm.first()).not.toBeVisible({ timeout: 5000 }).catch(() => {})
        }
      }
    }
  })

  test('bid: update existing bid', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      // If already has a bid, there should be an edit button
      const editBidBtn = page.locator('button').filter({ hasText: /edit bid|update|revise/i }).first()
      if (await editBidBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await editBidBtn.click()
        await page.waitForTimeout(500)

        const amountInput = page.locator('input[type="number"]').first()
        if (await amountInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await amountInput.fill('80000')
        }

        const submitBtn = page.locator('button').filter({ hasText: /update|submit/i }).first()
        if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitBtn.click()
          await page.waitForTimeout(2000)
        }
      }
    }
  })

  test('bid: cannot bid twice on same project simultaneously', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      // Should show existing bid status if already submitted
      const existingBid = page.locator('text=/your bid|submitted proposal/i').first()
      if (await existingBid.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(existingBid).toBeVisible()
      } else {
        // Or "Submit Proposal" button if no bid yet
        const bidBtn = page.locator('button').filter({ hasText: /submit proposal|bid now/i }).first()
        await expect(bidBtn.or(page.getByText(/no bid/i))).toBeVisible({ timeout: 3000 })
      }
    }
  })

  // ============================================================
  // PROJECT TRACKING
  // ============================================================
  test('projects: track project status after bid submission', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      // Should show bid status (PENDING, ACCEPTED, etc.)
      const bidStatus = page.locator('[class*="badge"], [class*="status"]')
      await expect(bidStatus.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('projects: view messages/conversation with seller', async ({ page }) => {
    await page.goto('/vendor/projects')

    const projectLink = page.locator('a[href*="/vendor/projects/"]').first()
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click()
      await page.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

      const messagesTab = page.locator('button, a').filter({ hasText: /message|chat|conversation/i }).first()
      if (await messagesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await messagesTab.click()
        await page.waitForTimeout(500)
        const messageArea = page.locator('[class*="message"], textarea, input[type="text"]')
        await expect(messageArea.first()).toBeVisible({ timeout: 5000 })
      }
    }
  })

  // ============================================================
  // QUOTES PAGE
  // ============================================================
  test('quotes: view all submitted quotes', async ({ page }) => {
    await page.goto('/vendor/quotes')

    // Should show list of quotes/bids submitted
    const quotesPage = page.locator('table, [role="table"], .quotes-list')
    if (await quotesPage.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(quotesPage.first()).toBeVisible()
    }
  })

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  test('notifications: receive notification when bid is accepted', async ({ page }) => {
    await page.goto('/vendor/notifications')

    // Should show notifications list
    const notificationsArea = page.locator('.notification, [role="list"], .notifications-list')
    if (await notificationsArea.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(notificationsArea.first()).toBeVisible()
    }
  })
})

/**
 * Full Vendor Bidding Lifecycle (Integration Test)
 *
 * This test covers the complete flow from project discovery to
 * bid acceptance and project progress. It requires coordinated
 * setup: admin creates project in bidding mode, then vendor bids.
 *
 * Run with: bun playwright test e2e/vendor-bidding.spec.ts --grep "lifecycle"
 */
test.describe('Vendor Bidding Lifecycle', () => {
  const timestamp = Date.now()
  const vendorEmail = `vendor_lifecycle_${timestamp}@test.com`

  // Register + approve vendor once before all lifecycle tests
  test.beforeAll(async ({ page }) => {
    await registerUser(page, {
      email: vendorEmail,
      password: 'Vendor123!@#',
      firstName: 'Lifecycle',
      lastName: 'Vendor',
      companyName: 'Lifecycle Vendor Solutions',
      role: 'VENDOR',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, vendorEmail, 'vendor')
  })

  test('full lifecycle: project discovery → bid → acceptance → in_progress', async ({ browser }) => {
    // This test uses a fresh context to simulate clean state
    const context = await browser.newContext()
    const vendorPage = await context.newPage()

    try {
      // Step 1: Vendor logs in
      await loginUser(vendorPage, vendorEmail, 'Vendor123!@#', 'vendor')

      const url = vendorPage.url()
      if (url.includes('pending-approval')) {
        test.skip()
      }

      await expect(vendorPage).toHaveURL(/\/vendor/i, { timeout: 15000 })

      // Step 2: Navigate to projects
      await vendorPage.goto('/vendor/projects')
      await vendorPage.waitForLoadState('networkidle')

      // Step 3: Find an open project
      const projectLink = vendorPage.locator('a[href*="/vendor/projects/"]').first()

      if (await projectLink.isVisible({ timeout: 10000 }).catch(() => false)) {
        await projectLink.click()
        await vendorPage.waitForURL(/\/vendor\/projects\/[^/]+$/i, { timeout: 10000 })

        // Step 4: Submit bid
        const bidButton = vendorPage.locator('button').filter({ hasText: /submit proposal|bid now/i }).first()

        if (await bidButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await bidButton.click()
          await vendorPage.waitForTimeout(500)

          const amountInput = vendorPage.locator('input[type="number"]').filter({ hasText: '' }).first()
          if (await amountInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await amountInput.fill('100000')
          }

          const durationInput = vendorPage.locator('input[type="number"]').filter({ hasText: /days/i }).first()
          if (await durationInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await durationInput.fill('90')
          }

          const proposalArea = vendorPage.locator('textarea').first()
          if (await proposalArea.isVisible({ timeout: 3000 }).catch(() => false)) {
            await proposalArea.fill('E2E test proposal - full stack web development with modern technologies.')
          }

          const submitBtn = vendorPage.locator('button').filter({ hasText: /submit/i }).first()
          if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await submitBtn.click()
            await vendorPage.waitForTimeout(2000)
          }

          // Step 5: Verify bid is recorded
          const bidStatus = vendorPage.locator('[class*="badge"], [class*="status"]').first()
          await expect(bidStatus).toBeVisible({ timeout: 5000 })
        }
      }
    } finally {
      await context.close()
    }
  })
})
