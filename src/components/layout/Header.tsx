'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, HelpCircle, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'
import ReportIssueModal from '../modals/ReportIssueModal'
import type { NotificationDto } from '@/lib/data/communications'

const breadcrumbMap: Record<string, { parent?: string; label: string }> = {
  '/dashboard': { label: 'Dashboard' },
  '/projects': { parent: 'Dashboard', label: 'My Projects' },
  '/projects/submit': { parent: 'My Projects', label: 'Submit Project' },
  '/notifications': { parent: 'Dashboard', label: 'Notifications' },
  '/factory': { label: 'Summon Factory' },
  '/research': { label: 'Research' },
  '/profile': { label: 'My Profile' },
  '/wiki': { parent: 'Help', label: 'Summon Wiki' },
}

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function Header({
  notifications,
  sidebarCollapsed,
  userRole,
}: {
  notifications: NotificationDto[]
  sidebarCollapsed?: boolean
  userRole?: 'ADMIN' | 'SELLER' | undefined
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const notificationBasePath = userRole === 'ADMIN' ? '/admin/notifications' : '/notifications'

  // Refs for outside click handling
  const notifRef = useRef<HTMLDivElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Match dynamic routes like /projects/[id] and /admin/projects/[id]
  let crumb = breadcrumbMap[pathname]
  if (!crumb) {
    if (pathname.startsWith('/projects/') && pathname !== '/projects/submit') {
      crumb = { parent: 'My Projects', label: 'Project Detail' }
    } else if (pathname.startsWith('/admin/projects/')) {
      crumb = { parent: 'All Projects', label: 'Project Detail' }
    } else {
      crumb = { label: 'Portal' }
    }
  }

  return (
    <header className={`portal-header${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        {crumb.parent && (
          <>
            <span className="header-breadcrumb-item">{crumb.parent}</span>
            <span className="header-breadcrumb-sep">/</span>
          </>
        )}
        <span className="header-breadcrumb-current">{crumb.label}</span>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <div className="header-search">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Search projects..." />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className={`header-icon-btn${showNotifications ? ' active' : ''}`}
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {notifications.some((notification) => notification.unread) && (
              <span className="header-notif-dot" />
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span>Notifications</span>
                <button onClick={() => setShowNotifications(false)}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.slice(0, 5).map((notification) => (
                  <button
                    key={notification.id}
                    className="dropdown-item"
                    type="button"
                    onClick={() => {
                      router.push(notification.link ?? notificationBasePath)
                      setShowNotifications(false)
                    }}
                  >
                    <span className="dropdown-item-title">{notification.title}</span>
                    <span className="dropdown-item-desc">{notification.description}</span>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '4px',
                      }}
                    >
                      <span className="dropdown-item-time">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                      <span className="dropdown-item-link">Click here for details →</span>
                    </div>
                  </button>
                ))}
                {notifications.length === 0 && (
                  <div className="dropdown-item">
                    <span className="dropdown-item-title">No notifications</span>
                    <span className="dropdown-item-desc">You are all caught up.</span>
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: 'var(--sp-2)',
                  borderTop: '1px solid var(--border-default)',
                  textAlign: 'center',
                }}
              >
                <Link
                  href={notificationBasePath}
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--blue-600)',
                    fontWeight: 'var(--fw-medium)',
                  }}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div style={{ position: 'relative' }} ref={helpRef}>
          <button
            className={`header-icon-btn${showHelp ? ' active' : ''}`}
            aria-label="Help"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle size={18} />
          </button>

          {showHelp && (
            <div className="dropdown-menu" style={{ width: '240px' }}>
              <div className="dropdown-header">
                <span>Support & Help</span>
              </div>
              <button
                className="dropdown-item"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--sp-3)' }}
                onClick={() => {
                  setShowReportModal(true)
                  setShowHelp(false)
                }}
              >
                <AlertCircle size={16} color="var(--blue-600)" />
                <div style={{ textAlign: 'left' }}>
                  <div className="dropdown-item-title">Report Issue</div>
                  <div className="dropdown-item-desc">Found a bug or need help?</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <ReportIssueModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
    </header>
  )
}
