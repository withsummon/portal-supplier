import AdminProfileClient from './AdminProfileClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedAdminProfile } from '@/lib/data/profiles'

export default async function AdminProfilePage() {
  const user = await requireRole('ADMIN')
  const profile = await getCachedAdminProfile(user.id)

  if (!profile) {
    return <div style={{ padding: 'var(--sp-20)' }}>Admin profile not found.</div>
  }

  return <AdminProfileClient profile={profile} />
}
