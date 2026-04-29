import React from 'react'
import { db } from '@/db'
import { offerTemplates, categories } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export interface OfferTemplateDto {
  id: string
  categoryId: string | null
  categoryName: string | null
  name: string
  description: string | null
  defaultPricingType: 'FIXED' | 'RANGE' | 'CUSTOM'
  defaultMinAmount: number | null
  defaultMaxAmount: number | null
  defaultCurrency: string
  defaultDuration: number
  defaultTerms: string | null
  customFields: Array<{ label: string; type: string; required: boolean; options?: string[] }>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const getCachedOfferTemplates = React.cache(async () => {
  const rows = await db.query.offerTemplates.findMany({
    orderBy: [desc(offerTemplates.createdAt)],
  })

  const categoryMap = new Map<string, string>(
    (
      await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
    ).map((row) => [row.id, row.name] as [string, string]),
  )

  return rows.map((row) => ({
    id: row.id,
    categoryId: row.categoryId,
    categoryName: row.categoryId ? (categoryMap.get(row.categoryId) ?? null) : null,
    name: row.name,
    description: row.description,
    defaultPricingType: row.defaultPricingType,
    defaultMinAmount: row.defaultMinAmount ? Number(row.defaultMinAmount) : null,
    defaultMaxAmount: row.defaultMaxAmount ? Number(row.defaultMaxAmount) : null,
    defaultCurrency: row.defaultCurrency ?? 'USD',
    defaultDuration: row.defaultDuration ?? 30,
    defaultTerms: row.defaultTerms,
    customFields: row.customFields ?? [],
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  })) satisfies OfferTemplateDto[]
})

export const getCachedOfferTemplatesForCategory = React.cache(async (categoryId: string) => {
  const rows = await db.query.offerTemplates.findMany({
    where: eq(offerTemplates.categoryId, categoryId),
    orderBy: [desc(offerTemplates.createdAt)],
  })

  return rows.map((row) => ({
    id: row.id,
    categoryId: row.categoryId,
    categoryName: null,
    name: row.name,
    description: row.description,
    defaultPricingType: row.defaultPricingType,
    defaultMinAmount: row.defaultMinAmount ? Number(row.defaultMinAmount) : null,
    defaultMaxAmount: row.defaultMaxAmount ? Number(row.defaultMaxAmount) : null,
    defaultCurrency: row.defaultCurrency ?? 'USD',
    defaultDuration: row.defaultDuration ?? 30,
    defaultTerms: row.defaultTerms,
    customFields: row.customFields ?? [],
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  })) satisfies OfferTemplateDto[]
})

export const getCachedOfferTemplatesForProduct = React.cache(async (productCategory: string) => {
  const category = await db.query.categories.findFirst({
    where: eq(categories.name, productCategory),
  })

  if (!category) return null

  const templates = await db.query.offerTemplates.findMany({
    where: eq(offerTemplates.categoryId, category.id),
  })

  return templates.length > 0
    ? {
        id: templates[0]!.id,
        categoryId: templates[0]!.categoryId,
        categoryName: null,
        name: templates[0]!.name,
        description: templates[0]!.description,
        defaultPricingType: templates[0]!.defaultPricingType,
        defaultMinAmount: templates[0]!.defaultMinAmount
          ? Number(templates[0]!.defaultMinAmount)
          : null,
        defaultMaxAmount: templates[0]!.defaultMaxAmount
          ? Number(templates[0]!.defaultMaxAmount)
          : null,
        defaultCurrency: templates[0]!.defaultCurrency ?? 'USD',
        defaultDuration: templates[0]!.defaultDuration ?? 30,
        defaultTerms: templates[0]!.defaultTerms,
        customFields: templates[0]!.customFields ?? [],
        isActive: templates[0]!.isActive,
        createdAt: templates[0]!.createdAt.toISOString(),
        updatedAt: templates[0]!.updatedAt.toISOString(),
      }
    : null
})
