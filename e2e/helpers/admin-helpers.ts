import { type Page } from '@playwright/test'

/**
 * Admin approves a user by navigating to the management page
 */
export async function approveUser(page: Page, userEmail: string, role: 'seller'): Promise<void> {
  await page.goto('/admin/sellers')
  await page.waitForLoadState('networkidle')

  // Find the user row by email text
  const row = page.locator('tr').filter({ hasText: userEmail })
  if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
    return
  }

  // Click the view/eye button to open modal
  const viewBtn = row.locator('button').first()
  if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewBtn.click()
    await page.waitForTimeout(500)
  }

  // In modal, click Approve
  const approveBtn = page
    .locator('button')
    .filter({ hasText: /approve/i })
    .first()
  if (await approveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await approveBtn.click()
    await page.waitForTimeout(1000)
  }
}

/**
 * Admin rejects a user
 */
export async function rejectUser(page: Page, userEmail: string, role: 'seller'): Promise<void> {
  await page.goto('/admin/sellers')
  await page.waitForLoadState('networkidle')

  const row = page.locator('tr').filter({ hasText: userEmail })
  if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
    return
  }

  // Click view button to open modal
  const viewBtn = row.locator('button').first()
  if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewBtn.click()
    await page.waitForTimeout(500)
  }

  // In modal, click Reject
  const rejectBtn = page
    .locator('button')
    .filter({ hasText: /reject/i })
    .first()
  if (await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await rejectBtn.click()
    await page.waitForTimeout(1000)
  }
}

/**
 * Navigate admin to a project and review it (accept/reject/clarify)
 */
export async function reviewProject(
  page: Page,
  projectName: string,
  action: 'accept' | 'reject' | 'clarify',
): Promise<void> {
  await page.goto('/admin/projects')
  await page.waitForLoadState('networkidle')

  // Find the project
  const projectRow = page
    .locator('tr, [class*="row"], [class*="card"]')
    .filter({ hasText: projectName })
  if (await projectRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await projectRow.click()
    await page.waitForLoadState('networkidle')
  }

  // Click the action button
  const actionBtn = page.locator(`button:has-text("${action}")`).first()
  if (await actionBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await actionBtn.click()
    await page.waitForTimeout(1000)
  }
}

/**
 * Admin starts a project (ACCEPTED -> IN_PROGRESS)
 */
export async function startProject(page: Page, projectName: string): Promise<void> {
  await page.goto('/admin/projects')
  await page.waitForLoadState('networkidle')

  const projectRow = page
    .locator('tr, [class*="row"], [class*="card"]')
    .filter({ hasText: projectName })
  if (await projectRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await projectRow.click()
    await page.waitForLoadState('networkidle')
  }

  const startBtn = page
    .locator('button:has-text("Start Project"), button:has-text("start")')
    .first()
  if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await startBtn.click()
    await page.waitForTimeout(1000)
  }
}

/**
 * Admin marks a project as complete (IN_PROGRESS -> COMPLETED)
 */
export async function markProjectComplete(page: Page, projectName: string): Promise<void> {
  await page.goto('/admin/projects')
  await page.waitForLoadState('networkidle')

  const projectRow = page
    .locator('tr, [class*="row"], [class*="card"]')
    .filter({ hasText: projectName })
  if (await projectRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await projectRow.click()
    await page.waitForLoadState('networkidle')
  }

  const completeBtn = page
    .locator('button:has-text("Mark Complete"), button:has-text("complete")')
    .first()
  if (await completeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await completeBtn.click()
    await page.waitForTimeout(1000)
  }
}

/**
 * Admin marks a project as lunas/paid (COMPLETED -> PAID)
 */
export async function markProjectLunas(page: Page, projectName: string): Promise<void> {
  await page.goto('/admin/projects')
  await page.waitForLoadState('networkidle')

  const projectRow = page
    .locator('tr, [class*="row"], [class*="card"]')
    .filter({ hasText: projectName })
  if (await projectRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await projectRow.click()
    await page.waitForLoadState('networkidle')
  }

  const lunasBtn = page
    .locator(
      'button:has-text("Mark Lunas"), button:has-text("Mark Paid"), button:has-text("Lunas")',
    )
    .first()
  if (await lunasBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await lunasBtn.click()
    await page.waitForTimeout(1000)
  }
}
