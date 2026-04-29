'use client'

import {
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  MessageSquare,
  User,
  X,
  XCircle,
} from 'lucide-react'
import type { AdminProjectDto } from '@/lib/data/project-workflows'
import { formatDate, formatDateTime } from '@/lib/utils/data'
import Modal from '@/components/ui/Modal'

interface ProjectDetailModalProps {
  project: AdminProjectDto | null
  isOpen: boolean
  onClose: () => void
  onAction: (projectId: string, action: 'accept' | 'reject' | 'clarify') => void
  isPending?: boolean
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onAction,
  isPending = false,
}: ProjectDetailModalProps) {
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
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
