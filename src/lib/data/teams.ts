import React from 'react'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { adminTeamMembers, sellers, teamMembers, users } from '@/db/schema'

export interface SellerTeamMemberDto {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  joinedAt: string
}

export interface AdminTeamMemberDto {
  id: string
  userId: string
  name: string
  email: string
  role: string
  department: string
  status: string
  verified: boolean
  joinedAt: string
}

export const getCachedSellerTeam = React.cache(async (userId: string) => {
  const seller = await db.query.sellers.findFirst({
    where: eq(sellers.userId, userId),
  })

  if (!seller) {
    return {
      seller: null,
      members: [] as SellerTeamMemberDto[],
    }
  }

  const members = await db.query.teamMembers.findMany({
    where: eq(teamMembers.sellerId, seller.id),
    orderBy: [desc(teamMembers.createdAt)],
  })

  return {
    seller: {
      id: seller.id,
      companyName: seller.companyName,
    },
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone ?? '',
      role: member.role,
      status: member.status,
      joinedAt: member.createdAt.toISOString(),
    })),
  }
})

export const getCachedAdminTeam = React.cache(async () => {
  const members = await db
    .select({
      id: adminTeamMembers.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      role: adminTeamMembers.role,
      department: adminTeamMembers.department,
      status: adminTeamMembers.status,
      verified: adminTeamMembers.verified,
      joinedAt: adminTeamMembers.createdAt,
    })
    .from(adminTeamMembers)
    .innerJoin(users, eq(adminTeamMembers.userId, users.id))
    .orderBy(desc(adminTeamMembers.createdAt))

  return members.map((member) => ({
    id: member.id,
    userId: member.userId,
    name: member.name ?? '',
    email: member.email,
    role: member.role,
    department: member.department,
    status: member.status,
    verified: member.verified,
    joinedAt: member.joinedAt.toISOString(),
  })) satisfies AdminTeamMemberDto[]
})
