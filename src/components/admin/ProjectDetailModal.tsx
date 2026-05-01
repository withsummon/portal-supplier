'use client'

import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  PlayCircle,
  User,
  X,
  XCircle,
} from 'lucide-react'
import type { AdminProjectDto } from '@/lib/data/project-workflows'
import { formatDate, formatDateTime } from '@/lib/utils/data'
import Modal from '@/components/ui/Modal'

type ActionType = 'accept' | 'reject' | 'clarify' | 'start' | 'complete' | 'lunas' | 'acceptQuote' | 'rejectQuote'

interface ProjectDetailModalProps {
  project: AdminProjectDto | null
  isOpen: boolean
  onClose: () => void
  onAction: (projectId: string, action: ActionType, quoteId?: string) => void
  isPending?: boolean
}

const QUOTE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onAction,
  isPending = false,
}: ProjectDetailModalProps) {
  const status = project?.status

  const showReviewActions = status === 'submitted' || status === 'under_review'
  const showStartButton = status === 'accepted'
  const showCompleteButton = status === 'in_progress'
  const showLunasButton = status === 'completed'

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="960px">
      {project && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 'var(--sp-4)',
              marginBottom: 'var(--sp-5)',
            }}
          >
            <div>
              <h2
                id="project-detail-title"
                style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}
              >
                {project.name}
              </h2>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                {project.projectId} · Submitted {formatDate(project.submittedAt)}
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClose()
                }
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'var(--sp-6)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div className="card" style={{ margin: 0 }}>
                <div className="card-header">
                  <div className="card-title">Overview</div>
                </div>
                <div className="card-body">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                    {project.description}
                  </p>
                  {project.requirements && (
                    <>
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          marginTop: 'var(--sp-5)',
                          marginBottom: 'var(--sp-2)',
                        }}
                      >
                        Requirements
                      </div>
                      <p
                        style={{
                          color: 'var(--text-secondary)',
                          lineHeight: 'var(--lh-relaxed)',
                        }}
                      >
                        {project.requirements}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <div className="card-header">
                  <div className="card-title">Discussion</div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {project.comments.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                        No messages yet.
                      </div>
                    ) : (
                      project.comments.map((comment) => (
                        <div
                          key={comment.id}
                          style={{
                            paddingBottom: 'var(--sp-3)',
                            borderBottom: '1px solid var(--border-default)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 'var(--fs-xs)',
                              color: 'var(--text-muted)',
                              marginBottom: '4px',
                            }}
                          >
                            {comment.authorName} · {formatDateTime(comment.createdAt)}
                          </div>
                          <div style={{ fontSize: 'var(--fs-sm)' }}>{comment.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {project.quotes.length > 0 && (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card-header">
                    <div className="card-title">
                      Vendor Quotes ({project.quotes.length})
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                      {project.quotes.map((quote) => (
                        <div
                          key={quote.id}
                          style={{
                            padding: 'var(--sp-3)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--sp-2)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: 'var(--fw-semibold)',
                                  fontSize: 'var(--fs-sm)',
                                }}
                              >
                                {quote.vendorName}
                              </div>
                              <div
                                style={{
                                  fontSize: 'var(--fs-xs)',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                {formatDateTime(quote.submittedAt)} · {quote.duration} days
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  fontWeight: 'var(--fw-bold)',
                                  color: 'var(--blue-600)',
                                  fontSize: 'var(--fs-sm)',
                                }}
                              >
                                Rp {Number(quote.amount).toLocaleString('id-ID')}
                              </div>
                              <span
                                style={{
                                  fontSize: 'var(--fs-xs)',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  background:
                                    quote.status === 'accepted'
                                      ? 'var(--color-success-bg)'
                                      : quote.status === 'rejected'
                                        ? 'var(--color-danger-bg)'
                                        : 'var(--neutral-100)',
                                  color:
                                    quote.status === 'accepted'
                                      ? 'var(--color-success)'
                                      : quote.status === 'rejected'
                                        ? 'var(--color-danger)'
                                        : 'var(--text-muted)',
                                }}
                              >
                                {QUOTE_STATUS_LABELS[quote.status] ?? quote.status}
                              </span>
                            </div>
                          </div>
                          {quote.proposal && (
                            <p
                              style={{
                                fontSize: 'var(--fs-xs)',
                                color: 'var(--text-secondary)',
                                lineHeight: 'var(--lh-relaxed)',
                              }}
                            >
                              {quote.proposal.length > 150
                                ? quote.proposal.slice(0, 150) + '...'
                                : quote.proposal}
                            </p>
                          )}
                          {quote.status === 'pending' && (
                            <div
                              style={{
                                display: 'flex',
                                gap: 'var(--sp-2)',
                                marginTop: 'var(--sp-1)',
                              }}
                            >
                              <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                disabled={isPending}
                                onClick={() =>
                                  onAction(project.id, 'acceptQuote', quote.id)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onAction(project.id, 'acceptQuote', quote.id)
                                  }
                                }}
                              >
                                <CheckCircle size={12} />
                                Accept
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                type="button"
                                disabled={isPending}
                                onClick={() =>
                                  onAction(project.id, 'rejectQuote', quote.id)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onAction(project.id, 'rejectQuote', quote.id)
                                  }
                                }}
                              >
                                <XCircle size={12} />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div className="card" style={{ margin: 0 }}>
                <div className="card-header">
                  <div className="card-title">Quick Info</div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    {[
                      { icon: User, label: 'Seller', value: project.supplier },
                      { icon: FileText, label: 'Category', value: project.category },
                      { icon: DollarSign, label: 'Budget', value: project.budget || '-' },
                      {
                        icon: Calendar,
                        label: 'Timeline',
                        value: `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`,
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                        <Icon size={16} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                            {label}
                          </div>
                          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <div className="card-header">
                  <div className="card-title">Review Notes</div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {project.notes.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                        No review notes yet.
                      </div>
                    ) : (
                      project.notes.map((note) => (
                        <div
                          key={note.id}
                          style={{
                            paddingBottom: 'var(--sp-3)',
                            borderBottom: '1px solid var(--border-default)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 'var(--fs-xs)',
                              color: 'var(--text-muted)',
                              marginBottom: '4px',
                            }}
                          >
                            {note.by} · {formatDateTime(note.at)}
                          </div>
                          <div style={{ fontSize: 'var(--fs-sm)' }}>{note.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {showReviewActions && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--sp-3)',
                  }}
                >
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={isPending}
                    onClick={() => onAction(project.id, 'accept')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onAction(project.id, 'accept')
                      }
                    }}
                  >
                    <CheckCircle size={14} />
                    Accept
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={isPending}
                    onClick={() => onAction(project.id, 'clarify')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onAction(project.id, 'clarify')
                      }
                    }}
                  >
                    <MessageSquare size={14} />
                    Clarify
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={isPending}
                    onClick={() => onAction(project.id, 'reject')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onAction(project.id, 'reject')
                      }
                    }}
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              )}

              {showStartButton && (
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={isPending}
                  onClick={() => onAction(project.id, 'start')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onAction(project.id, 'start')
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <PlayCircle size={14} />
                  Start Project
                </button>
              )}

              {showCompleteButton && (
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={isPending}
                  onClick={() => onAction(project.id, 'complete')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onAction(project.id, 'complete')
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <CheckCircle size={14} />
                  Mark Complete
                </button>
              )}

              {showLunasButton && (
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={isPending}
                  onClick={() => onAction(project.id, 'lunas')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onAction(project.id, 'lunas')
                    }
                  }}
                  style={{ width: '100%', background: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                >
                  <Clock size={14} />
                  Mark Lunas (Paid)
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
