'use client'

import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Factory,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  Shield,
  User,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { type LucideIcon } from 'lucide-react'

// Minimal type for user data needed in Sidebar
interface SidebarUser {
  id: string
  email: string
  name: string | null
  seller?: { companyName: string } | null
  adminTeam?: { department: string } | null
}

// Type definition for nav items
type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

type NavSection = {
  section: string
  items: NavItem[]
}

// Seller navigation
const sellerNavItems: NavSection[] = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Projects', href: '/projects', icon: FolderOpen },
      { label: 'Submit Project', href: '/projects/submit', icon: PlusCircle },
    ],
  },
  {
    section: 'Explore',
    items: [
      { label: 'Summon Factory', href: '/factory', icon: Factory },
      { label: 'Articles', href: '/research', icon: FileText },
    ],
  },
]

// Admin navigation
const adminNavItems: NavSection[] = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Seller', href: '/admin/sellers', icon: Users },
      { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
    ],
  },
  {
    section: 'Manage',
    items: [
      { label: 'Summon Factory', href: '/admin/products', icon: Factory },
      { label: 'Articles', href: '/admin/articles', icon: FileText },
    ],
  },
  {
    section: 'Communication',
    items: [
      { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Team', href: '/admin/team', icon: Users },
    ],
  },
  {
    section: 'Account',
    items: [{ label: 'Profile', href: '/admin/profile', icon: User }],
  },
]

export default function Sidebar({
  collapsed,
  onToggle,
  user,
}: {
  collapsed?: boolean
  onToggle?: () => void
  user: SidebarUser | null
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Determine which navigation to show based on route
  const isAdmin = pathname.startsWith('/admin')
  const currentNavItems = isAdmin ? adminNavItems : sellerNavItems

  const isActive = (href: string) => {
    if (isAdmin) {
      return href === '/admin' ? pathname === href : pathname.startsWith(href)
    }
    return href === '/dashboard' ? pathname === href : pathname.startsWith(href)
  }

  const handleLogout = () => {
    router.push('/login')
  }

  // Get display name and company from user
  const getUserDisplay = () => {
    if (!user) {
      return { name: 'Loading...', company: '' }
    }
    const name = user.name || user.email
    let company = ''
    if (user.seller) {
      company = user.seller.companyName
    } else if (user.adminTeam) {
      company = user.adminTeam.department
    }
    return { name, company }
  }

  const { name, company } = getUserDisplay()
  const userInitial = name ? name.charAt(0).toUpperCase() : 'U'

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Summon</span>
            {isAdmin ? null : <span className="sidebar-brand-sub">Seller Portal</span>}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle?.()
          }
        }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {currentNavItems.map((group) => (
          <div key={group.section}>
            {!collapsed && <div className="sidebar-section-label">{group.section}</div>}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item${isActive(item.href) ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={17} className="sidebar-item-icon" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </Link>
            ))}
          </div>
        ))}

        {/* Only show these for non-admin routes (they're in adminNavItems for admin) */}
        {!isAdmin && (
          <>
            <div className="sidebar-divider" />

            <Link
              href={`${isAdmin ? '/admin' : ''}/notifications`}
              className={`sidebar-item${isActive('/notifications') ? ' active' : ''}`}
              title={collapsed ? 'Notifications' : undefined}
            >
              <Bell size={17} className="sidebar-item-icon" />
              {!collapsed && <span>Notifications</span>}
            </Link>
            <Link
              href={`${isAdmin ? '/admin' : ''}/team`}
              className={`sidebar-item${isActive('/team') ? ' active' : ''}`}
              title={collapsed ? 'Team' : undefined}
            >
              <Users size={17} className="sidebar-item-icon" />
              {!collapsed && <span>Team</span>}
            </Link>
          </>
        )}

        <div className="sidebar-divider" />

        {/* Admin Panel - only show for admin route */}
        {isAdmin && (
          <Link
            href="/admin"
            className={`sidebar-item${isActive('/admin') ? ' active' : ''}`}
            title={collapsed ? 'Admin Panel' : undefined}
            style={{ background: isActive('/admin') ? 'var(--blue-50)' : undefined }}
          >
            <Shield size={17} className="sidebar-item-icon" />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        )}
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <div
          className={`sidebar-user${isActive('/profile') ? ' active-profile' : ''}`}
          onClick={() => router.push(`${isAdmin ? '/admin' : ''}/profile`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              router.push(`${isAdmin ? '/admin' : ''}/profile`)
            }
          }}
          style={{ cursor: 'pointer' }}
          title={collapsed ? `${name}${company ? ` (${company})` : ''}` : undefined}
          role="button"
          tabIndex={0}
          aria-label={`View ${name}'s profile`}
        >
          <div className="sidebar-avatar">{userInitial}</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{name}</div>
              <div className="sidebar-user-role">{company}</div>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleLogout()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                handleLogout()
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'auto',
            }}
            title="Sign Out"
            type="button"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
