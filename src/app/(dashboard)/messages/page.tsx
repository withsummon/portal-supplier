import MessagesPageClient from './MessagesPageClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedUserConversations } from '@/lib/data/communications'

export default async function MessagesPage() {
  const user = await requireRole('SELLER')
  const conversations = await getCachedUserConversations(user.id)

  return (
    <MessagesPageClient
      currentUserId={user.id}
      initialConversations={conversations}
      pageTitle="Messages"
      pageSubtitle="Stay in sync with the Summon team and your project stakeholders."
    />
  )
}
