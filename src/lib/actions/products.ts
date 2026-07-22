'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { products } from '@/db/schema'
import { requireRole } from '@/lib/auth/session'
import { saveLocalUpload } from '@/lib/uploads'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function saveProductImages(files: File[]) {
  const urls: string[] = []

  for (const file of files) {
    urls.push(
      await saveLocalUpload({
        file,
        folder: 'products',
        allowedMimePrefix: 'image/',
      }),
    )
  }

  return urls
}

export async function createProduct(input: {
  name: string
  kind: string
  category: string
  description: string
  longDescription: string
  basePrice: number
  currency: string
  features: string[]
  useCases: string[]
  clients: string[]
  icon: string
  iconBg: string
  iconColor: string
  badge?: string
  visible: boolean
  imageFiles?: File[]
  pitchDeckPdf?: File | null
}) {
  await requireRole('ADMIN')

  const images = input.imageFiles?.length ? await saveProductImages(input.imageFiles) : []
  const pitchDeckPdf = input.pitchDeckPdf
    ? await saveLocalUpload({
        file: input.pitchDeckPdf,
        folder: 'products',
        allowedMimePrefix: 'application/',
      })
    : null

  const [product] = await db
    .insert(products)
    .values({
      name: input.name.trim(),
      slug: slugify(input.name),
      kind: input.kind === 'PORTFOLIO' ? 'PORTFOLIO' : 'PRODUCT',
      category: input.category.trim(),
      description: input.description.trim(),
      longDescription: input.longDescription.trim(),
      basePrice: input.basePrice.toString(),
      currency: 'IDR',
      features: input.features,
      useCases: input.useCases,
      clients: input.clients,
      icon: input.icon,
      iconBg: input.iconBg,
      iconColor: input.iconColor,
      badge: input.badge?.trim() || null,
      images,
      pitchDeckPdf,
      isActive: input.visible,
    })
    .returning()

  revalidatePath('/admin/products')
  revalidatePath('/factory')
  return product
}

export async function updateProduct(input: {
  id: string
  name: string
  kind: string
  category: string
  description: string
  longDescription: string
  basePrice: number
  currency: string
  features: string[]
  useCases: string[]
  clients: string[]
  icon: string
  iconBg: string
  iconColor: string
  badge?: string
  visible: boolean
  existingImages: string[]
  imageFiles?: File[]
  replacePitchDeck?: boolean
  pitchDeckPdf?: File | null
}) {
  await requireRole('ADMIN')

  const uploadedImages = input.imageFiles?.length ? await saveProductImages(input.imageFiles) : []
  const images = [...input.existingImages, ...uploadedImages]

  let pitchDeckPdf: string | null | undefined
  if (input.replacePitchDeck) {
    pitchDeckPdf = input.pitchDeckPdf
      ? await saveLocalUpload({
          file: input.pitchDeckPdf,
          folder: 'products',
          allowedMimePrefix: 'application/',
        })
      : null
  }

  const [product] = await db
    .update(products)
    .set({
      name: input.name.trim(),
      slug: slugify(input.name),
      kind: input.kind === 'PORTFOLIO' ? 'PORTFOLIO' : 'PRODUCT',
      category: input.category.trim(),
      description: input.description.trim(),
      longDescription: input.longDescription.trim(),
      basePrice: input.basePrice.toString(),
      currency: 'IDR',
      features: input.features,
      useCases: input.useCases,
      clients: input.clients,
      icon: input.icon,
      iconBg: input.iconBg,
      iconColor: input.iconColor,
      badge: input.badge?.trim() || null,
      images,
      ...(pitchDeckPdf !== undefined ? { pitchDeckPdf } : {}),
      isActive: input.visible,
    })
    .where(eq(products.id, input.id))
    .returning()

  revalidatePath('/admin/products')
  revalidatePath('/factory')
  revalidatePath(`/factory/${product?.slug ?? ''}`)
  return product
}

export async function deleteProduct(id: string) {
  await requireRole('ADMIN')
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/admin/products')
  revalidatePath('/factory')
}

export async function toggleProductVisibility(id: string, visible: boolean) {
  await requireRole('ADMIN')
  const [product] = await db
    .update(products)
    .set({ isActive: visible })
    .where(eq(products.id, id))
    .returning()

  revalidatePath('/admin/products')
  revalidatePath('/factory')
  return product
}
