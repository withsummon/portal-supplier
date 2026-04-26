import MessagesPageClient from '@/app/(dashboard)/messages/MessagesPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserConversations } from '@/lib/data/communications'

export default async function VendorMessagesPage() {
  const user = await requireRole('VENDOR')
  const conversations = await getCachedUserConversations(user.id)

  return (
    <MessagesPageClient
      currentUserId={user.id}
      initialConversations={conversations}
      pageTitle="Messages"
      pageSubtitle="Manage conversations with the Summon team around bids and project clarifications."
    />
  )
}
