import FactoryPageClient from './FactoryPageClient'
import { getCachedFactoryProducts } from '@/lib/data/products'

export default async function FactoryPage() {
  const products = await getCachedFactoryProducts()

  return <FactoryPageClient products={products} />
}
