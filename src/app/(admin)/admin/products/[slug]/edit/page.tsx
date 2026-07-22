import { notFound } from 'next/navigation'
import { getCachedAdminProductBySlug } from '@/lib/data/products'
import ProductFormClient from '../../ProductFormClient'

export default async function EditAdminProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getCachedAdminProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductFormClient initialProduct={product} />
}
