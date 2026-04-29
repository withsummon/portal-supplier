'use client'

import { useState } from 'react'
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
  CheckCircle,
  Shield,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import type { NotificationDto } from '@/lib/data/communications'
import { approveSeller, rejectSeller, approveVendor, rejectVendor } from '@/lib/actions/members'
import { markNotificationRead } from '@/lib/actions/communications'

type NotificationIconConfig = {
  icon: LucideIcon
  iconColor: string
  bgColor: string
}

const notificationIconMap: Record<string, NotificationIconConfig> = {
  PROJECT_SUBMITTED: { icon: FolderOpen, iconColor: 'var(--blue-600)', bgColor: 'var(--blue-50)' },
  PROJECT_ACCEPTED: { icon: Check, iconColor: 'var(--color-success)', bgColor: 'var(--color-success-bg)' },
  PROJECT_REJECTED: { icon: XCircle, iconColor: 'var(--color-danger)', bgColor: 'var(--color-danger-bg)' },
  PROJECT_CLARIFICATION: { icon: AlertTriangle, iconColor: 'var(--color-warning)', bgColor: 'var(--color-warning-bg)' },
  MESSAGE_RECEIVED: { icon: MessageSquare, iconColor: 'var(--color-purple)', bgColor: 'var(--color-purple-bg)' },
  QUOTE_RECEIVED: { icon: TrendingUp, iconColor: 'var(--color-success)', bgColor: 'var(--color-success-bg)' },
  SELLER_REGISTRATION: { icon: Shield, iconColor: 'var(--color-info)', bgColor: 'var(--blue-50)' },
  VENDOR_REGISTRATION: { icon: Shield, iconColor: 'var(--color-info)', bgColor: 'var(--blue-50)' },
  SYSTEM: { icon: Info, iconColor: 'var(--text-muted)', bgColor: 'var(--neutral-50)' },
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

export default function AdminNotificationsPageClient({
  initialNotifications,
}: {
  initialNotifications: NotificationDto[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [notificationList, setNotificationList] = useState(initialNotifications)

  const tabs = ['All', ...Array.from(new Set(notificationList.map((n) => n.tab)))]

  const filteredNotifications =
    activeTab === 'All' ? notificationList : notificationList.filter((n) => n.tab === activeTab)

  const unreadCount = notificationList.filter((n) => n.unread).length

  function handleMarkRead(notificationId: string) {
    setNotificationList((current) =>
      current.map((n) => (n.id === notificationId ? { ...n, unread: false } : n)),
    )
    void markNotificationRead(notificationId)
  }

  function handleMarkAllRead() {
    setNotificationList((current) => current.map((n) => ({ ...n, unread: false })))
  }

  async function handleApprove(notificationId: string, meta: Record<string, unknown> | null) {
    if (!meta?.profileId || !meta?.role) return
    setPendingAction(notificationId)
    try {
      if (meta.role === 'SELLER') {
        await approveSeller(meta.profileId as string)
      } else {
        await approveVendor(meta.profileId as string)
      }
      setNotificationList((current) => current.filter((n) => n.id !== notificationId))
      router.refresh()
    } finally {
      setPendingAction(null)
    }
  }

  async function handleReject(notificationId: string, meta: Record<string, unknown> | null) {
    if (!meta?.profileId || !meta?.role) return
    setPendingAction(notificationId)
    try {
      if (meta.role === 'SELLER') {
        await rejectSeller(meta.profileId as string)
      } else {
        await rejectVendor(meta.profileId as string)
      }
      setNotificationList((current) => current.filter((n) => n.id !== notificationId))
      router.refresh()
    } finally {
      setPendingAction(null)
    }
  }

  const registrationTypes = new Set(['SELLER_REGISTRATION', 'VENDOR_REGISTRATION'])

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Review platform activity, registration requests, and project updates.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{ gap: '6px' }}
        >
          <Check size={14} />
          Mark all as read
        </button>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--sp-5)' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab(tab)}
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
                {notificationList.filter((n) => n.tab === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type)
            const isRegistration = registrationTypes.has(notification.type)
            const isLoading = pendingAction === notification.id

            return (
              <div
                key={notification.id}
                className="card"
                style={{
                  padding: 'var(--sp-5)',
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

                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                    {notification.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {notification.description}
                  </p>

                  {isRegistration && !isLoading && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 'var(--sp-3)',
                        marginTop: 'var(--sp-4)',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => handleApprove(notification.id, notification.meta)}
                        style={{ gap: '6px' }}
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        type="button"
                        onClick={() => handleReject(notification.id, notification.meta)}
                        style={{ gap: '6px' }}
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '12px' }}
                        >
                          View details <ChevronRight size={12} />
                        </Link>
                      )}
                    </div>
                  )}

                  {isRegistration && isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--sp-4)', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <Loader2 size={14} className="animate-spin" />
                      Processing...
                    </div>
                  )}

                  {!isRegistration && notification.link && (
                    <Link
                      href={notification.link}
                      onClick={() => handleMarkRead(notification.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--blue-600)',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginTop: '12px',
                      }}
                    >
                      <span>Open details</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
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
