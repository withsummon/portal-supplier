import type { ReactNode } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { requireRole } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole('ADMIN')
  return <DashboardLayout>{children}</DashboardLayout>
}
