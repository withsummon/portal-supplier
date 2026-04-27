'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  Clock,
  FolderOpen,
  Info,
  Mail,
  MessageSquare,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { NotificationDto } from '@/lib/data/communications'
import { useNotificationsPage } from '@/hooks/use-notifications-page'

type NotificationIconConfig = {
  icon: LucideIcon
  iconColor: string
  bgColor: string
}

const notificationIconMap: Record<string, NotificationIconConfig> = {
  PROJECT_SUBMITTED: {
    icon: FolderOpen,
    iconColor: 'var(--blue-600)',
    bgColor: 'var(--blue-50)',
  },
  PROJECT_ACCEPTED: {
    icon: Check,
    iconColor: 'var(--color-success)',
    bgColor: 'var(--color-success-bg)',
  },
  PROJECT_REJECTED: {
    icon: XCircle,
    iconColor: 'var(--color-danger)',
    bgColor: 'var(--color-danger-bg)',
  },
  PROJECT_CLARIFICATION: {
    icon: AlertTriangle,
    iconColor: 'var(--color-warning)',
    bgColor: 'var(--color-warning-bg)',
  },
  MESSAGE_RECEIVED: {
    icon: MessageSquare,
    iconColor: 'var(--color-purple)',
    bgColor: 'var(--color-purple-bg)',
  },
  QUOTE_RECEIVED: {
    icon: TrendingUp,
    iconColor: 'var(--color-success)',
    bgColor: 'var(--color-success-bg)',
  },
  SYSTEM: {
    icon: Info,
    iconColor: 'var(--text-muted)',
    bgColor: 'var(--neutral-50)',
  },
}

const defaultNotificationIcon: NotificationIconConfig = {
  icon: Info,
  iconColor: 'var(--text-muted)',
  bgColor: 'var(--neutral-50)',
}

function getNotificationIcon(type: string): NotificationIconConfig {
  return notificationIconMap[type] ?? defaultNotificationIcon
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function NotificationsPageClient({
  email,
  initialNotifications,
  pageSubtitle,
}: {
  email: string
  initialNotifications: NotificationDto[]
  pageSubtitle: string
}) {
  const {
    activeTab,
    filteredNotifications,
    handleMarkAllRead,
    handleMarkRead,
    isPending,
    setActiveTab,
    tabs,
    unreadCount,
  } = useNotificationsPage(initialNotifications)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleMarkAllRead}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleMarkAllRead()
            }
          }}
          disabled={isPending || unreadCount === 0}
          style={{ gap: '6px' }}
        >
          <Check size={14} />
          Mark all as read
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          padding: 'var(--sp-3) var(--sp-4)',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--sp-5)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-success)',
          fontWeight: 600,
        }}
      >
        <Mail size={14} />
        Email notifications are enabled for {email}
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--sp-5)' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab(tab)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActiveTab(tab)
              }
            }}
          >
            {tab}
            {tab !== 'All' && (
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '10px',
                  background: activeTab === tab ? 'var(--blue-100)' : 'var(--neutral-100)',
                  color: activeTab === tab ? 'var(--blue-700)' : 'var(--text-muted)',
                  padding: '0 6px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                }}
              >
                {initialNotifications.filter((notification) => notification.tab === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type)

            return (
              <Link
                key={notification.id}
                href={notification.link ?? '#'}
                onClick={() => handleMarkRead(notification.id)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="card notification-item-hover"
                  style={{
                    padding: 'var(--sp-5)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 'var(--sp-4)',
                    transition: 'all var(--transition-fast)',
                    position: 'relative',
                  }}
                >
                  {notification.unread && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'var(--sp-5)',
                        left: '8px',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--blue-500)',
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: iconConfig.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <iconConfig.icon size={22} style={{ color: iconConfig.iconColor }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {notification.tab}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                        }}
                      >
                        <Clock size={12} />
                        <span>{formatTimestamp(notification.createdAt)}</span>
                      </div>
                    </div>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '6px',
                      }}
                    >
                      {notification.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        marginBottom: '12px',
                      }}
                    >
                      {notification.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--blue-600)',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      <span>Open details</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="card" style={{ padding: 'var(--sp-12)', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--neutral-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--sp-4)',
              }}
            >
              <Bell size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No notifications in this category</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              We&apos;ll notify you when something important happens.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
