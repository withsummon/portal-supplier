import DashboardLayout from '@/components/layout/DashboardLayout'
import type { ReactNode } from 'react'
import { requireRole } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: ReactNode }) {
  await requireRole('SELLER')
  return <DashboardLayout>{children}</DashboardLayout>
}
