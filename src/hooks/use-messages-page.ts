'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { markConversationRead, sendConversationMessage } from '@/lib/actions/communications'
import type { ConversationDto } from '@/lib/data/communications'

export function useMessagesPage(initialConversations: ConversationDto[], currentUserId: string) {
  const [conversations, setConversations] = useState<ConversationDto[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversations[0]?.id ?? '',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [messageDraft, setMessageDraft] = useState('')
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return conversations
    }

    return conversations.filter((conversation) => {
      const haystacks = [
        conversation.participantName,
        conversation.participantRole,
        conversation.participantCompany ?? '',
        conversation.lastMessage,
      ]

      return haystacks.some((value) => value.toLowerCase().includes(query))
    })
  }, [conversations, searchQuery])

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  function selectConversation(conversationId: string) {
    const conversation = conversations.find((item) => item.id === conversationId)

    if (conversation?.unreadCount) {
      setConversations((currentConversations) =>
        currentConversations.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item,
        ),
      )

      startTransition(() => {
        void markConversationRead(conversationId)
      })
    }

    setActiveConversationId(conversationId)
  }

  function handleSendMessage() {
    if (!activeConversation || !messageDraft.trim()) {
      return
    }

    const nextDraft = messageDraft.trim()
    setMessageDraft('')

    const optimisticMessage = {
      id: `optimistic-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'You',
      text: nextDraft,
      timestamp: new Date().toISOString(),
      read: true,
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              lastMessage: nextDraft,
              lastMessageTime: optimisticMessage.timestamp,
              messages: [...conversation.messages, optimisticMessage],
            }
          : conversation,
      ),
    )

    startTransition(() => {
      void sendConversationMessage({
        conversationId: activeConversation.id,
        content: nextDraft,
      }).then((serverMessage) => {
        setConversations((currentConversations) =>
          currentConversations.map((conversation) =>
            conversation.id === activeConversation.id
              ? {
                  ...conversation,
                  lastMessage: serverMessage.text,
                  lastMessageTime: serverMessage.timestamp,
                  messages: conversation.messages.map((message) =>
                    message.id === optimisticMessage.id ? serverMessage : message,
                  ),
                }
              : conversation,
          ),
        )
      })
    })
  }

  return {
    activeConversation,
    conversations: filteredConversations,
    currentUserId,
    isPending,
    messageDraft,
    messagesEndRef,
    searchQuery,
    selectConversation,
    setMessageDraft,
    setSearchQuery,
    handleSendMessage,
  }
}
