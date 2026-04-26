import CompanyProfileClient from '@/components/profile/CompanyProfileClient'
import type { CompanyProfileDto } from '@/lib/data/profiles'

export default function VendorProfileClient({ vendor }: { vendor: CompanyProfileDto }) {
  return (
    <CompanyProfileClient
      pageTitle="Vendor Profile"
      pageSubtitle="Manage your company information and public vendor details."
      profile={vendor}
    />
  )
}
