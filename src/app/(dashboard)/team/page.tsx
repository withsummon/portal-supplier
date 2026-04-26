import TeamPageClient from './TeamPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedSellerTeam } from '@/lib/data/teams'

export default async function TeamPage() {
  const user = await requireRole('SELLER')
  const { members } = await getCachedSellerTeam(user.id)

  return <TeamPageClient initialMembers={members} />
}
