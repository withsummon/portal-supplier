import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function getCurrentUserRecord() {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    return null
  }

  return db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      seller: true,
      adminTeam: true,
    },
  })
}

export async function requireSession(redirectTo = '/login') {
  const session = await getCurrentSession()

  if (!session?.user) {
    redirect(redirectTo)
  }

  return session
}

export async function requireRole(role: typeof users.$inferSelect.role, redirectTo = '/login') {
  const user = await getCurrentUserRecord()

  if (!user) {
    redirect(redirectTo)
  }

  if (user.role !== role) {
    if (user.role === 'ADMIN') {
      redirect('/admin')
    }
    redirect('/dashboard')
  }

  return user
}
