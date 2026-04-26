import type { ReactNode } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const dynamic = 'force-dynamic'

export default function VendorLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
