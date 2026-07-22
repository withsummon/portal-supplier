import React from 'react'
import { desc, eq, inArray, sql } from 'drizzle-orm'
import { db } from '@/db'
import {
  adminTeamMembers,
  conversations,
  messages,
  notifications,
  sellers,
  users,
} from '@/db/schema'

export interface ConversationMessageDto {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  read: boolean
}

export interface ConversationDto {
  id: string
  participantName: string
  participantRole: string
  participantCompany: string | null
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: ConversationMessageDto[]
}

export interface NotificationDto {
  id: string
  type: string
  tab: string
  title: string
  description: string
  link: string | null
  meta: Record<string, unknown> | null
  unread: boolean
  createdAt: string
}

function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : new Date(0).toISOString()
}

function getNotificationTab(role: 'ADMIN' | 'SELLER', type: string) {
  if (role === 'ADMIN') {
    if (type === 'SELLER_REGISTRATION') return 'Registrations'
  }

  if (type === 'MESSAGE_RECEIVED') return 'Messages'
  if (
    type === 'PROJECT_SUBMITTED' ||
    type === 'PROJECT_ACCEPTED' ||
    type === 'PROJECT_REJECTED' ||
    type === 'PROJECT_CLARIFICATION'
  ) {
    return 'Project Updates'
  }

  return 'System'
}

function getParticipantRoleLabel(role: 'ADMIN' | 'SELLER') {
  if (role === 'ADMIN') return 'Summon Team'
  return 'Makelar'
}

export const getCachedUserConversations = React.cache(async (userId: string) => {
  const conversationRows = await db
    .select({
      id: conversations.id,
      participants: conversations.participants,
      lastMessage: conversations.lastMessage,
      lastAt: conversations.lastAt,
    })
    .from(conversations)
    .where(sql`${conversations.participants} ? ${userId}`)
    .orderBy(desc(conversations.lastAt))

  if (conversationRows.length === 0) {
    return [] as ConversationDto[]
  }

  const conversationIds = conversationRows.map((conversation) => conversation.id)
  const participantIds = Array.from(
    new Set(
      conversationRows
        .flatMap((conversation) => conversation.participants ?? [])
        .filter((participantId) => participantId !== userId),
    ),
  )

  const [messageRows, participantRows, sellerRows, adminRows] = await Promise.all([
    db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        senderName: users.name,
        senderEmail: users.email,
        content: messages.content,
        readBy: messages.readBy,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(inArray(messages.conversationId, conversationIds))
      .orderBy(messages.createdAt),
    participantIds.length > 0
      ? db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
          })
          .from(users)
          .where(inArray(users.id, participantIds))
      : Promise.resolve([]),
    participantIds.length > 0
      ? db
          .select({
            userId: sellers.userId,
            companyName: sellers.companyName,
          })
          .from(sellers)
          .where(inArray(sellers.userId, participantIds))
      : Promise.resolve([]),
    participantIds.length > 0
      ? db
          .select({
            userId: adminTeamMembers.userId,
            teamRole: adminTeamMembers.role,
          })
          .from(adminTeamMembers)
          .where(inArray(adminTeamMembers.userId, participantIds))
      : Promise.resolve([]),
  ])

  const participantMap = new Map(
    participantRows.map((participant) => [participant.id, participant]),
  )
  const sellerMap = new Map(sellerRows.map((seller) => [seller.userId, seller.companyName]))
  const adminMap = new Map(adminRows.map((admin) => [admin.userId, admin.teamRole]))
  const messageMap = new Map<string, ConversationMessageDto[]>()

  for (const message of messageRows) {
    const bucket = messageMap.get(message.conversationId) ?? []
    bucket.push({
      id: message.id,
      senderId: message.senderId,
      senderName: message.senderName ?? message.senderEmail,
      text: message.content,
      timestamp: toIsoString(message.createdAt),
      read: (message.readBy ?? []).includes(userId),
    })
    messageMap.set(message.conversationId, bucket)
  }

  return conversationRows.map((conversation) => {
    const otherParticipantId =
      (conversation.participants ?? []).find((participantId) => participantId !== userId) ?? userId
    const participant = participantMap.get(otherParticipantId)
    const participantRole = participant?.role ?? 'SELLER'
    const participantCompany =
      sellerMap.get(otherParticipantId) ?? (participantRole === 'ADMIN' ? 'Summon' : null)
    const participantName =
      participant?.name ?? participantCompany ?? participant?.email ?? 'Unknown Participant'
    const participantRoleLabel =
      participantRole === 'ADMIN'
        ? (adminMap.get(otherParticipantId) ?? getParticipantRoleLabel('ADMIN'))
        : getParticipantRoleLabel('SELLER')
    const conversationMessages = messageMap.get(conversation.id) ?? []
    const unreadCount = conversationMessages.filter(
      (message) => message.senderId !== userId && !message.read,
    ).length

    return {
      id: conversation.id,
      participantName,
      participantRole: participantRoleLabel,
      participantCompany,
      lastMessage: conversation.lastMessage ?? conversationMessages.at(-1)?.text ?? '',
      lastMessageTime: conversationMessages.at(-1)?.timestamp ?? toIsoString(conversation.lastAt),
      unreadCount,
      messages: conversationMessages,
    }
  })
})

export const getCachedUserNotifications = React.cache(
  async (userId: string, role: 'ADMIN' | 'SELLER') => {
    const rows = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        title: notifications.title,
        content: notifications.content,
        link: notifications.link,
        meta: notifications.meta,
        read: notifications.read,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      tab: getNotificationTab(role, row.type),
      title: row.title,
      description: row.content ?? '',
      link: row.link,
      meta: typeof row.meta === 'string' ? JSON.parse(row.meta) : (row.meta ?? null),
      unread: !row.read,
      createdAt: toIsoString(row.createdAt),
    })) satisfies NotificationDto[]
  },
)
