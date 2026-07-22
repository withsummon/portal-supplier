import React from 'react'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { products } from '@/db/schema'
import { serializeProduct } from '@/lib/serializers'

export const getCachedAdminProducts = React.cache(async () => {
  const rows = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  })

  return rows.map(serializeProduct)
})

export const getCachedFactoryProducts = React.cache(async () => {
  const rows = await db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: [desc(products.createdAt)],
  })

  return rows.map(serializeProduct)
})

export const getCachedFactoryProductBySlug = React.cache(async (slug: string) => {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })

  if (!row || !row.isActive) {
    return null
  }

  return serializeProduct(row)
})

export const getCachedAdminProductBySlug = React.cache(async (slug: string) => {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })

  return row ? serializeProduct(row) : null
})
