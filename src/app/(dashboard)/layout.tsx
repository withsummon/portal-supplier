import DashboardLayout from '@/components/layout/DashboardLayout'
import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
