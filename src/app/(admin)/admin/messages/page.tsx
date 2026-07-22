import MessagesPageClient from '@/app/(dashboard)/messages/MessagesPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserConversations } from '@/lib/data/communications'

export default async function AdminMessagesPage() {
  const user = await requireRole('ADMIN')
  const conversations = await getCachedUserConversations(user.id)

  return (
    <MessagesPageClient
      currentUserId={user.id}
      initialConversations={conversations}
      pageTitle="Messages"
      pageSubtitle="Review and respond to seller conversations in one queue."
    />
  )
}
