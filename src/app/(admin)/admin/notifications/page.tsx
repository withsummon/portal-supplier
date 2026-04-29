import AdminNotificationsPageClient from './AdminNotificationsPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserNotifications } from '@/lib/data/communications'

export default async function AdminNotificationsPage() {
  const user = await requireRole('ADMIN')
  const notifications = await getCachedUserNotifications(user.id, user.role)

  return <AdminNotificationsPageClient initialNotifications={notifications} />
}
