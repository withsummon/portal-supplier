'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { articles } from '@/db/schema'
import { requireRole } from '@/lib/auth/session'
import { saveLocalUpload } from '@/lib/uploads'

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return slug || `article-${Date.now().toString(36)}`
}

async function saveCoverImage(file?: File | null) {
  if (!file) return null

  return saveLocalUpload({
    file,
    folder: 'articles',
    allowedMimePrefix: 'image/',
  })
}

export async function createArticle(input: {
  title: string
  excerpt: string
  content: string
  published: boolean
  coverImage?: File | null
}) {
  await requireRole('ADMIN')
  if (!input.title.trim()) throw new Error('Title is required.')
  if (!input.content.trim()) throw new Error('Article content is required.')

  const coverImage = await saveCoverImage(input.coverImage)
  const status = input.published ? 'PUBLISHED' : 'DRAFT'
  const [article] = await db
    .insert(articles)
    .values({
      title: input.title.trim(),
      slug: slugify(input.title),
      excerpt: input.excerpt.trim() || null,
      content: input.content.trim(),
      coverImage,
      status,
      publishedAt: input.published ? new Date() : null,
    })
    .returning()

  revalidatePath('/admin/articles')
  revalidatePath('/research')
  return article
}

export async function updateArticle(input: {
  id: string
  title: string
  excerpt: string
  content: string
  published: boolean
  existingCoverImage: string | null
  coverImage?: File | null
}) {
  await requireRole('ADMIN')
  if (!input.title.trim()) throw new Error('Title is required.')
  if (!input.content.trim()) throw new Error('Article content is required.')

  const uploadedCoverImage = await saveCoverImage(input.coverImage)
  const status = input.published ? 'PUBLISHED' : 'DRAFT'
  const [article] = await db
    .update(articles)
    .set({
      title: input.title.trim(),
      slug: slugify(input.title),
      excerpt: input.excerpt.trim() || null,
      content: input.content.trim(),
      coverImage: uploadedCoverImage ?? input.existingCoverImage,
      status,
      publishedAt: input.published ? new Date() : null,
    })
    .where(eq(articles.id, input.id))
    .returning()

  revalidatePath('/admin/articles')
  revalidatePath('/research')
  revalidatePath(`/research/${article?.slug ?? ''}`)
  return article
}

export async function deleteArticle(id: string) {
  await requireRole('ADMIN')
  await db.delete(articles).where(eq(articles.id, id))
  revalidatePath('/admin/articles')
  revalidatePath('/research')
}
