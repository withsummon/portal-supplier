import React from 'react'
import { desc } from 'drizzle-orm'
import { db } from '@/db'
import { comments, notes, projects } from '@/db/schema'
import { dbToUiPriority, dbToUiStatus } from '@/lib/utils/data'

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
    priority: (dbToUiPriority[project.priority] ??
      project.priority.toLowerCase()) as AdminProjectDto['priority'],
    status: (dbToUiStatus[project.status] ??
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
    },
    orderBy: [desc(projects.createdAt)],
  })

  return projectRows.map((project) =>
    serializeAdminProject(project as Parameters<typeof serializeAdminProject>[0]),
  )
})

export const getCachedProjectCategories = React.cache(async () => {
  const rows = await db
    .select({ category: projects.category })
    .from(projects)
    .groupBy(projects.category)
    .orderBy(projects.category)

  return rows.map((row) => row.category)
})
