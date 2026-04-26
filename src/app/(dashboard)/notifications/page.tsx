import NotificationsPageClient from './NotificationsPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserNotifications } from '@/lib/data/communications'

export default async function NotificationsPage() {
  const user = await requireRole('SELLER')
  const notifications = await getCachedUserNotifications(user.id, user.role)

  return (
    <NotificationsPageClient
      email={user.email}
      initialNotifications={notifications}
      pageSubtitle="Stay updated on your projects and Summon insights."
    />
  )
}
