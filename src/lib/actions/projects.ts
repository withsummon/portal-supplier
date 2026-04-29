'use server'

import { db } from '@/db'
import {
  categories,
  comments,
  notifications,
  notes,
  projectFiles,
  projects,
  quotes,
  statusHistory,
  users,
  vendors,
} from '@/db/schema'
import { eq, desc, and, like, or, count, sql, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getCurrentUserRecord, requireRole } from '@/lib/auth/session'
import { saveLocalUpload } from '@/lib/uploads'
import { dbToMockQuoteStatus, dbToMockStatus, mockToDbPriority } from '@/lib/utils/data'

// ============================================================
// PROJECT ACTIONS
// ============================================================

export async function getProjects(filters?: {
  status?: string
  search?: string
  sellerId?: string
}) {
  const conditions = []

  if (filters?.status && filters.status !== 'all') {
    conditions.push(eq(projects.status, filters.status as typeof projects.$inferSelect.status))
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(projects.name, `%${filters.search}%`),
        like(projects.description, `%${filters.search}%`),
      ),
    )
  }

  if (filters?.sellerId) {
    conditions.push(eq(projects.sellerId, filters.sellerId))
  }

  const result = await db.query.projects.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      seller: true,
      files: true,
      statusHistory: {
        orderBy: [desc(statusHistory.createdAt)],
      },
    },
    orderBy: [desc(projects.createdAt)],
  })

  return result
}

export async function getProjectById(id: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      seller: {
        with: { user: true },
      },
      files: true,
      statusHistory: {
        orderBy: [desc(statusHistory.createdAt)],
      },
      notes: {
        orderBy: [desc(notes.createdAt)],
      },
      quotes: {
        with: { vendor: { with: { user: true } } },
      },
      comments: {
        with: { author: true },
        orderBy: [desc(comments.createdAt)],
      },
    },
  })

  return project
}

export async function getProjectByProjectId(projectId: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.projectId, projectId),
    with: {
      seller: {
        with: { user: true },
      },
      files: true,
      statusHistory: {
        orderBy: [desc(statusHistory.createdAt)],
      },
      quotes: {
        with: { vendor: { with: { user: true } } },
      },
    },
  })

  return project
}

export async function createProject(data: {
  name: string
  description: string
  requirements?: string
  category: string
  clientName?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  budgetMin?: number
  budgetMax?: number
  budgetCurrency?: string
  budgetRange?: string
  startDate?: Date
  endDate?: Date
  deliverables?: string[]
  techStack?: string[]
  source?: string
  sellerId: string
}) {
  const countResult = await db.select({ count: count() }).from(projects)
  const nextNumber = (countResult[0]?.count ?? 0) + 1
  const projectId = `PRJ-${String(nextNumber).padStart(3, '0')}`

  const [project] = await db
    .insert(projects)
    .values({
      ...data,
      budgetMin: data.budgetMin?.toString(),
      budgetMax: data.budgetMax?.toString(),
      projectId,
      status: 'SUBMITTED',
      deliverables: data.deliverables ?? [],
      techStack: data.techStack ?? [],
      clientName: data.clientName?.trim() || null,
      source: data.source ?? 'SUMMON',
    })
    .returning()

  if (!project) {
    throw new Error('Failed to create project')
  }

  await db.insert(statusHistory).values({
    projectId: project.id,
    status: 'SUBMITTED',
    note: 'Project submitted successfully.',
    changedBy: data.sellerId,
  })

  return project
}

export async function updateProjectStatus(
  projectId: string,
  status: typeof projects.$inferSelect.status,
  note?: string,
  changedBy?: string,
) {
  const [updated] = await db
    .update(projects)
    .set({ status })
    .where(eq(projects.id, projectId))
    .returning()

  await db.insert(statusHistory).values({
    projectId,
    status,
    note,
    changedBy: changedBy ?? 'system',
  })

  return updated
}

export async function getProjectStats(sellerId?: string) {
  const conditions = sellerId ? eq(projects.sellerId, sellerId) : undefined

  const all = await db.query.projects.findMany({
    where: conditions,
    columns: { status: true },
  })

  const stats = {
    total: all.length,
    submitted: all.filter((p) => p.status === 'SUBMITTED').length,
    underReview: all.filter((p) => p.status === 'UNDER_REVIEW').length,
    accepted: all.filter((p) => p.status === 'ACCEPTED').length,
    inProgress: all.filter((p) => p.status === 'IN_PROGRESS').length,
    completed: all.filter((p) => p.status === 'COMPLETED').length,
    rejected: all.filter((p) => p.status === 'REJECTED').length,
  }

  return stats
}

// ============================================================
// QUOTE ACTIONS
// ============================================================

export async function getQuotes(vendorId?: string, projectId?: string) {
  const conditions = []

  if (vendorId) {
    conditions.push(eq(quotes.vendorId, vendorId))
  }

  if (projectId) {
    conditions.push(eq(quotes.projectId, projectId))
  }

  return db.query.quotes.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      project: {
        with: { seller: { with: { user: true } } },
      },
      vendor: { with: { user: true } },
    },
    orderBy: [desc(quotes.createdAt)],
  })
}

export async function submitQuote(data: {
  projectId: string
  vendorId: string
  amount: number
  currency?: string
  duration?: number
  proposal?: string
}) {
  const [quote] = await db
    .insert(quotes)
    .values({
      ...data,
      amount: data.amount.toString(),
    })
    .returning()
  return quote
}

export async function updateQuoteStatus(
  quoteId: string,
  status: typeof quotes.$inferSelect.status,
) {
  const [updated] = await db
    .update(quotes)
    .set({ status })
    .where(eq(quotes.id, quoteId))
    .returning()

  return updated
}

// ============================================================
// CATEGORY ACTIONS
// ============================================================

export async function getCategories() {
  return db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  })
}

export async function getOrCreateCategory(name: string, type: 'PROJECT' | 'PRODUCT') {
  const existing = await db.query.categories.findFirst({
    where: and(eq(categories.name, name), eq(categories.type, type)),
  })

  if (existing) return existing

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const [created] = await db.insert(categories).values({ name, slug, type }).returning()

  return created
}

// ============================================================
// INSIGHTS / ANALYTICS
// ============================================================

export async function getMonthlySubmissions(sellerId?: string) {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const conditions = [sql`${projects.createdAt} >= ${sixMonthsAgo}`]
  if (sellerId) conditions.push(sql`${projects.sellerId} = ${sellerId}`)

  const projectList = await db.query.projects.findMany({
    where: and(...conditions),
    columns: {
      createdAt: true,
      status: true,
      budgetMin: true,
      budgetMax: true,
    },
  })

  // Group by month
  const monthlyMap: Record<string, { submissions: number; revenue: number }> = {}
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short' })
    monthlyMap[key] = { submissions: 0, revenue: 0 }
  }

  for (const p of projectList) {
    const key = p.createdAt.toLocaleString('en-US', { month: 'short' })
    if (monthlyMap[key]) {
      monthlyMap[key].submissions++
      if (p.status === 'ACCEPTED' || p.status === 'COMPLETED') {
        const revenue = p.budgetMax ?? p.budgetMin ?? 0
        monthlyMap[key].revenue += Number(revenue)
      }
    }
  }

  return Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    ...data,
  }))
}

export async function getCategoryBreakdown(sellerId?: string) {
  const conditions = sellerId ? eq(projects.sellerId, sellerId) : undefined

  const projectList = await db.query.projects.findMany({
    where: conditions,
    columns: { category: true, budgetMin: true, budgetMax: true },
  })

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
}

export async function getRevenuePipeline(sellerId?: string) {
  const conditions = sellerId ? eq(projects.sellerId, sellerId) : undefined

  const projectList = await db.query.projects.findMany({
    where: conditions,
    columns: {
      status: true,
      budgetMin: true,
      budgetMax: true,
    },
  })

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
}

function parseBudgetAmount(value: string) {
  const normalized = value.replace(/\s+/g, '').replace(',', '.')
  const numericValue = Number.parseFloat(normalized.replace(/[^\d.]/g, ''))

  if (Number.isNaN(numericValue)) {
    return undefined
  }

  if (/jt/i.test(normalized)) {
    return Math.round(numericValue * 1_000_000)
  }

  if (/m/i.test(normalized)) {
    return Math.round(numericValue * 1_000_000)
  }

  if (/k/i.test(normalized)) {
    return Math.round(numericValue * 1_000)
  }

  return Math.round(numericValue)
}

function parseBudgetRange(budgetRange?: string) {
  if (!budgetRange) {
    return { min: undefined, max: undefined }
  }

  const normalized = budgetRange.replace(/[+]/g, '')
  const parts = normalized
    .split(/[–-]/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return { min: undefined, max: undefined }
  }

  const min = parseBudgetAmount(parts[0] ?? '')
  const max = parseBudgetAmount(parts[1] ?? parts[0] ?? '')

  return {
    min,
    max: budgetRange.includes('+') ? undefined : max,
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function createNotificationsForAdmins(input: {
  type: typeof notifications.$inferInsert.type
  title: string
  content: string
  link: string
}) {
  const adminRows = await db.select({ id: users.id }).from(users).where(eq(users.role, 'ADMIN'))

  if (adminRows.length === 0) {
    return
  }

  await db.insert(notifications).values(
    adminRows.map((admin) => ({
      userId: admin.id,
      type: input.type,
      title: input.title,
      content: input.content,
      link: input.link,
    })),
  )
}

export async function submitProjectWithFiles(input: {
  name: string
  clientName: string
  category: string
  description: string
  requirements: string
  deliverables: string[]
  techStack: string[]
  startDate: string
  endDate: string
  budgetRange: string
  budgetCurrency: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  files: File[]
}) {
  const user = await requireRole('SELLER')

  if (!user.seller) {
    throw new Error('Seller profile not found.')
  }

  const name = input.name.trim()
  const description = input.description.trim()
  const category = input.category.trim()
  const clientName = input.clientName.trim()

  if (!name || !description || !category || !clientName) {
    throw new Error('Project basics are required.')
  }

  const { min, max } = parseBudgetRange(input.budgetRange)
  const payload: Parameters<typeof createProject>[0] = {
    name,
    clientName,
    category,
    description,
    requirements: input.requirements.trim(),
    priority: (mockToDbPriority[input.priority] ?? 'MEDIUM') as
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH'
      | 'CRITICAL',
    budgetCurrency: input.budgetCurrency,
    budgetRange: input.budgetRange.trim(),
    deliverables: input.deliverables.filter((item) => item.trim()),
    techStack: input.techStack.filter((item) => item.trim()),
    sellerId: user.seller.id,
  }

  if (min !== undefined) payload.budgetMin = min
  if (max !== undefined) payload.budgetMax = max
  if (input.startDate) payload.startDate = new Date(input.startDate)
  if (input.endDate) payload.endDate = new Date(input.endDate)

  const project = await createProject(payload)

  if (input.files.length > 0) {
    const uploadedFiles = await Promise.all(
      input.files.map(async (file) => ({
        projectId: project.id,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'application/octet-stream',
        url: await saveLocalUpload({
          file,
          folder: 'projects',
          allowedMimePrefix: '',
        }),
      })),
    )

    await db.insert(projectFiles).values(uploadedFiles)
  }

  await createNotificationsForAdmins({
    type: 'PROJECT_SUBMITTED',
    title: 'New project submitted',
    content: `${user.seller.companyName} submitted ${project.name}.`,
    link: `/admin/projects`,
  })

  revalidatePath('/projects')
  revalidatePath('/projects/submit')
  revalidatePath('/dashboard')
  revalidatePath('/admin/projects')
  revalidatePath('/vendor/projects')

  return {
    id: project.id,
    projectId: project.projectId,
  }
}

export async function createProjectAsAdmin(input: {
  name: string
  clientName?: string
  category: string
  description?: string
  requirements?: string
  vendorId?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  budgetRange?: string
  budgetCurrency?: string
  startDate?: string
  endDate?: string
}) {
  const user = await requireRole('ADMIN')

  if (input.vendorId) {
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, input.vendorId),
    })

    if (!vendor) {
      return { error: 'Vendor not found.' } as const
    }
  }

  const name = input.name.trim()
  if (!name) {
    return { error: 'Project name is required.' } as const
  }

  const countResult = await db.select({ count: count() }).from(projects)
  const nextNumber = (countResult[0]?.count ?? 0) + 1
  const projectId = `PRJ-${String(nextNumber).padStart(3, '0')}`

  const { min, max } = parseBudgetRange(input.budgetRange ?? '')

  const status = input.vendorId ? 'ACCEPTED' : 'SUBMITTED'

  const [project] = await db
    .insert(projects)
    .values({
      name,
      clientName: input.clientName?.trim() || null,
      category: input.category.trim(),
      description: input.description?.trim() || '',
      requirements: input.requirements?.trim() || null,
      budgetRange: input.budgetRange?.trim() || null,
      budgetCurrency: input.budgetCurrency ?? 'USD',
      budgetMin: min?.toString() ?? null,
      budgetMax: max?.toString() ?? null,
      priority: (mockToDbPriority[input.priority ?? 'medium'] ?? 'MEDIUM') as
        | 'LOW'
        | 'MEDIUM'
        | 'HIGH'
        | 'CRITICAL',
      status,
      source: 'ADMIN',
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      projectId,
    })
    .returning()

  if (!project) {
    return { error: 'Failed to create project.' } as const
  }

  await db.insert(statusHistory).values({
    projectId: project.id,
    status,
    note: input.vendorId
      ? 'Project created by admin and assigned to vendor.'
      : 'Project created by admin and opened for bidding.',
    changedBy: user.id,
  })

  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  revalidatePath('/vendor/projects')
  revalidatePath('/dashboard')

  return { success: true, id: project.id, projectId: project.projectId } as const
}

export async function reviewProjectSubmission(input: {
  projectId: string
  action: 'accept' | 'reject' | 'clarify'
  note?: string
}) {
  const user = await requireRole('ADMIN')
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, input.projectId),
    with: {
      seller: {
        with: {
          user: true,
        },
      },
    },
  })

  if (!project?.seller?.user) {
    throw new Error('Project not found.')
  }

  const status =
    input.action === 'accept'
      ? 'ACCEPTED'
      : input.action === 'reject'
        ? 'REJECTED'
        : 'NEED_CLARIFICATION'
  const note =
    input.note?.trim() ||
    (input.action === 'accept'
      ? 'Project accepted.'
      : input.action === 'reject'
        ? 'Project rejected.'
        : 'Clarification requested.')

  await db.transaction(async (tx) => {
    await tx.update(projects).set({ status }).where(eq(projects.id, input.projectId))
    await tx.insert(statusHistory).values({
      projectId: input.projectId,
      status,
      note,
      changedBy: user.id,
    })
    await tx.insert(notes).values({
      projectId: input.projectId,
      text: note,
      type: input.action === 'clarify' ? 'CLARIFICATION' : 'STATUS_CHANGE',
      createdBy: user.id,
    })
    if (project.seller?.user) {
      await tx.insert(notifications).values({
        userId: project.seller.user.id,
        type:
          input.action === 'accept'
            ? 'PROJECT_ACCEPTED'
            : input.action === 'reject'
              ? 'PROJECT_REJECTED'
              : 'PROJECT_CLARIFICATION',
        title:
          input.action === 'accept'
            ? 'Project accepted'
            : input.action === 'reject'
              ? 'Project rejected'
              : 'Clarification requested',
        content: `${project.name}: ${note}`,
        link: `/projects/${project.id}`,
      })
    }
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${project.id}`)
  revalidatePath('/projects')
  revalidatePath('/dashboard')
  revalidatePath('/notifications')
  revalidatePath('/admin/notifications')

  return {
    id: project.id,
    status: dbToMockStatus[status] ?? status.toLowerCase(),
    note: {
      id: `${project.id}:${Date.now()}`,
      text: note,
      by: 'Admin',
      at: new Date().toISOString(),
      type: input.action === 'clarify' ? 'clarification' : 'status_change',
    },
  }
}

export async function addProjectComment(input: { projectId: string; message: string }) {
  const user = await getCurrentUserRecord()

  if (!user) {
    throw new Error('Unauthorized.')
  }

  const message = input.message.trim()
  if (!message) {
    throw new Error('Message is required.')
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, input.projectId),
    with: {
      seller: {
        with: {
          user: true,
        },
      },
      quotes: true,
    },
  })

  if (!project?.seller?.user) {
    throw new Error('Project not found.')
  }

  const [comment] = await db
    .insert(comments)
    .values({
      projectId: input.projectId,
      authorId: user.id,
      message,
    })
    .returning()

  if (!comment) {
    throw new Error('Failed to add comment.')
  }

  if (user.role === 'ADMIN') {
    const recipientSet = new Set<string>([project.seller.user.id])
    if (project.quotes.length > 0) {
      const vendorRows = await db
        .select({ userId: vendors.userId })
        .from(vendors)
        .where(
          inArray(
            vendors.id,
            project.quotes.map((quote) => quote.vendorId),
          ),
        )

      for (const row of vendorRows) {
        recipientSet.add(row.userId)
      }
    }

    if (recipientSet.size > 0) {
      const sellerUserId = project.seller?.user?.id
      const notificationRows: Array<typeof notifications.$inferInsert> = Array.from(
        recipientSet,
      ).map((recipientId) => ({
        userId: recipientId,
        type: 'MESSAGE_RECEIVED',
        title: 'New project message',
        content: `${project.name}: ${message}`,
        link:
          recipientId === sellerUserId
            ? `/projects/${project.id}`
            : `/vendor/projects/${project.id}`,
      }))

      await db.insert(notifications).values(notificationRows)
    }
  } else {
    await createNotificationsForAdmins({
      type: 'MESSAGE_RECEIVED',
      title: 'New project message',
      content: `${project.name}: ${message}`,
      link: `/admin/projects`,
    })
  }

  revalidatePath(`/projects/${project.id}`)
  revalidatePath(`/vendor/projects/${project.id}`)
  revalidatePath('/admin/projects')

  return {
    id: comment.id,
    authorId: user.id,
    authorName: user.name ?? user.email,
    authorRole: user.role.toLowerCase(),
    message: comment.message,
    createdAt: comment.createdAt.toISOString(),
  }
}

export async function submitVendorProjectQuote(input: {
  projectId: string
  amount: number
  currency: string
  duration: number
  proposal: string
}) {
  const user = await requireRole('VENDOR')

  if (!user.vendor) {
    throw new Error('Vendor profile not found.')
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, input.projectId),
    with: {
      seller: {
        with: {
          user: true,
        },
      },
    },
  })

  if (!project?.seller?.user) {
    throw new Error('Project not found.')
  }

  const existingQuote = await db.query.quotes.findFirst({
    where: and(eq(quotes.projectId, input.projectId), eq(quotes.vendorId, user.vendor.id)),
    orderBy: [desc(quotes.createdAt)],
  })

  const quote = existingQuote
    ? (
        await db
          .update(quotes)
          .set({
            amount: input.amount.toString(),
            currency: input.currency.trim() || 'USD',
            duration: input.duration,
            proposal: input.proposal.trim(),
            status: 'PENDING',
          })
          .where(eq(quotes.id, existingQuote.id))
          .returning()
      )[0]
    : await submitQuote({
        projectId: input.projectId,
        vendorId: user.vendor.id,
        amount: input.amount,
        currency: input.currency.trim() || 'USD',
        duration: input.duration,
        proposal: input.proposal.trim(),
      })

  if (!quote) {
    throw new Error('Failed to submit quote.')
  }

  await db.insert(notifications).values([
    {
      userId: project.seller.user.id,
      type: 'QUOTE_RECEIVED',
      title: 'New vendor proposal received',
      content: `${project.name}: ${user.vendor.companyName} submitted a proposal.`,
      link: `/projects/${project.id}`,
    },
  ])

  await createNotificationsForAdmins({
    type: 'QUOTE_RECEIVED',
    title: 'New vendor proposal received',
    content: `${project.name}: ${user.vendor.companyName} submitted a proposal.`,
    link: `/admin/projects`,
  })

  revalidatePath(`/vendor/projects/${project.id}`)
  revalidatePath('/vendor/quotes')
  revalidatePath(`/projects/${project.id}`)
  revalidatePath('/admin/projects')

  return {
    id: quote.id,
    vendorId: user.vendor.id,
    vendorName: user.vendor.companyName,
    amount: Number(quote.amount),
    currency: quote.currency,
    duration: quote.duration ?? 0,
    proposal: quote.proposal ?? '',
    status: dbToMockQuoteStatus[quote.status] ?? quote.status.toLowerCase(),
    submittedAt: quote.createdAt.toISOString(),
  }
}
