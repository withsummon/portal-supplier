import React from 'react'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { projects } from '@/db/schema'

export const getCachedCommandBarProjects = React.cache(async () => {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      projectId: projects.projectId,
      clientName: projects.clientName,
    })
    .from(projects)
    .orderBy(asc(projects.projectId))
})
