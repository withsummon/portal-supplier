import DashboardLayoutClient from './DashboardLayoutClient'
import { getCachedCommandBarProjects } from '@/lib/data/layout'
import { getCurrentUserRecord } from '@/lib/auth/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = (await getCurrentUserRecord()) ?? null
  const sellerId = user?.seller?.id
  const allProjects = await getCachedCommandBarProjects(sellerId ? { sellerId } : {})

  return (
    <DashboardLayoutClient projects={allProjects} user={user}>
      {children}
    </DashboardLayoutClient>
  )
}
