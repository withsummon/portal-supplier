'use client'

import { Clock, Paperclip, Send } from 'lucide-react'
import { useProjectComments } from '@/hooks/use-project-comments'
import type { ProjectCommentDto } from '@/lib/data/project-workflows'
import { formatDateTime } from '@/lib/utils/data'

export default function ProjectComments({
  projectId,
  projectStatus,
  initialComments,
}: {
  projectId: string
  projectStatus: string
  initialComments: ProjectCommentDto[]
}) {
  const { comments, isPending, message, sendComment, setMessage } = useProjectComments(
    projectId,
    initialComments,
  )

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Messages &amp; Clarifications</div>
        <span
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-muted)',
            background: 'var(--neutral-100)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {comments.length}
        </span>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: 'var(--sp-5)' }}>
          {comments.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--sp-8)',
                color: 'var(--text-muted)',
                fontSize: 'var(--fs-sm)',
              }}
            >
              No messages yet. Start a conversation with the Summon team.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {comments.map((comment) => {
                const isSeller = comment.authorRole === 'seller'

                return (
                  <div
                    key={comment.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isSeller ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: 'var(--sp-3) var(--sp-4)',
                        borderRadius: 'var(--radius-lg)',
                        background: isSeller ? 'var(--blue-600)' : 'var(--neutral-50)',
                        color: isSeller ? 'white' : 'var(--text-primary)',
                        border: isSeller ? 'none' : '1px solid var(--border-default)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                          marginBottom: '4px',
                          opacity: isSeller ? 0.85 : 1,
                          color: isSeller ? undefined : 'var(--text-muted)',
                        }}
                      >
                        {comment.authorName}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--fs-sm)',
                          lineHeight: 'var(--lh-relaxed)',
                        }}
                      >
                        {comment.message}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Clock size={10} />
                      <span>{formatDateTime(comment.createdAt)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div
          style={{
            padding: 'var(--sp-4) var(--sp-5)',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--neutral-50)',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          }}
        >
          {projectStatus === 'need_clarification' && (
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--color-purple)',
                fontWeight: 'var(--fw-semibold)',
                marginBottom: 'var(--sp-3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-purple)',
                  flexShrink: 0,
                }}
              />
              Admin is waiting for your response
            </div>
          )}
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button className="btn btn-ghost btn-sm" title="Attach file" style={{ flexShrink: 0 }}>
              <Paperclip size={15} />
            </button>
            <input
              className="input"
              placeholder="Type your reply to the Summon team..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendComment()
                }
              }}
              style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={sendComment}
              disabled={!message.trim() || isPending}
              style={{ flexShrink: 0, gap: '6px' }}
            >
              <Send size={14} />
              {isPending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
