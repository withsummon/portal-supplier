import { getCachedAdminVendors } from '@/lib/data/admin'
import CreateProjectForVendorClient from './CreateProjectForVendorClient'

export default async function CreateProjectForVendorPage() {
  const vendors = await getCachedAdminVendors()

  return <CreateProjectForVendorClient vendors={vendors} />
}
