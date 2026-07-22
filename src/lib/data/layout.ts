import React from 'react'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { products, projects } from '@/db/schema'

export const getCachedCommandBarProjects = React.cache(async (filters?: { sellerId?: string }) => {
  const fields = {
    id: projects.id,
    name: projects.name,
    projectId: projects.projectId,
    clientName: projects.clientName,
  }

  if (filters?.sellerId) {
    return db
      .select(fields)
      .from(projects)
      .where(eq(projects.sellerId, filters.sellerId))
      .orderBy(asc(projects.projectId))
  }

  return db.select(fields).from(projects).orderBy(asc(projects.projectId))
})

export const getCachedCommandBarProducts = React.cache(async () => {
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.name))
})
