'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandBar, { type CommandBarProject } from './CommandBar'
import type { NotificationDto } from '@/lib/data/communications'

// Minimal type for user data needed in layout (must match SidebarUser)
interface UserProfile {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'SELLER'
  seller?: { companyName: string } | null
  adminTeam?: { department: string } | null
}

interface DashboardLayoutClientProps {
  children: React.ReactNode
  notifications: NotificationDto[]
  products: { id: string; name: string; slug: string }[]
  projects: CommandBarProject[]
  user: UserProfile | null
}

export default function DashboardLayoutClient({
  children,
  notifications,
  products,
  projects,
  user,
}: DashboardLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className="portal-layout"
      style={
        collapsed
          ? ({ '--sidebar-width': 'var(--sidebar-collapsed)' } as React.CSSProperties)
          : undefined
      }
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} user={user} />
      <div className={`portal-main${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Header notifications={notifications} sidebarCollapsed={collapsed} userRole={user?.role} />
        <main className="portal-content animate-in">{children}</main>
      </div>
      <CommandBar products={products} projects={projects} />
    </div>
  )
}
