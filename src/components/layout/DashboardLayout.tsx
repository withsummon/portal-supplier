import DashboardLayoutClient from './DashboardLayoutClient'
import { getCachedCommandBarProducts, getCachedCommandBarProjects } from '@/lib/data/layout'
import { getCurrentUserRecord } from '@/lib/auth/session'
import { getCachedUserNotifications } from '@/lib/data/communications'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = (await getCurrentUserRecord()) ?? null
  const sellerId = user?.seller?.id
  const [allProjects, products, notifications] = await Promise.all([
    getCachedCommandBarProjects(sellerId ? { sellerId } : {}),
    getCachedCommandBarProducts(),
    user ? getCachedUserNotifications(user.id, user.role) : Promise.resolve([]),
  ])

  return (
    <DashboardLayoutClient
      notifications={notifications}
      products={products}
      projects={allProjects}
      user={user}
    >
      {children}
    </DashboardLayoutClient>
  )
}
