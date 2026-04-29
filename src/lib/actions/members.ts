'use server'

import { db } from '@/db'
import { sellers, vendors, notifications, users } from '@/db/schema'
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
      content: 'Your seller account has been approved. You can now access the seller portal.',
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
      content:
        reason ??
        'Unfortunately, your seller registration was not approved at this time.',
      link: '/register',
    })
  }

  revalidatePath('/admin/sellers')
  revalidatePath('/admin')

  return { success: true }
}

export async function approveVendor(vendorId: string) {
  await requireRole('ADMIN')

  await db.update(vendors).set({ status: 'ACTIVE' }).where(eq(vendors.id, vendorId))

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, vendorId),
    with: { user: true },
  })

  if (vendor?.user) {
    await db.insert(notifications).values({
      userId: vendor.userId,
      type: 'SYSTEM',
      title: 'Registration approved',
      content: 'Your vendor account has been approved. You can now access the vendor portal.',
      link: '/vendor',
    })
  }

  revalidatePath('/admin/vendors')
  revalidatePath('/admin')

  return { success: true }
}

export async function rejectVendor(vendorId: string, reason?: string) {
  await requireRole('ADMIN')

  await db.update(vendors).set({ status: 'REJECTED' }).where(eq(vendors.id, vendorId))

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, vendorId),
    with: { user: true },
  })

  if (vendor?.user) {
    await db.insert(notifications).values({
      userId: vendor.userId,
      type: 'SYSTEM',
      title: 'Registration not approved',
      content:
        reason ?? 'Unfortunately, your vendor registration was not approved at this time.',
      link: '/register',
    })
  }

  revalidatePath('/admin/vendors')
  revalidatePath('/admin')

  return { success: true }
}
