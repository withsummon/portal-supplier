import CompanyProfileClient from '@/components/profile/CompanyProfileClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedSellerProfile } from '@/lib/data/profiles'

export default async function SellerProfilePage() {
  const user = await requireRole('SELLER')
  const profile = await getCachedSellerProfile(user.id)

  if (!profile) {
    return <div style={{ padding: 'var(--sp-20)' }}>Seller profile not found.</div>
  }

  return (
    <CompanyProfileClient
      pageTitle="Company Profile"
      pageSubtitle="Manage your company details and brand identity."
      profile={profile}
    />
  )
}
