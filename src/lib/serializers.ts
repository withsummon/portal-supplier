export function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : null
}

export function serializeProjectFile(file: {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: Date
  url: string | null
}) {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.url,
    uploadedAt: file.uploadedAt.toISOString(),
  }
}

export function serializeProduct(product: {
  id: string
  name: string
  slug: string
  category: string
  kind?: string | null
  description: string | null
  longDescription: string | null
  basePrice: string | number
  currency: string
  features: string[] | null
  useCases: string[] | null
  clients: string[] | null
  images: string[] | null
  icon: string | null
  iconBg: string | null
  iconColor: string | null
  badge: string | null
  pitchDeckPdf: string | null
  isActive: boolean
}) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    kind: product.kind ?? 'PRODUCT',
    description: product.description ?? '',
    longDescription: product.longDescription ?? '',
    basePrice: Number(product.basePrice),
    currency: product.currency,
    features: product.features ?? [],
    useCases: product.useCases ?? [],
    clients: product.clients ?? [],
    images: product.images ?? [],
    icon: product.icon ?? 'Cpu',
    iconBg: product.iconBg ?? 'var(--blue-50)',
    iconColor: product.iconColor ?? 'var(--blue-600)',
    badge: product.badge ?? '',
    pitchDeckPdf: product.pitchDeckPdf,
    visible: product.isActive,
  }
}
