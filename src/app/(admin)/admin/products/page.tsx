import AdminProductsPageClient from './AdminProductsPageClient'
import { getCachedAdminProducts } from '@/lib/data/products'

export default async function AdminProductsPage() {
  const products = await getCachedAdminProducts()

  return <AdminProductsPageClient initialProducts={products} />
}
