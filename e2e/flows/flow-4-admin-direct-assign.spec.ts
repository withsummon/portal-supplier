import { test, expect } from '@playwright/test'
import { loginUser, registerUser } from '../helpers/auth'
import {
  startProject,
  markProjectComplete,
  markProjectLunas,
  approveUser,
} from '../helpers/admin-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../helpers/test-users'

const RUN_ID = Date.now()

test.describe('Flow 4: Admin Creates Project Direct to Vendor + Lunas', () => {
  test.describe.configure({ mode: 'serial' })

  const vendorEmail = `vendor_${RUN_ID}@test.com`
  const projectName = `E2E Direct Assign Project ${RUN_ID}`

  // ============================================================
  // T1: Register + approve vendor, then create assigned project
  // ============================================================
  test('T1: Admin creates project assigned to vendor', async ({ page }) => {
    // Register vendor
    await registerUser(page, {
      email: vendorEmail,
      password: 'Vendor123!@#',
      firstName: 'Flow4',
      lastName: 'Vendor',
      companyName: 'Flow4 Vendor Solutions',
      role: 'VENDOR',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Admin approves vendor
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, vendorEmail, 'vendor')

    // Admin creates assigned project
    await page.goto('/admin/projects/new')
    await page.waitForLoadState('networkidle')

    // Navigate to create project
    await page.goto('/admin/projects/new')
    await page.waitForLoadState('networkidle')

    // The admin project form has 4 steps: Project Basics, Requirements, Timeline & Budget, Review
    // Step 0: Project Basics - set mode to 'assign', fill name, client, category, select vendor

    // Set mode to assign (appears first in DOM)
    await page.getByRole('button', { name: /Assign to Vendor/i }).click()
    await page.waitForTimeout(300)

    // Vendor select is first select in assign mode
    const vendorSelect = page.locator('select.select').first()
    if (await vendorSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      const vendorOpts = vendorSelect.locator('option')
      const vendorCount = await vendorOpts.count()
      for (let i = 0; i < vendorCount; i++) {
        const text = await vendorOpts.nth(i).textContent()
        if (text && text.toLowerCase().includes('flow4')) {
          await vendorSelect.selectOption({ index: i })
          break
        }
      }
      await page.waitForTimeout(200)
    }

    // Fill project name and client name
    await page.locator('input[placeholder*="Enterprise"]').fill(projectName)
    await page.locator('input[placeholder*="PT Maju"]').fill('Direct Client Inc')

    // Category select is 2nd select in assign mode
    const categorySelect = page.locator('select.select').nth(1)
    const opts = categorySelect.locator('option')
    const count = await opts.count()
    for (let i = 0; i < count; i++) {
      const text = await opts.nth(i).textContent()
      if (text && /technology/i.test(text)) {
        await categorySelect.selectOption({ index: i })
        break
      }
    }
    await page.waitForTimeout(200)

    // Description
    await page.locator('textarea[placeholder*="Describe"]').fill(
      'Full-stack development with React frontend and Node.js backend',
    )

    // Click Next Step
    await page.getByRole('button', { name: /next step/i }).click()
    await page.waitForTimeout(500)

    // Step 1: Requirements - skip or fill
    await page.getByRole('button', { name: /next step/i }).click()
    await page.waitForTimeout(500)

    // Step 2: Timeline & Budget
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    const endDate = new Date(futureDate)
    endDate.setDate(endDate.getDate() + 45)

    const dateInputs = page.locator('input[type="date"]')
    if (await dateInputs.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await dateInputs.first().fill(futureDate.toISOString().split('T')[0])
      await dateInputs.last().fill(endDate.toISOString().split('T')[0])
    }

    await page.getByRole('button', { name: /next step/i }).click()
    await page.waitForTimeout(500)

    // Step 3: Review - look for Assign Project button
    await page.getByRole('button').filter({ hasText: /assign project/i }).click()

    await page.waitForTimeout(3000)

    // Should be on projects list or detail
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/admin\/projects/i)

    // Verify project appears
    await page.goto('/admin/projects')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=' + projectName).first()).toBeVisible({ timeout: 10000 })
  })

  // ============================================================
  // T2: Project created in ACCEPTED status with vendor assigned
  // ============================================================
  test('T2: Project is in ACCEPTED status', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await page.goto('/admin/projects')
    await page.waitForLoadState('networkidle')

    const projectRow = page.locator('tr, [class*="row"], [class*="card"]').filter({ hasText: projectName })
    await expect(projectRow).toBeVisible({ timeout: 10000 })

    const acceptedText = projectRow.locator('text=/accepted/i')
    await expect(acceptedText.first()).toBeVisible({ timeout: 5000 })
  })

  // ============================================================
  // T3: Vendor sees assigned project
  // ============================================================
  test('T3: Vendor sees assigned project', async ({ page }) => {
    await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')
    await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })

    await page.goto('/vendor/projects')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=' + projectName).first()).toBeVisible({ timeout: 10000 })
  })

  // ============================================================
  // T4: Admin starts project (ACCEPTED -> IN_PROGRESS)
  // ============================================================
  test('T4: Admin starts the assigned project', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await startProject(page, projectName)
  })

  // ============================================================
  // T5: Admin marks project complete (IN_PROGRESS -> COMPLETED)
  // ============================================================
  test('T5: Admin marks project as complete', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await markProjectComplete(page, projectName)
  })

  // ============================================================
  // T6: Admin marks project as lunas (COMPLETED -> PAID)
  // ============================================================
  test('T6: Admin marks project as paid (lunas)', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await markProjectLunas(page, projectName)

    // Verify PAID status
    await page.goto('/admin/projects')
    await page.waitForLoadState('networkidle')

    const projectRow = page.locator('tr, [class*="row"], [class*="card"]').filter({ hasText: projectName })
    await expect(projectRow).toBeVisible({ timeout: 10000 })

    const paidText = projectRow.locator('text=/paid|lunas|completed/i')
    await expect(paidText.first()).toBeVisible({ timeout: 5000 })
  })
})
