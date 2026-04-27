import React from 'react'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { projects } from '@/db/schema'

export const getCachedCommandBarProjects = React.cache(async (filters?: { sellerId?: string }) => {
  let query = db
    .select({
      id: projects.id,
      name: projects.name,
      projectId: projects.projectId,
      clientName: projects.clientName,
    })
    .from(projects)
    
  if (filters?.sellerId) {
    query = query.where(require('drizzle-orm').eq(projects.sellerId, filters.sellerId)) as any
  }
  
  return query.orderBy(asc(projects.projectId))
})
