'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { adminTeamMembers, sellers, users } from '@/db/schema'
import { requireRole } from '@/lib/auth/session'
import { saveLocalUpload } from '@/lib/uploads'

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function readOptionalFile(formData: FormData, key: string) {
  const value = formData.get(key)
  return value instanceof File && value.size > 0 ? value : null
}

export async function updateSellerProfile(formData: FormData) {
  const user = await requireRole('SELLER')
  const logoFile = readOptionalFile(formData, 'logo')
  const nextLogoUrl = logoFile
    ? await saveLocalUpload({
        file: logoFile,
        folder: 'profiles',
        allowedMimePrefix: 'image/',
      })
    : null

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        name: readString(formData, 'name'),
        email: readString(formData, 'email'),
        phone: readString(formData, 'phone'),
        location: readString(formData, 'location'),
        ...(nextLogoUrl ? { image: nextLogoUrl } : {}),
      })
      .where(eq(users.id, user.id))

    const seller = user.seller
    if (!seller) {
      throw new Error('Seller profile not found.')
    }

    await tx
      .update(sellers)
      .set({
        companyName: readString(formData, 'companyName'),
        industry: readString(formData, 'industry'),
        companySize: readString(formData, 'companySize'),
        website: readString(formData, 'website'),
        description: readString(formData, 'description'),
        location: readString(formData, 'location'),
        ...(nextLogoUrl ? { logoUrl: nextLogoUrl } : {}),
      })
      .where(eq(sellers.id, seller.id))
  })

  revalidatePath('/profile')

  return { success: true }
}

export async function updateAdminProfile(formData: FormData) {
  const user = await requireRole('ADMIN')
  const imageFile = readOptionalFile(formData, 'image')
  const nextImageUrl = imageFile
    ? await saveLocalUpload({
        file: imageFile,
        folder: 'profiles',
        allowedMimePrefix: 'image/',
      })
    : null

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        name: readString(formData, 'name'),
        email: readString(formData, 'email'),
        phone: readString(formData, 'phone'),
        location: readString(formData, 'location'),
        preferences: {
          emailNotifications: formData.get('emailNotifications') === 'true',
          projectUpdates: formData.get('projectUpdates') === 'true',
          weeklyReports: formData.get('weeklyReports') === 'true',
        },
        ...(nextImageUrl ? { image: nextImageUrl } : {}),
      })
      .where(eq(users.id, user.id))

    const adminTeam = user.adminTeam
    if (!adminTeam) {
      throw new Error('Admin profile not found.')
    }

    await tx
      .update(adminTeamMembers)
      .set({
        department: readString(formData, 'department'),
      })
      .where(eq(adminTeamMembers.id, adminTeam.id))
  })

  revalidatePath('/admin/profile')

  return { success: true }
}
