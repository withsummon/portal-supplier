import React from 'react'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { articles } from '@/db/schema'

function serializeArticle(article: {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  status: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? '',
    content: article.content,
    coverImage: article.coverImage,
    status: article.status,
    published: article.status === 'PUBLISHED',
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }
}

export type ArticleData = ReturnType<typeof serializeArticle>

export const getCachedAdminArticles = React.cache(async () => {
  const rows = await db.query.articles.findMany({
    orderBy: [desc(articles.createdAt)],
  })

  return rows.map(serializeArticle)
})

export const getCachedPublishedArticles = React.cache(async () => {
  const rows = await db.query.articles.findMany({
    where: eq(articles.status, 'PUBLISHED'),
    orderBy: [desc(articles.publishedAt), desc(articles.createdAt)],
  })

  return rows.map(serializeArticle)
})

export const getCachedPublishedArticleBySlug = React.cache(async (slug: string) => {
  const row = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.status, 'PUBLISHED')),
  })

  return row ? serializeArticle(row) : null
})
