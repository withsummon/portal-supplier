'use server'

import { db } from '@/db'
import { notifications, sellers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/session'

export async function approveSeller(sellerId: string) {
  await requireRole('ADMIN')

  await db.update(sellers).set({ status: 'ACTIVE' }).where(eq(sellers.id, sellerId))

  const seller = await db.query.sellers.findFirst({
    where: eq(sellers.id, sellerId),
    with: { user: true },
  })

  if (seller?.user) {
    await db.insert(notifications).values({
      userId: seller.userId,
      type: 'SYSTEM',
      title: 'Registration approved',
      content: 'Your makelar account has been approved. You can now access the makelar portal.',
      link: '/dashboard',
    })
  }

  revalidatePath('/admin/sellers')
  revalidatePath('/admin')

  return { success: true }
}

export async function rejectSeller(sellerId: string, reason?: string) {
  await requireRole('ADMIN')

  await db.update(sellers).set({ status: 'REJECTED' }).where(eq(sellers.id, sellerId))

  const seller = await db.query.sellers.findFirst({
    where: eq(sellers.id, sellerId),
    with: { user: true },
  })

  if (seller?.user) {
    await db.insert(notifications).values({
      userId: seller.userId,
      type: 'SYSTEM',
      title: 'Registration not approved',
      content: reason ?? 'Unfortunately, your makelar registration was not approved at this time.',
      link: '/register',
    })
  }

  revalidatePath('/admin/sellers')
  revalidatePath('/admin')

  return { success: true }
}
