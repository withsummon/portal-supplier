import NotificationsPageClient from '@/app/(dashboard)/notifications/NotificationsPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserNotifications } from '@/lib/data/communications'

export default async function VendorNotificationsPage() {
  const user = await requireRole('VENDOR')
  const notifications = await getCachedUserNotifications(user.id, user.role)

  return (
    <NotificationsPageClient
      email={user.email}
      initialNotifications={notifications}
      pageSubtitle="Stay updated on bids, new matching projects, and Summon team responses."
    />
  )
}
