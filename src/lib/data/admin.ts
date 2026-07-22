import React from 'react'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { projects, sellers, users } from '@/db/schema'

export interface AdminStatDto {
  totalSellers: number
  activeProjects: number
  totalRevenue: number
  conversionRate: number
}

export interface AdminActivityDto {
  id: string
  action: string
  subject: string
  time: string
  type: 'seller' | 'project'
}

export interface SellerDirectoryDto {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: string
  dealsClosed: number
  revenue: number
  joinedAt: string
  specialty: string
}

export const getCachedAdminDashboard = React.cache(async () => {
  const [sellerRows, projectRows] = await Promise.all([
    db.query.sellers.findMany({
      orderBy: [desc(sellers.createdAt)],
      with: { user: true },
    }),
    db.query.projects.findMany({
      orderBy: [desc(projects.createdAt)],
      with: { seller: { with: { user: true } } },
    }),
  ])

  const totalRevenue = sellerRows.reduce((sum, seller) => sum + Number(seller.revenue), 0)

  const acceptedProjects = projectRows.filter((project) => project.status === 'ACCEPTED').length
  const conversionRate =
    projectRows.length > 0 ? Math.round((acceptedProjects / projectRows.length) * 100) : 0

  const activities: AdminActivityDto[] = [
    ...sellerRows.slice(0, 3).map((seller) => ({
      id: `seller-${seller.id}`,
      action: 'Seller registered',
      subject: seller.companyName,
      time: seller.createdAt.toISOString(),
      type: 'seller' as const,
    })),
    ...projectRows.slice(0, 4).map((project) => ({
      id: `project-${project.id}`,
      action: 'Project submitted',
      subject: project.name,
      time: project.createdAt.toISOString(),
      type: 'project' as const,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6)

  return {
    stats: {
      totalSellers: sellerRows.length,
      activeProjects: projectRows.filter((project) =>
        ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'IN_PROGRESS', 'NEED_CLARIFICATION'].includes(
          project.status,
        ),
      ).length,
      totalRevenue,
      conversionRate,
    } satisfies AdminStatDto,
    activities,
    pendingActions: [
      {
        id: 'pending-sellers',
        title: 'Review makelar applications',
        count: sellerRows.filter((seller) => seller.status === 'PENDING').length,
        priority: 'high',
      },
      {
        id: 'pending-projects',
        title: 'Review submitted projects',
        count: projectRows.filter((project) => project.status === 'SUBMITTED').length,
        priority: 'medium',
      },
      {
        id: 'clarifications',
        title: 'Clarification requests',
        count: projectRows.filter((project) => project.status === 'NEED_CLARIFICATION').length,
        priority: 'low',
      },
    ],
  }
})

export const getCachedAdminSellers = React.cache(async () => {
  const rows = await db
    .select({
      id: sellers.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      location: sellers.location,
      status: sellers.status,
      dealsClosed: sellers.dealsClosed,
      revenue: sellers.revenue,
      joinedAt: sellers.createdAt,
      specialty: sellers.industry,
    })
    .from(sellers)
    .innerJoin(users, eq(sellers.userId, users.id))
    .orderBy(desc(sellers.createdAt))

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? '',
    email: row.email,
    phone: row.phone ?? '',
    location: row.location ?? '',
    status: row.status.toLowerCase(),
    dealsClosed: row.dealsClosed,
    revenue: Number(row.revenue),
    joinedAt: row.joinedAt.toISOString(),
    specialty: row.specialty ?? 'Generalist',
  })) satisfies SellerDirectoryDto[]
})
