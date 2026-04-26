'use server'

import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { adminTeamMembers, sellers, teamMembers, users } from '@/db/schema'
import { requireRole } from '@/lib/auth/session'

export async function createSellerTeamMember(input: {
  name: string
  email: string
  phone?: string
  role: string
}) {
  const user = await requireRole('SELLER')

  if (!input.name.trim() || !input.email.trim()) {
    throw new Error('Name and email are required.')
  }

  const seller = await db.query.sellers.findFirst({
    where: eq(sellers.userId, user.id),
  })

  if (!seller) {
    throw new Error('Seller account not found.')
  }

  const [member] = await db
    .insert(teamMembers)
    .values({
      sellerId: seller.id,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      role: input.role.trim(),
      status: 'pending',
      isActive: true,
    })
    .returning()

  revalidatePath('/team')
  return member
}

export async function updateSellerTeamMember(input: {
  id: string
  role?: string
  status?: string
  phone?: string
}) {
  await requireRole('SELLER')

  const [member] = await db
    .update(teamMembers)
    .set({
      ...(input.role ? { role: input.role.trim() } : {}),
      ...(input.status ? { status: input.status.trim() } : {}),
      ...(input.phone !== undefined ? { phone: input.phone.trim() || null } : {}),
    })
    .where(eq(teamMembers.id, input.id))
    .returning()

  revalidatePath('/team')
  return member
}

export async function deleteSellerTeamMember(id: string) {
  await requireRole('SELLER')
  await db.delete(teamMembers).where(eq(teamMembers.id, id))
  revalidatePath('/team')
}

export async function createAdminTeamMember(input: {
  name: string
  email: string
  department: string
  role: string
}) {
  await requireRole('ADMIN')

  if (!input.name.trim() || !input.email.trim()) {
    throw new Error('Name and email are required.')
  }

  const tempPassword = await hash(`ChangeMe-${randomUUID()}`, 12)

  const result = await db.transaction(async (tx) => {
    const [createdUser] = await tx
      .insert(users)
      .values({
        email: input.email.trim(),
        password: tempPassword,
        name: input.name.trim(),
        role: 'ADMIN',
        preferences: {},
      })
      .returning()

    if (!createdUser) {
      throw new Error('Failed to create admin user.')
    }

    const [member] = await tx
      .insert(adminTeamMembers)
      .values({
        userId: createdUser.id,
        department: input.department.trim(),
        role: input.role.trim(),
        status: 'pending',
        verified: false,
        isActive: true,
      })
      .returning()

    if (!member) {
      throw new Error('Failed to create admin team member.')
    }

    return { createdUser, member }
  })

  revalidatePath('/admin/team')
  return result
}

export async function updateAdminTeamMember(input: {
  id: string
  role?: string
  department?: string
  status?: string
  verified?: boolean
}) {
  await requireRole('ADMIN')

  const [member] = await db
    .update(adminTeamMembers)
    .set({
      ...(input.role ? { role: input.role.trim() } : {}),
      ...(input.department ? { department: input.department.trim() } : {}),
      ...(input.status ? { status: input.status.trim() } : {}),
      ...(input.verified !== undefined ? { verified: input.verified } : {}),
    })
    .where(eq(adminTeamMembers.id, input.id))
    .returning()

  revalidatePath('/admin/team')
  return member
}

export async function deleteAdminTeamMember(id: string) {
  const currentUser = await requireRole('ADMIN')
  const member = await db.query.adminTeamMembers.findFirst({
    where: eq(adminTeamMembers.id, id),
  })

  if (!member) {
    return
  }

  if (member.userId === currentUser.id) {
    throw new Error('You cannot delete your own admin account.')
  }

  await db.transaction(async (tx) => {
    await tx.delete(adminTeamMembers).where(eq(adminTeamMembers.id, id))
    await tx.delete(users).where(eq(users.id, member.userId))
  })

  revalidatePath('/admin/team')
}
