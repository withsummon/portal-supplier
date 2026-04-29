'use server'

import { db } from '@/db'
import { offerTemplates } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth/session'

export async function createOfferTemplate(input: {
  categoryId: string | null
  name: string
  description?: string
  defaultPricingType: 'FIXED' | 'RANGE' | 'CUSTOM'
  defaultMinAmount?: number
  defaultMaxAmount?: number
  defaultCurrency?: string
  defaultDuration?: number
  defaultTerms?: string
  customFields?: Array<{ label: string; type: string; required: boolean; options?: string[] }>
  isActive?: boolean
}) {
  await requireRole('ADMIN')

  const [template] = await db
    .insert(offerTemplates)
    .values({
      categoryId: input.categoryId ?? null,
      name: input.name,
      description: input.description ?? null,
      defaultPricingType: input.defaultPricingType,
      defaultMinAmount: input.defaultMinAmount?.toString() ?? null,
      defaultMaxAmount: input.defaultMaxAmount?.toString() ?? null,
      defaultCurrency: input.defaultCurrency ?? 'USD',
      defaultDuration: input.defaultDuration ?? 30,
      defaultTerms: input.defaultTerms ?? null,
      customFields: input.customFields ?? [],
      isActive: input.isActive ?? true,
    })
    .returning()

  revalidatePath('/admin/offer-templates')

  return { success: true, data: template } as const
}

export async function updateOfferTemplate(
  id: string,
  input: {
    categoryId?: string | null
    name?: string
    description?: string
    defaultPricingType?: 'FIXED' | 'RANGE' | 'CUSTOM'
    defaultMinAmount?: number
    defaultMaxAmount?: number
    defaultCurrency?: string
    defaultDuration?: number
    defaultTerms?: string
    customFields?: Array<{ label: string; type: string; required: boolean; options?: string[] }>
    isActive?: boolean
  },
) {
  await requireRole('ADMIN')

  const [template] = await db
    .update(offerTemplates)
    .set({
      categoryId: input.categoryId ?? undefined,
      name: input.name ?? undefined,
      description: input.description ?? undefined,
      defaultPricingType: input.defaultPricingType ?? undefined,
      defaultMinAmount: input.defaultMinAmount?.toString() ?? undefined,
      defaultMaxAmount: input.defaultMaxAmount?.toString() ?? undefined,
      defaultCurrency: input.defaultCurrency ?? undefined,
      defaultDuration: input.defaultDuration ?? undefined,
      defaultTerms: input.defaultTerms ?? undefined,
      customFields: input.customFields ?? undefined,
      isActive: input.isActive ?? undefined,
    })
    .where(eq(offerTemplates.id, id))
    .returning()

  revalidatePath('/admin/offer-templates')

  return { success: true, data: template } as const
}

export async function deleteOfferTemplate(id: string) {
  await requireRole('ADMIN')

  await db.delete(offerTemplates).where(eq(offerTemplates.id, id))

  revalidatePath('/admin/offer-templates')

  return { success: true } as const
}
