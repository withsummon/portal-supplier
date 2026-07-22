import React from 'react'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { adminTeamMembers, sellers, users } from '@/db/schema'

export interface CompanyProfileDto {
  userId: string
  role: 'SELLER'
  name: string
  email: string
  phone: string
  location: string
  image: string | null
  companyId: string
  companyName: string
  industry: string
  companySize: string
  website: string
  description: string
  logoUrl: string | null
  tier: string
  status: string
}

export interface AdminProfileDto {
  userId: string
  name: string
  email: string
  phone: string
  location: string
  image: string | null
  department: string
  role: string
  status: string
  verified: boolean
  preferences: Record<string, boolean>
}

export const getCachedSellerProfile = React.cache(async (userId: string) => {
  const rows = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      location: users.location,
      image: users.image,
      companyId: sellers.id,
      companyName: sellers.companyName,
      industry: sellers.industry,
      companySize: sellers.companySize,
      website: sellers.website,
      description: sellers.description,
      logoUrl: sellers.logoUrl,
      tier: sellers.tier,
      status: sellers.status,
    })
    .from(users)
    .innerJoin(sellers, eq(sellers.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1)

  const row = rows[0]

  if (!row) {
    return null
  }

  return {
    userId: row.userId,
    role: 'SELLER' as const,
    name: row.name ?? '',
    email: row.email,
    phone: row.phone ?? '',
    location: row.location ?? row.location ?? '',
    image: row.image,
    companyId: row.companyId,
    companyName: row.companyName,
    industry: row.industry ?? '',
    companySize: row.companySize ?? '',
    website: row.website ?? '',
    description: row.description ?? '',
    logoUrl: row.logoUrl,
    tier: row.tier,
    status: row.status,
  } satisfies CompanyProfileDto
})

export const getCachedAdminProfile = React.cache(async (userId: string) => {
  const rows = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      location: users.location,
      image: users.image,
      preferences: users.preferences,
      department: adminTeamMembers.department,
      role: adminTeamMembers.role,
      status: adminTeamMembers.status,
      verified: adminTeamMembers.verified,
    })
    .from(users)
    .innerJoin(adminTeamMembers, eq(adminTeamMembers.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1)

  const row = rows[0]

  if (!row) {
    return null
  }

  return {
    userId: row.userId,
    name: row.name ?? '',
    email: row.email,
    phone: row.phone ?? '',
    location: row.location ?? '',
    image: row.image,
    department: row.department,
    role: row.role,
    status: row.status,
    verified: row.verified,
    preferences: row.preferences ?? {},
  } satisfies AdminProfileDto
})
