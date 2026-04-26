import type { ReactNode } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { requireRole } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function VendorLayout({ children }: { children: ReactNode }) {
  await requireRole('VENDOR')
  return <DashboardLayout>{children}</DashboardLayout>
}
