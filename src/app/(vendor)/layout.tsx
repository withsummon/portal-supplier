import type { ReactNode } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getCurrentUserRecord, requireRole } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function VendorLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('VENDOR')

  if (user.vendor?.status === 'PENDING') {
    redirect('/pending-approval?role=vendor')
  }

  if (user.vendor?.status === 'REJECTED') {
    redirect('/register?vendor=rejected')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
