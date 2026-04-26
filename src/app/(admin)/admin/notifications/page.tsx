import NotificationsPageClient from '@/app/(dashboard)/notifications/NotificationsPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserNotifications } from '@/lib/data/communications'

export default async function AdminNotificationsPage() {
  const user = await requireRole('ADMIN')
  const notifications = await getCachedUserNotifications(user.id, user.role)

  return (
    <NotificationsPageClient
      email={user.email}
      initialNotifications={notifications}
      pageSubtitle="Track project activity, inbound messages, and platform-level events."
    />
  )
}
