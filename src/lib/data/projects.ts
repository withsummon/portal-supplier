import React from 'react'
import { db } from '@/db'
import { comments, projects, quotes, sellers, vendors } from '@/db/schema'
import { desc, eq, gte } from 'drizzle-orm'

// ============================================================
// PROJECTS
// ============================================================

export const getCachedAllProjects = React.cache(async (sellerId?: string) => {
  return db.query.projects.findMany({
    where: sellerId ? eq(projects.sellerId, sellerId) : undefined,
    with: { seller: true },
    orderBy: [desc(projects.createdAt)],
  })
})

export const getCachedProjectsById = React.cache(async (id: string) => {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      seller: { with: { user: true } },
      files: true,
      statusHistory: true,
      comments: {
        with: {
          author: true,
        },
        orderBy: [desc(comments.createdAt)],
      },
      quotes: { with: { vendor: { with: { user: true } } } },
    },
  })
})

export const getCachedProjectsBySeller = React.cache(async (sellerId: string) => {
  return db.query.projects.findMany({
    where: eq(projects.sellerId, sellerId),
    orderBy: [desc(projects.createdAt)],
  })
})

// ============================================================
// SELLER
// ============================================================

export const getCachedSeller = React.cache(async (userId?: string) => {
  if (userId) {
    return db.query.sellers.findFirst({
      where: eq(sellers.userId, userId),
      with: { user: true },
    })
  }
  return db.query.sellers.findFirst({ with: { user: true } })
})

// ============================================================
// VENDOR
// ============================================================

export const getCachedVendor = React.cache(async (userId?: string) => {
  if (userId) {
    return db.query.vendors.findFirst({
      where: eq(vendors.userId, userId),
      with: { user: true },
    })
  }
  return db.query.vendors.findFirst({ with: { user: true } })
})

export const getCachedVendorQuotes = React.cache(async (vendorId: string) => {
  return db.query.quotes.findMany({
    where: eq(quotes.vendorId, vendorId),
    with: { project: true },
    orderBy: [desc(quotes.createdAt)],
  })
})

// ============================================================
// QUOTES
// ============================================================

export const getCachedAllQuotes = React.cache(async () => {
  return db.query.quotes.findMany({
    with: { project: true, vendor: { with: { user: true } } },
    orderBy: [desc(quotes.createdAt)],
  })
})

export const getCachedProjectQuotes = React.cache(async (projectId: string) => {
  return db.query.quotes.findMany({
    where: eq(quotes.projectId, projectId),
    with: { vendor: { with: { user: true } } },
    orderBy: [desc(quotes.createdAt)],
  })
})

// ============================================================
// INSIGHTS
// ============================================================

export const getCachedMonthlyData = React.cache(async (sellerId?: string) => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const conditions = [gte(projects.createdAt, sixMonthsAgo)]
  if (sellerId) {
    conditions.push(eq(projects.sellerId, sellerId))
  }

  const projectList = await db
    .select({
      createdAt: projects.createdAt,
      status: projects.status,
      budgetMin: projects.budgetMin,
      budgetMax: projects.budgetMax,
    })
    .from(projects)
    .where(conditions.length > 1 ? require('drizzle-orm').and(...conditions) : conditions[0])

  const monthlyMap: Record<string, { submissions: number; revenue: number }> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short' })
    monthlyMap[key] = { submissions: 0, revenue: 0 }
  }

  for (const p of projectList) {
    const key = p.createdAt.toLocaleString('en-US', { month: 'short' })
    const entry = monthlyMap[key]
    if (entry) {
      entry.submissions++
      if (p.status === 'ACCEPTED' || p.status === 'COMPLETED') {
        entry.revenue += Number(p.budgetMax ?? p.budgetMin ?? 0)
      }
    }
  }

  return Object.entries(monthlyMap).map(([month, data]) => ({ month, ...data }))
})

export const getCachedCategoryData = React.cache(async (sellerId?: string) => {
  const query = db
    .select({
      category: projects.category,
      budgetMin: projects.budgetMin,
      budgetMax: projects.budgetMax,
    })
    .from(projects)

  if (sellerId) {
    query.where(eq(projects.sellerId, sellerId))
  }

  const projectList = await query

  const categoryMap: Record<string, { count: number; revenue: number }> = {}
  for (const p of projectList) {
    const entry = categoryMap[p.category] ?? { count: 0, revenue: 0 }
    entry.count++
    entry.revenue += Number(p.budgetMax ?? p.budgetMin ?? 0)
    categoryMap[p.category] = entry
  }

  const total = Object.values(categoryMap).reduce((sum, c) => sum + c.revenue, 0)
  return Object.entries(categoryMap).map(([category, data]) => ({
    category,
    ...data,
    percent: total > 0 ? Math.round((data.revenue / total) * 1000) / 10 : 0,
  }))
})

export const getCachedPipelineData = React.cache(async (sellerId?: string) => {
  const query = db
    .select({
      status: projects.status,
      budgetMin: projects.budgetMin,
      budgetMax: projects.budgetMax,
    })
    .from(projects)

  if (sellerId) {
    query.where(eq(projects.sellerId, sellerId))
  }

  const projectList = await query

  const revenueMap: Record<string, number> = {}
  for (const p of projectList) {
    const val = Number(p.budgetMax ?? p.budgetMin ?? 0)
    if (p.status === 'ACCEPTED' || p.status === 'IN_PROGRESS') {
      revenueMap[p.status] = (revenueMap[p.status] ?? 0) + val
    }
  }

  return {
    accepted: {
      label: 'Accepted',
      value: revenueMap['ACCEPTED'] ?? 0,
      color: 'var(--color-success)',
    },
    inProgress: {
      label: 'In Progress',
      value: revenueMap['IN_PROGRESS'] ?? 0,
      color: 'var(--blue-500)',
    },
    total: (revenueMap['ACCEPTED'] ?? 0) + (revenueMap['IN_PROGRESS'] ?? 0),
  }
})
