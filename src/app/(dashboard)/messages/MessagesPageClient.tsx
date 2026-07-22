'use client'

import Link from 'next/link'
import { MessageSquare, MoreVertical, Search, Send, User } from 'lucide-react'
import type { ConversationDto } from '@/lib/data/communications'
import { useMessagesPage } from '@/hooks/use-messages-page'

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function MessagesPageClient({
  currentUserId,
  initialConversations,
  pageTitle,
  pageSubtitle,
}: {
  currentUserId: string
  initialConversations: ConversationDto[]
  pageTitle: string
  pageSubtitle: string
}) {
  const {
    activeConversation,
    conversations,
    handleSendMessage,
    isPending,
    messageDraft,
    messagesEndRef,
    searchQuery,
    selectConversation,
    setMessageDraft,
    setSearchQuery,
  } = useMessagesPage(initialConversations, currentUserId)

  return (
    <div
      className="animate-in"
      style={{ height: 'calc(100vh - 140px)', display: 'flex', gap: 'var(--sp-4)' }}
    >
      <div
        className="card"
        style={{
          width: '340px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--border-default)' }}>
          <h1
            style={{
              fontSize: 'var(--fs-xl)',
              fontWeight: 'var(--fw-bold)',
              marginBottom: 'var(--sp-1)',
            }}
          >
            {pageTitle}
          </h1>
          <p
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-4)',
            }}
          >
            {pageSubtitle}
          </p>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '10px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="input"
              style={{ paddingLeft: '36px', fontSize: 'var(--fs-sm)' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => selectConversation(conversation.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: 'var(--sp-4) var(--sp-5)',
                cursor: 'pointer',
                background:
                  activeConversation?.id === conversation.id ? 'var(--blue-50)' : 'transparent',
                border: 'none',
                borderLeft:
                  activeConversation?.id === conversation.id
                    ? '3px solid var(--blue-600)'
                    : '3px solid transparent',
                borderBottom: '1px solid var(--border-default)',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--blue-100)',
                    color: 'var(--blue-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'var(--fw-bold)',
                    fontSize: 'var(--fs-sm)',
                    flexShrink: 0,
                  }}
                >
                  {conversation.participantName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2px',
                    }}
                  >
                    <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                      {conversation.participantName}
                    </span>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                      {formatTimestamp(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--text-muted)',
                      marginBottom: '2px',
                    }}
                  >
                    {conversation.participantRole}
                    {conversation.participantCompany ? ` · ${conversation.participantCompany}` : ''}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 'var(--sp-2)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
                      }}
                    >
                      {conversation.lastMessage}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span
                        style={{
                          background: 'var(--blue-600)',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'var(--fw-bold)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-full)',
                          minWidth: '18px',
                          textAlign: 'center',
                        }}
                      >
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {conversations.length === 0 && (
            <div style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
              <MessageSquare size={28} style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)', marginTop: 'var(--sp-3)' }}>
                No conversations yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className="card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {activeConversation ? (
          <>
            <div
              style={{
                padding: 'var(--sp-4) var(--sp-5)',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--blue-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--blue-600)',
                  }}
                >
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                    {activeConversation.participantName}
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                    {activeConversation.participantRole}
                    {activeConversation.participantCompany
                      ? ` · ${activeConversation.participantCompany}`
                      : ''}
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" type="button">
                <MoreVertical size={16} />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--sp-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
              }}
            >
              {activeConversation.messages.map((message) => {
                const isOwnMessage = message.senderId === currentUserId

                return (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: 'var(--sp-3) var(--sp-4)',
                        borderRadius: 'var(--radius-lg)',
                        background: isOwnMessage ? 'var(--blue-600)' : 'var(--neutral-100)',
                        color: isOwnMessage ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          opacity: 0.85,
                          marginBottom: '4px',
                        }}
                      >
                        {isOwnMessage ? 'You' : message.senderName}
                      </div>
                      <div style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                        {message.text}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          opacity: 0.7,
                          marginTop: '6px',
                          textAlign: 'right',
                        }}
                      >
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: 'var(--sp-4)', borderTop: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                <textarea
                  className="input"
                  placeholder="Write a message..."
                  rows={2}
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  style={{ resize: 'vertical' }}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isPending || !messageDraft.trim()}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 'var(--sp-3)',
            }}
          >
            <MessageSquare size={36} style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>Select a conversation to continue.</p>
            <Link
              href="/notifications"
              style={{ color: 'var(--blue-600)', fontSize: 'var(--fs-sm)' }}
            >
              Check notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
