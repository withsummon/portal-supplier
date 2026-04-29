import DashboardLayout from '@/components/layout/DashboardLayout'
import type { ReactNode } from 'react'
import { getCurrentUserRecord, requireRole } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await requireRole('SELLER')

  if (user.seller?.status === 'PENDING') {
    redirect('/pending-approval?role=seller')
  }

  if (user.seller?.status === 'REJECTED') {
    redirect('/register?seller=rejected')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
