import AdminDashboardClient from './AdminDashboardClient'
import { getCachedAdminDashboard } from '@/lib/data/admin'
import { getCachedAdminProjects } from '@/lib/data/project-workflows'

export default async function AdminDashboardPage() {
  const [data, projects] = await Promise.all([getCachedAdminDashboard(), getCachedAdminProjects()])

  return (
    <AdminDashboardClient
      stats={data.stats}
      activities={data.activities}
      pendingActions={data.pendingActions}
      projects={projects}
    />
  )
}
