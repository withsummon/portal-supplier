'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users, sellers, notifications } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getCurrentSession } from '@/lib/auth/session'

// ============================================================
// AUTH ACTIONS
// ============================================================

export async function registerUser(data: {
  email: string
  password: string
  name: string
  role: 'SELLER' | 'ADMIN'
  companyName: string
  industry?: string | undefined
  companySize?: string | undefined
  website?: string | undefined
}) {
  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))

    if (existing.length > 0) {
      return { error: 'Email already registered' }
    }

    const result = await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    })

    const user = result.user

    await db.update(users).set({ role: data.role }).where(eq(users.id, user.id))

    if (data.role === 'ADMIN') {
      return { success: true, userId: user.id }
    }

    const profileValues = {
      userId: user.id,
      companyName: data.companyName,
      industry: data.industry,
      companySize: data.companySize,
      website: data.website,
    }

    let newProfileId: string | null = null

    const [seller] = await db.insert(sellers).values(profileValues).returning({ id: sellers.id })
    newProfileId = seller?.id ?? null

    // Notify all admins of the new registration
    const adminUsers = await db.select({ id: users.id }).from(users).where(eq(users.role, 'ADMIN'))
    if (newProfileId) {
      const notificationRows: Array<typeof notifications.$inferInsert> = adminUsers.map(
        (admin) => ({
          userId: admin.id,
          type: 'SELLER_REGISTRATION',
          title: `New seller registration: ${data.companyName}`,
          content: 'A new seller registration requires your review.',
          link: '/admin/sellers',
          meta: JSON.stringify({ profileId: newProfileId, role: data.role }),
        }),
      )

      await db.insert(notifications).values(notificationRows)
    }

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Registration failed' }
  }
}

export async function signIn(data: {
  email: string
  password: string
  expectedRole?: 'SELLER' | 'ADMIN'
}) {
  try {
    const result = await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: data.email,
        password: data.password,
      },
    })

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, result.user.id),
      with: { seller: true },
    })

    if (data.expectedRole && userRecord?.role !== data.expectedRole) {
      await auth.api.signOut({
        headers: await headers(),
      })

      return { error: 'This account does not match the selected workspace' }
    }

    // Check if seller is pending approval
    if (userRecord?.role === 'SELLER' && userRecord.seller?.status === 'PENDING') {
      return { pending: true, error: 'Your account is pending approval.' }
    }

    return { success: true, user: userRecord ?? result.user }
  } catch (error) {
    console.error('Sign in error:', error)
    return { error: 'Invalid email or password' }
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    })

    redirect('/login')
  } catch (error) {
    console.error('Sign out error:', error)
    redirect('/login')
  }
}

export async function getSession() {
  return getCurrentSession()
}

export async function getCurrentUser() {
  const session = await getCurrentSession()
  if (!session?.user) return null

  return db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      seller: true,
      adminTeam: true,
    },
  })
}
