import SellersPageClient from './SellersPageClient'
import { getCachedAdminSellers } from '@/lib/data/admin'

export default async function SellersPage() {
  const sellers = await getCachedAdminSellers()

  return <SellersPageClient sellers={sellers} />
}
