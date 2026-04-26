import DashboardLayoutClient from './DashboardLayoutClient'
import { getCachedCommandBarProjects } from '@/lib/data/layout'
import { getCurrentUserRecord } from '@/lib/auth/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const allProjects = await getCachedCommandBarProjects()
  const user = await getCurrentUserRecord() ?? null

  return <DashboardLayoutClient projects={allProjects} user={user}>{children}</DashboardLayoutClient>
}
