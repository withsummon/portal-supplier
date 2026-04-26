import AdminTeamPageClient from './AdminTeamPageClient'
import { getCachedAdminTeam } from '@/lib/data/teams'

export default async function AdminTeamPage() {
  const members = await getCachedAdminTeam()

  return <AdminTeamPageClient initialMembers={members} />
}
