import VendorsPageClient from './VendorsPageClient'
import { getCachedAdminVendors } from '@/lib/data/admin'

export default async function VendorsPage() {
  const vendors = await getCachedAdminVendors()

  return <VendorsPageClient vendors={vendors} />
}
