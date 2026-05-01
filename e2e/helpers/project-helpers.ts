import { type Page } from '@playwright/test'

// ============================================================
// SELLER: 5-step project submission form
// ============================================================

export async function fillSellerStep1(page: Page, data: {
  projectName: string
  clientName: string
  category: string
  description: string
}) {
  await page.goto('/projects/submit')
  await page.waitForLoadState('networkidle')

  await page.waitForSelector('text=Project Basics', { timeout: 10000 })
  await page.waitForTimeout(300)

  await page.locator('input[placeholder="e.g. E-Commerce Platform Revamp"]').pressSequentially(data.projectName, { delay: 5 })
  await page.locator('input[placeholder="e.g. PT Maju Bersama"]').pressSequentially(data.clientName, { delay: 5 })
  await page.locator('select').first().selectOption({ index: 1 })
  await page.locator('textarea[placeholder="Provide a brief overview of the project, its goals, and the problem it solves..."]').pressSequentially(data.description, { delay: 5 })
}

export async function fillSellerStep2(page: Page, data: {
  requirements: string
  deliverables?: string[]
}) {
  await page.locator('textarea[placeholder="Describe the technical and functional requirements in detail."]').pressSequentially(data.requirements, { delay: 5 })
}

export async function fillSellerStep3(page: Page, data: {
  startDate: string
  endDate: string
  budgetRange?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
}) {
  await page.locator('input[type="date"]').first().fill(data.startDate)
  await page.locator('input[type="date"]').last().fill(data.endDate)

  if (data.budgetRange) {
    await page.locator('select').first().selectOption({ label: data.budgetRange })
  }

  if (data.priority) {
    await page.locator(`input[type="radio"][value="${data.priority}"]`).check()
  }
}

export async function submitSellerProject(page: Page) {
  const submitBtn = page.locator('button').filter({ hasText: /submit project/i }).first()
  await submitBtn.click()
  await page.waitForTimeout(3000)
}

// ============================================================
// VENDOR: Bid submission via drawer form
// ============================================================

export async function submitBidForm(page: Page, data: {
  amount: string
  duration: string
  proposal: string
}) {
  const submitBtn = page.locator('button').filter({ hasText: /submit proposal/i }).first()
  if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await submitBtn.click()
  }

  await page.waitForSelector('[role="dialog"]', { timeout: 3000 }).catch(() => {})

  await page.locator('[role="dialog"] input[type="number"]').first().fill(data.amount)
  await page.locator('[role="dialog"] input[type="number"]').nth(1).fill(data.duration)
  await page.locator('[role="dialog"] textarea').first().fill(data.proposal)
}

export async function submitQuote(page: Page, data: {
  amount: string
  duration: string
  proposal: string
}) {
  await submitBidForm(page, data)
  const submitBtn = page.locator('[role="dialog"] button').filter({ hasText: /submit bid/i }).first()
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click()
  }
  await page.waitForTimeout(3000)
}

// ============================================================
// PROJECT NAVIGATION & STATUS
// ============================================================

export async function waitForProjectStatus(
  page: Page,
  status: string,
  timeout = 10000,
) {
  await page.waitForSelector(
    `[class*="badge"]:has-text("${status}"), [class*="status"]:has-text("${status}")`,
    { timeout },
  )
}

export async function findProjectInList(page: Page, projectName: string): Promise<void> {
  const row = page.locator('tr, [class*="row"], [class*="card"]').filter({ hasText: projectName })
  if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
    await row.click()
    await page.waitForLoadState('networkidle')
  }
}
