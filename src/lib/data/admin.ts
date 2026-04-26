import React from 'react'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { projects, sellers, users, vendors } from '@/db/schema'

export interface AdminStatDto {
  totalSellers: number
  totalVendors: number
  activeProjects: number
  totalRevenue: number
  conversionRate: number
}

export interface AdminActivityDto {
  id: string
  action: string
  subject: string
  time: string
  type: 'seller' | 'vendor' | 'project'
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

export interface VendorDirectoryDto {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: string
  projectsCompleted: number
  activeProjects: number
  rating: number
  revenue: number
  joinedAt: string
  specialty: string
  tier: string
}

export const getCachedAdminDashboard = React.cache(async () => {
  const [sellerRows, vendorRows, projectRows] = await Promise.all([
    db.query.sellers.findMany({
      orderBy: [desc(sellers.createdAt)],
      with: { user: true },
    }),
    db.query.vendors.findMany({
      orderBy: [desc(vendors.createdAt)],
      with: { user: true },
    }),
    db.query.projects.findMany({
      orderBy: [desc(projects.createdAt)],
      with: { seller: { with: { user: true } } },
    }),
  ])

  const totalRevenue =
    sellerRows.reduce((sum, seller) => sum + Number(seller.revenue), 0) +
    vendorRows.reduce((sum, vendor) => sum + Number(vendor.revenue), 0)

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
    ...vendorRows.slice(0, 3).map((vendor) => ({
      id: `vendor-${vendor.id}`,
      action: 'Vendor registered',
      subject: vendor.companyName,
      time: vendor.createdAt.toISOString(),
      type: 'vendor' as const,
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
      totalVendors: vendorRows.length,
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
        title: 'Review seller applications',
        count: sellerRows.filter((seller) => seller.status === 'PENDING').length,
        priority: 'high',
      },
      {
        id: 'pending-vendors',
        title: 'Review vendor applications',
        count: vendorRows.filter((vendor) => vendor.status === 'PENDING').length,
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

export const getCachedAdminVendors = React.cache(async () => {
  const rows = await db
    .select({
      id: vendors.id,
      name: vendors.companyName,
      email: users.email,
      phone: users.phone,
      location: vendors.location,
      status: vendors.status,
      activeProjects: vendors.activeProjects,
      revenue: vendors.revenue,
      joinedAt: vendors.createdAt,
      specialty: vendors.industry,
      tier: vendors.tier,
    })
    .from(vendors)
    .innerJoin(users, eq(vendors.userId, users.id))
    .orderBy(desc(vendors.createdAt))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    location: row.location ?? '',
    status: row.status.toLowerCase(),
    projectsCompleted: 0,
    activeProjects: row.activeProjects,
    rating: 4.5,
    revenue: Number(row.revenue),
    joinedAt: row.joinedAt.toISOString(),
    specialty: row.specialty ?? 'Generalist',
    tier: row.tier,
  })) satisfies VendorDirectoryDto[]
})

export const getCachedAdminSuppliers = React.cache(async () => {
  return getCachedAdminVendors()
})
