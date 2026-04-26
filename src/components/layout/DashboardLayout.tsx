import DashboardLayoutClient from './DashboardLayoutClient'
import { getCachedCommandBarProjects } from '@/lib/data/layout'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const allProjects = await getCachedCommandBarProjects()

  return <DashboardLayoutClient projects={allProjects}>{children}</DashboardLayoutClient>
}
