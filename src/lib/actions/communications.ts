'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { conversations, messages, notifications } from '@/db/schema'
import { getCurrentUserRecord, requireSession } from '@/lib/auth/session'

function revalidateCommunicationPaths() {
  revalidatePath('/messages')
  revalidatePath('/notifications')
  revalidatePath('/vendor/messages')
  revalidatePath('/vendor/notifications')
  revalidatePath('/admin/messages')
  revalidatePath('/admin/notifications')
}

export async function sendConversationMessage(input: { conversationId: string; content: string }) {
  const session = await requireSession()
  const content = input.content.trim()

  if (!content) {
    throw new Error('Message cannot be empty.')
  }

  const conversation = await db
    .select({
      id: conversations.id,
      participants: conversations.participants,
    })
    .from(conversations)
    .where(eq(conversations.id, input.conversationId))
    .limit(1)

  const currentConversation = conversation[0]

  if (!currentConversation) {
    throw new Error('Conversation not found.')
  }

  if (!(currentConversation.participants ?? []).includes(session.user.id)) {
    throw new Error('You do not have access to this conversation.')
  }

  const [insertedMessage] = await db
    .insert(messages)
    .values({
      conversationId: input.conversationId,
      senderId: session.user.id,
      content,
      readBy: [session.user.id],
      type: 'TEXT',
    })
    .returning({
      id: messages.id,
      senderId: messages.senderId,
      content: messages.content,
      createdAt: messages.createdAt,
    })

  await db
    .update(conversations)
    .set({
      lastMessage: content,
      lastAt: new Date(),
    })
    .where(eq(conversations.id, input.conversationId))

  revalidateCommunicationPaths()

  return {
    id: insertedMessage?.id ?? '',
    senderId: insertedMessage?.senderId ?? session.user.id,
    senderName: session.user.name ?? session.user.email,
    text: insertedMessage?.content ?? content,
    timestamp: insertedMessage?.createdAt.toISOString() ?? new Date().toISOString(),
    read: true,
  }
}

export async function markConversationRead(conversationId: string) {
  const session = await requireSession()
  const rows = await db
    .select({
      id: messages.id,
      readBy: messages.readBy,
    })
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        sql`${messages.senderId} <> ${session.user.id}`,
      ),
    )

  const unreadRows = rows.filter((row) => !(row.readBy ?? []).includes(session.user.id))

  if (unreadRows.length === 0) {
    return { updated: 0 }
  }

  await db.transaction(async (tx) => {
    for (const row of unreadRows) {
      await tx
        .update(messages)
        .set({
          readBy: Array.from(new Set([...(row.readBy ?? []), session.user.id])),
        })
        .where(eq(messages.id, row.id))
    }
  })

  revalidateCommunicationPaths()

  return { updated: unreadRows.length }
}

export async function markNotificationRead(notificationId: string) {
  const user = await getCurrentUserRecord()

  if (!user) {
    throw new Error('Unauthorized')
  }

  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, user.id)))

  revalidateCommunicationPaths()
}

export async function markAllNotificationsRead() {
  const user = await getCurrentUserRecord()

  if (!user) {
    throw new Error('Unauthorized')
  }

  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, user.id), eq(notifications.read, false)))

  revalidateCommunicationPaths()
}
