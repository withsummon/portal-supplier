import VendorsPageClient from '../vendors/VendorsPageClient'
import { getCachedAdminSuppliers } from '@/lib/data/admin'

export default async function SuppliersPage() {
  const suppliers = await getCachedAdminSuppliers()

  return (
    <VendorsPageClient
      vendors={suppliers}
      title="Suppliers"
      subtitle="Manage and monitor all registered supplier companies."
    />
  )
}
