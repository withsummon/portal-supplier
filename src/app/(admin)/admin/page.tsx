import AdminDashboardClient from './AdminDashboardClient'
import { getCachedAdminDashboard } from '@/lib/data/admin'

export default async function AdminDashboardPage() {
  const data = await getCachedAdminDashboard()

  return (
    <AdminDashboardClient
      stats={data.stats}
      activities={data.activities}
      pendingActions={data.pendingActions}
    />
  )
}
