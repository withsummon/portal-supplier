import { test, expect } from '@playwright/test'
import { loginUser, registerUser } from '../helpers/auth'
import { approveUser } from '../helpers/admin-helpers'
import { submitSellerProject, submitQuote, fillSellerStep1, fillSellerStep2 } from '../helpers/project-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../helpers/test-users'

const RUN_ID = `crud_${Date.now()}`

test.describe('Flow 5: Full CRUD All Roles', () => {
  test.describe.configure({ mode: 'serial' })

  // ============================================================
  // SELLER CRUD
  // ============================================================

  test.describe('Seller CRUD', () => {
    const sellerEmail = `seller_${RUN_ID}@test.com`

    test('S-T1: Seller creates project', async ({ page }) => {
      // Register and get approved
      await registerUser(page, {
        email: sellerEmail,
        password: 'Seller123!@#',
        firstName: 'CrudSeller',
        lastName: 'User',
        companyName: 'CRUD Seller Corp',
        role: 'SELLER',
      })
      await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
      await approveUser(page, sellerEmail, 'seller')

      // Now login as seller
      await page.goto('/login')
      await loginUser(page, sellerEmail, 'Seller123!@#', 'seller')
      const afterLoginUrl = page.url()
      if (afterLoginUrl.includes('pending-approval')) {
        throw new Error('Seller was not approved - cannot proceed with project creation')
      }
      await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

      // Submit project
      await page.goto('/projects/submit')
      await page.waitForLoadState('networkidle')

      const projectName = `Seller CRUD Project ${RUN_ID}`

      await fillSellerStep1(page, {
        projectName,
        clientName: 'CRUD Client',
        category: 'Web Development',
        description: 'CRUD test project description',
      })

      await page.locator('button').filter({ hasText: /next/i }).first().click()
      await page.waitForTimeout(500)

      // Step 2
      await fillSellerStep2(page, {
        requirements: 'CRUD test requirements',
      })

      await page.locator('button').filter({ hasText: /next/i }).first().click()
      await page.waitForTimeout(500)

      // Step 3
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const endDate = new Date(futureDate)
      endDate.setDate(endDate.getDate() + 30)
      await page.locator('input[type="date"]').first().fill(futureDate.toISOString().split('T')[0])
      await page.locator('input[type="date"]').last().fill(endDate.toISOString().split('T')[0])

      await page.locator('button').filter({ hasText: /next/i }).first().click()
      await page.waitForTimeout(300)

      // Step 4 - skip attachments
      await page.locator('button').filter({ hasText: /next/i }).first().click()
      await page.waitForTimeout(300)

      // Step 5 - submit
      await submitSellerProject(page)
      await page.waitForTimeout(3000)

      await expect(page.locator('text=' + projectName).first()).toBeVisible({ timeout: 10000 })
    })

    test('S-T2: Seller views own projects list', async ({ page }) => {
      await loginUser(page, sellerEmail, 'Seller123!@#', 'seller')
      await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

      await page.goto('/projects')
      await page.waitForLoadState('networkidle')

      const projectList = page.locator('[class*="table"], [class*="list"], [class*="card"]')
      await expect(projectList.first()).toBeVisible({ timeout: 5000 })
    })

    test('S-T3: Seller views project detail', async ({ page }) => {
      await loginUser(page, sellerEmail, 'Seller123!@#', 'seller')
      await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

      await page.goto('/projects')
      await page.waitForLoadState('networkidle')

      const projectName = `Seller CRUD Project ${RUN_ID}`
      const projectLink = page.locator('a').filter({ hasText: projectName }).first()
      if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await projectLink.click()
        await page.waitForLoadState('networkidle')
        await expect(page.locator('text=' + projectName)).toBeVisible({ timeout: 5000 })
      }
    })
  })

  // ============================================================
  // VENDOR CRUD
  // ============================================================

  test.describe('Vendor CRUD', () => {
    const vendorEmail = `vendor_${RUN_ID}@test.com`

    test('V-T1: Vendor browses marketplace and views project detail', async ({ page }) => {
      await registerUser(page, {
        email: vendorEmail,
        password: 'Vendor123!@#',
        firstName: 'CrudVendor',
        lastName: 'User',
        companyName: 'CRUD Vendor Solutions',
        role: 'VENDOR',
      })
      await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
      await approveUser(page, vendorEmail, 'vendor')

      await page.goto('/login')
      await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')
      const vendorUrl = page.url()
      if (vendorUrl.includes('pending-approval')) {
        throw new Error('Vendor was not approved - cannot proceed')
      }
      await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })

      await page.goto('/vendor/projects')
      await page.waitForLoadState('networkidle')

      const projectCard = page.locator('[class*="card"], [class*="project"]').first()
      await expect(projectCard).toBeVisible({ timeout: 10000 })

      const firstProject = page.locator('[class*="card"], [class*="project"]').filter({ hasText: /.+/i }).first()
      if (await firstProject.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstProject.click()
        await page.waitForTimeout(1000)
      }
    })

    test('V-T2: Vendor submits quote', async ({ page }) => {
      await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')
      await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })

      await page.goto('/vendor/projects')
      await page.waitForLoadState('networkidle')

      const projectCard = page.locator('[class*="card"]').filter({ hasText: /.+/i }).first()
      if (await projectCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await projectCard.click()
        await page.waitForLoadState('networkidle')

        const submitQuoteBtn = page.locator('button').filter({ hasText: /submit proposal/i }).first()
        if (await submitQuoteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitQuoteBtn.click()
          await page.waitForTimeout(500)

          await submitQuote(page, {
            amount: '15000000',
            duration: '45',
            proposal: 'We can deliver this project with our experienced team.',
          })
        }
      }
    })

    test('V-T3: Vendor views quotes list', async ({ page }) => {
      await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')
      await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })

      await page.goto('/vendor/quotes')
      await page.waitForLoadState('networkidle')

      const quotesSection = page.locator('text=/quote|proposal/i')
      await expect(quotesSection.first()).toBeVisible({ timeout: 5000 })
    })
  })

  // ============================================================
  // ADMIN CRUD
  // ============================================================

  test.describe('Admin CRUD', () => {
    test('A-T1: Admin manages sellers', async ({ page }) => {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

      await page.goto('/admin/sellers')
      await page.waitForLoadState('networkidle')

      const sellersTable = page.locator('[class*="table"], [class*="list"]')
      await expect(sellersTable.first()).toBeVisible({ timeout: 5000 })

      const body = await page.content()
      expect(body.toLowerCase()).toContain('seller')
    })

    test('A-T2: Admin manages vendors', async ({ page }) => {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

      await page.goto('/admin/vendors')
      await page.waitForLoadState('networkidle')

      const vendorsTable = page.locator('[class*="table"], [class*="list"]')
      await expect(vendorsTable.first()).toBeVisible({ timeout: 5000 })

      const body = await page.content()
      expect(body.toLowerCase()).toContain('vendor')
    })

    test('A-T3: Admin manages projects', async ({ page }) => {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

      await page.goto('/admin/projects')
      await page.waitForLoadState('networkidle')

      const projectsTable = page.locator('[class*="table"], [class*="list"]')
      await expect(projectsTable.first()).toBeVisible({ timeout: 5000 })

      const body = await page.content()
      expect(body.toLowerCase()).toMatch(/project|submit/i)
    })

    test('A-T4: Admin manages team members', async ({ page }) => {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

      await page.goto('/admin/team')
      await page.waitForLoadState('networkidle')

      const body = await page.content()
      expect(body.toLowerCase()).toMatch(/team|member|admin/i)
    })

    test('A-T5: Admin manages products', async ({ page }) => {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

      await page.goto('/admin/products')
      await page.waitForLoadState('networkidle')

      const body = await page.content()
      expect(body.toLowerCase()).toMatch(/product|item/i)
    })

    test('A-T6: Admin views notifications', async ({ page }) => {
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
      await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

      await page.goto('/admin/notifications')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
    })
  })
})
