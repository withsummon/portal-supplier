import { test, expect } from '@playwright/test'
import { loginUser, registerUser } from '../helpers/auth'
import {
  approveUser,
  reviewProject,
  acceptQuote,
  startProject,
  markProjectComplete,
  markProjectLunas,
} from '../helpers/admin-helpers'
import {
  fillSellerStep1,
  fillSellerStep2,
  fillSellerStep3,
  submitSellerProject,
  submitQuote,
} from '../helpers/project-helpers'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../helpers/test-users'

const RUN_ID = Date.now()

/**
 * Flow 3: Seller Creates Project + Vendor Bidding + Lunas
 *
 * Serial mode — each test depends on the previous. Users are registered
 * in T1 and reused across the flow.
 */
test.describe('Flow 3: Seller Creates Project + Vendor Bidding + Lunas', () => {
  test.describe.configure({ mode: 'serial' })

  const sellerEmail = `f3_seller_${RUN_ID}@test.com`
  const vendorEmail = `f3_vendor_${RUN_ID}@test.com`
  const projectName = `E2E Bidding Project ${RUN_ID}`

  // T1: Setup — register seller + vendor + admin approves them, then seller submits project
  test('T1: Seller registers, gets approved, submits project', async ({ page }) => {
    // Register seller
    await registerUser(page, {
      email: sellerEmail,
      password: 'Seller123!@#',
      firstName: 'Flow3',
      lastName: 'Seller',
      companyName: 'Flow3 Seller Corp',
      role: 'SELLER',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Admin approves seller
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, sellerEmail, 'seller')

    // Register vendor
    await registerUser(page, {
      email: vendorEmail,
      password: 'Vendor123!@#',
      firstName: 'Flow3',
      lastName: 'Vendor',
      companyName: 'Flow3 Vendor Solutions',
      role: 'VENDOR',
    })
    await expect(page).toHaveURL(/pending-approval/i, { timeout: 12000 })

    // Admin approves vendor
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })
    await approveUser(page, vendorEmail, 'vendor')

    // Login as seller and submit project
    await loginUser(page, sellerEmail, 'Seller123!@#', 'seller')
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 })

    await page.goto('/projects/submit')
    await page.waitForLoadState('networkidle')

    // Step 1: Project basics
    await fillSellerStep1(page, {
      projectName,
      clientName: 'Client Corp',
      category: 'Web Development',
      description: 'Build a modern e-commerce platform with React and Node.js',
    })

    const nextBtn = page.locator('button').filter({ hasText: /next/i }).first()
    await nextBtn.click()
    await page.waitForTimeout(500)

    // Step 2: Requirements
    await fillSellerStep2(page, {
      requirements: 'User authentication, product catalog, shopping cart, payment integration',
    })

    const nextBtn2 = page.locator('button').filter({ hasText: /next/i }).first()
    await nextBtn2.click()
    await page.waitForTimeout(500)

    // Step 3: Timeline & Budget
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    const endDate = new Date(futureDate)
    endDate.setDate(endDate.getDate() + 90)

    await fillSellerStep3(page, {
      startDate: futureDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      budgetRange: 'Rp 15.000.000 - Rp 50.000.000',
      priority: 'high',
    })

    const nextBtn3 = page.locator('button').filter({ hasText: /next/i }).first()
    await nextBtn3.click()
    await page.waitForTimeout(500)

    // Step 4: Review
    const nextBtn4 = page.locator('button').filter({ hasText: /next/i }).first()
    if (await nextBtn4.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn4.click()
      await page.waitForTimeout(500)
    }

    // Step 5: Submit
    await submitSellerProject(page)
    await page.waitForTimeout(3000)

    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/projects/i)

    // Verify project appears in list
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=' + projectName).first()).toBeVisible({ timeout: 10000 })
  })

  // T2: Admin reviews -> accepts project
  test('T2: Admin accepts submitted project', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await reviewProject(page, projectName, 'accept')

    await page.goto('/admin/projects')
    await page.waitForLoadState('networkidle')

    const projectRow = page.locator('tr, [class*="row"], [class*="card"]').filter({ hasText: projectName })
    await expect(projectRow).toBeVisible({ timeout: 10000 })

    const acceptedText = projectRow.locator('text=/accepted/i')
    await expect(acceptedText.first()).toBeVisible({ timeout: 5000 })
  })

  // T3: Vendor sees project and submits quote
  test('T3: Vendor submits quote on accepted project', async ({ page }) => {
    await loginUser(page, vendorEmail, 'Vendor123!@#', 'vendor')
    await expect(page).toHaveURL(/\/vendor/i, { timeout: 15000 })

    await page.goto('/vendor/projects')
    await page.waitForLoadState('networkidle')

    const projectCard = page.locator('[class*="card"], [class*="project"]').filter({ hasText: projectName })
    if (await projectCard.isVisible({ timeout: 10000 }).catch(() => false)) {
      await projectCard.first().click()
    } else {
      const projectLink = page.locator('a').filter({ hasText: projectName }).first()
      await projectLink.click()
    }
    await page.waitForLoadState('networkidle')

    await submitQuote(page, {
      amount: '25000000',
      duration: '60',
      proposal: 'We have extensive experience building e-commerce platforms. Our team will deliver within 60 days with full testing and deployment support.',
    })

    await page.waitForTimeout(2000)
    const body = await page.content()
    expect(body.toLowerCase()).toMatch(/quote|proposal|submitted/i)
  })

  // T4: Admin accepts vendor quote
  test('T4: Admin accepts vendor quote', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await acceptQuote(page, projectName)
  })

  // T5: Admin starts project
  test('T5: Admin starts the project', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await startProject(page, projectName)
  })

  // T6: Admin marks project complete
  test('T6: Admin marks project as complete', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await markProjectComplete(page, projectName)
  })

  // T7: Admin marks project as lunas/paid
  test('T7: Admin marks project as paid (lunas)', async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, 'admin')
    await expect(page).toHaveURL(/\/admin/i, { timeout: 15000 })

    await markProjectLunas(page, projectName)

    await page.goto('/admin/projects')
    await page.waitForLoadState('networkidle')

    const projectRow = page.locator('tr, [class*="row"], [class*="card"]').filter({ hasText: projectName })
    await expect(projectRow).toBeVisible({ timeout: 10000 })

    const paidText = projectRow.locator('text=/paid|lunas|completed/i')
    await expect(paidText.first()).toBeVisible({ timeout: 5000 })
  })
})
