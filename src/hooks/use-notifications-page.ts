'use client'

import { useMemo, useState, useTransition } from 'react'
import { markAllNotificationsRead, markNotificationRead } from '@/lib/actions/communications'
import type { NotificationDto } from '@/lib/data/communications'

export function useNotificationsPage(initialNotifications: NotificationDto[]) {
  const [notifications, setNotifications] = useState<NotificationDto[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState('All')
  const [isPending, startTransition] = useTransition()

  const tabs = useMemo(
    () => ['All', ...Array.from(new Set(initialNotifications.map((item) => item.tab)))],
    [initialNotifications],
  )

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'All') {
      return notifications
    }

    return notifications.filter((notification) => notification.tab === activeTab)
  }, [activeTab, notifications])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  )

  function handleMarkAllRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    )

    startTransition(() => {
      void markAllNotificationsRead()
    })
  }

  function handleMarkRead(notificationId: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification,
      ),
    )

    startTransition(() => {
      void markNotificationRead(notificationId)
    })
  }

  return {
    activeTab,
    filteredNotifications,
    handleMarkAllRead,
    handleMarkRead,
    isPending,
    setActiveTab,
    tabs,
    unreadCount,
  }
}
