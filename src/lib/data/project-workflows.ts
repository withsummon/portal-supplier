import React from 'react'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { comments, notes, projects, quotes, vendors } from '@/db/schema'
import { dbToMockPriority, dbToMockQuoteStatus, dbToMockStatus } from '@/lib/utils/data'

export interface ProjectCommentDto {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  message: string
  createdAt: string
}

export interface ProjectReviewNoteDto {
  id: string
  text: string
  by: string
  at: string
  type: 'clarification' | 'status_change' | 'general'
}

export interface ProjectQuoteDto {
  id: string
  vendorId: string
  vendorName: string
  amount: number
  currency: string
  duration: number
  proposal: string
  status: string
  submittedAt: string
}

export interface ProjectFileDto {
  id: string
  name: string
  size: string
  type: string
  url: string | null
  uploadedAt: string
}

export interface AdminProjectDto {
  id: string
  projectId: string
  name: string
  supplier: string
  supplierEmail: string
  category: string
  description: string
  requirements: string
  deliverables: string[]
  techStack: string[]
  startDate: string
  endDate: string
  budget: string
  budgetCurrency: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status:
    | 'submitted'
    | 'under_review'
    | 'accepted'
    | 'rejected'
    | 'need_clarification'
    | 'in_progress'
    | 'completed'
    | 'paid'
    | 'cancelled'
  submittedAt: string
  files: ProjectFileDto[]
  notes: ProjectReviewNoteDto[]
  comments: ProjectCommentDto[]
  quotes: ProjectQuoteDto[]
}

export interface VendorProjectDetailDto {
  id: string
  projectId: string
  name: string
  description: string
  requirements: string | null
  category: string
  budgetRange: string | null
  startDate: string
  endDate: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status:
    | 'submitted'
    | 'under_review'
    | 'accepted'
    | 'rejected'
    | 'need_clarification'
    | 'in_progress'
    | 'completed'
    | 'paid'
    | 'cancelled'
  createdAt: string
  updatedAt: string
  deliverables: string[]
  techStack: string[]
  files: ProjectFileDto[]
  seller: {
    companyName: string
    user: {
      name: string | null
      email: string
    }
  }
  comments: ProjectCommentDto[]
  existingQuote: ProjectQuoteDto | null
}

interface AdminProjectNoteRecord {
  id: string
  text: string
  createdBy: string
  createdAt: Date
  type: string
}

interface AdminProjectRecord {
  id: string
  projectId: string
  name: string
  category: string
  description: string
  requirements: string | null
  deliverables: string[] | null
  techStack: string[] | null
  startDate: Date | null
  endDate: Date | null
  budgetRange: string | null
  budgetCurrency: string
  priority: string
  status: string
  createdAt: Date
  seller: {
    userId: string
    companyName: string
    user?: {
      name: string | null
      email: string
    } | null
  } | null
  files: Array<{
    id: string
    name: string
    size: string
    type: string
    url: string | null
    uploadedAt: Date
  }>
  notes: AdminProjectNoteRecord[]
  comments: Array<{
    id: string
    authorId: string
    message: string
    createdAt: Date
    author?: { name: string | null; email: string; role: string } | null
  }>
  quotes: Array<{
    id: string
    vendorId: string
    amount: string | number
    currency: string
    duration: number | null
    proposal: string | null
    status: string
    createdAt: Date
    vendor?: {
      companyName: string
      user?: { name: string | null; email: string } | null
    } | null
  }>
}

function serializeComment(comment: {
  id: string
  authorId: string
  message: string
  createdAt: Date
  author?: { name: string | null; email: string; role: string } | null
}): ProjectCommentDto {
  return {
    id: comment.id,
    authorId: comment.authorId,
    authorName: comment.author?.name ?? comment.author?.email ?? 'Unknown',
    authorRole: (comment.author?.role ?? 'USER').toLowerCase(),
    message: comment.message,
    createdAt: comment.createdAt.toISOString(),
  }
}

function serializeFile(file: {
  id: string
  name: string
  size: string
  type: string
  url: string | null
  uploadedAt: Date
}): ProjectFileDto {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.url,
    uploadedAt: file.uploadedAt.toISOString(),
  }
}

function serializeQuote(quote: {
  id: string
  vendorId: string
  amount: string | number
  currency: string
  duration: number | null
  proposal: string | null
  status: string
  createdAt: Date
  vendor?: { companyName: string; user?: { name: string | null; email: string } | null } | null
}): ProjectQuoteDto {
  return {
    id: quote.id,
    vendorId: quote.vendorId,
    vendorName:
      quote.vendor?.user?.name ??
      quote.vendor?.companyName ??
      quote.vendor?.user?.email ??
      'Vendor',
    amount: Number(quote.amount),
    currency: quote.currency,
    duration: quote.duration ?? 0,
    proposal: quote.proposal ?? '',
    status: dbToMockQuoteStatus[quote.status] ?? quote.status.toLowerCase(),
    submittedAt: quote.createdAt.toISOString(),
  }
}

function serializeAdminProject(project: AdminProjectRecord): AdminProjectDto {
  const seller = project.seller
  return {
    id: project.id,
    projectId: project.projectId,
    name: project.name,
    supplier: seller ? (seller.user?.name ?? seller.companyName) : 'Admin Created',
    supplierEmail: seller ? (seller.user?.email ?? '') : '',
    category: project.category,
    description: project.description,
    requirements: project.requirements ?? '',
    deliverables: project.deliverables ?? [],
    techStack: project.techStack ?? [],
    startDate: project.startDate?.toISOString() ?? '',
    endDate: project.endDate?.toISOString() ?? '',
    budget: project.budgetRange ?? '',
    budgetCurrency: project.budgetCurrency,
    priority: (dbToMockPriority[project.priority] ??
      project.priority.toLowerCase()) as AdminProjectDto['priority'],
    status: (dbToMockStatus[project.status] ??
      project.status.toLowerCase()) as AdminProjectDto['status'],
    submittedAt: project.createdAt.toISOString(),
    files: project.files.map(serializeFile),
    notes: project.notes.map((note) => ({
      id: note.id,
      text: note.text,
      by:
        seller && note.createdBy === seller.userId
          ? (seller.user?.name ?? seller.companyName)
          : 'Admin',
      at: note.createdAt.toISOString(),
      type:
        note.type === 'CLARIFICATION'
          ? 'clarification'
          : note.type === 'STATUS_CHANGE'
            ? 'status_change'
            : 'general',
    })),
    comments: project.comments.map(serializeComment),
    quotes: project.quotes.map(serializeQuote),
  }
}

export const getCachedAdminProjects = React.cache(async () => {
  const projectRows = await db.query.projects.findMany({
    with: {
      seller: {
        with: {
          user: true,
        },
      },
      files: true,
      notes: {
        orderBy: [desc(notes.createdAt)],
      },
      comments: {
        with: {
          author: true,
        },
        orderBy: [desc(comments.createdAt)],
      },
      quotes: {
        with: {
          vendor: {
            with: {
              user: true,
            },
          },
        },
        orderBy: [desc(quotes.createdAt)],
      },
    },
    orderBy: [desc(projects.createdAt)],
  })

  return projectRows.map((project) =>
    serializeAdminProject(project as Parameters<typeof serializeAdminProject>[0]),
  )
})

export const getCachedVendorProjectDetailForUser = React.cache(
  async (projectId: string, vendorUserId: string) => {
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.userId, vendorUserId),
    })

    if (!vendor) {
      return null
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        files: true,
        seller: {
          with: {
            user: true,
          },
        },
        comments: {
          with: {
            author: true,
          },
          orderBy: [desc(comments.createdAt)],
        },
        quotes: {
          where: eq(quotes.vendorId, vendor.id),
          with: {
            vendor: {
              with: {
                user: true,
              },
            },
          },
          orderBy: [desc(quotes.createdAt)],
        },
      },
    })

    if (!project?.seller?.user) {
      return null
    }

    return {
      id: project.id,
      projectId: project.projectId,
      name: project.name,
      description: project.description,
      requirements: project.requirements,
      category: project.category,
      budgetRange: project.budgetRange,
      startDate: project.startDate?.toISOString() ?? '',
      endDate: project.endDate?.toISOString() ?? '',
      priority: (dbToMockPriority[project.priority] ??
        project.priority.toLowerCase()) as VendorProjectDetailDto['priority'],
      status: (dbToMockStatus[project.status] ??
        project.status.toLowerCase()) as VendorProjectDetailDto['status'],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      deliverables: project.deliverables ?? [],
      techStack: project.techStack ?? [],
      files: project.files.map(serializeFile),
      seller: {
        companyName: project.seller.companyName,
        user: {
          name: project.seller.user.name,
          email: project.seller.user.email,
        },
      },
      comments: project.comments.map(serializeComment),
      existingQuote: project.quotes[0] ? serializeQuote(project.quotes[0]) : null,
    } satisfies VendorProjectDetailDto
  },
)

export const getCachedProjectCategories = React.cache(async () => {
  const rows = await db
    .select({ category: projects.category })
    .from(projects)
    .groupBy(projects.category)
    .orderBy(projects.category)

  return rows.map((row) => row.category)
})
