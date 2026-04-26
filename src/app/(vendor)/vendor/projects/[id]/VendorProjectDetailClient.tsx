'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  MessageCircle,
  MessageSquare,
  Paperclip,
  Send,
  Tag,
  X,
} from 'lucide-react'
import { useVendorProjectDetail } from '@/hooks/use-vendor-project-detail'
import type { VendorProjectDetailDto } from '@/lib/data/project-workflows'
import { formatDate, formatDateTime, projectStatusLabels, priorityLabels } from '@/lib/utils/data'

function getDaysRemaining(endDate: string) {
  if (!endDate) {
    return 0
  }

  const diff = new Date(endDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function VendorProjectDetailClient({
  project,
}: {
  project: VendorProjectDetailDto
}) {
  const {
    activeTab,
    comments,
    existingQuote,
    isPending,
    newMessage,
    quoteDraft,
    sendMessage,
    setActiveTab,
    setNewMessage,
    setQuoteDraft,
    setShowBidForm,
    setShowChat,
    showBidForm,
    showChat,
    submitBid,
  } = useVendorProjectDetail(project)
  const daysLeft = getDaysRemaining(project.endDate)

  return (
    <div className="animate-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <Link href="/vendor/projects">
          <button className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={14} />
            Back to Projects
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-8)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          <div
            className="card"
            style={{
              padding: 'var(--sp-6)',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)',
              color: 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                marginBottom: 'var(--sp-4)',
              }}
            >
              <span className="badge badge-submitted">{projectStatusLabels[project.status]}</span>
              <span style={{ fontSize: 'var(--fs-sm)', opacity: 0.9 }}>
                {priorityLabels[project.priority]} priority
              </span>
            </div>
            <h1
              style={{
                fontSize: 'var(--fs-2xl)',
                fontWeight: 'var(--fw-bold)',
                marginBottom: 'var(--sp-3)',
              }}
            >
              {project.name}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-4)',
                flexWrap: 'wrap',
                fontSize: 'var(--fs-sm)',
                opacity: 0.95,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} />
                {project.category}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} />
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-default)',
              gap: 'var(--sp-1)',
            }}
          >
            {[
              { key: 'details', label: 'Details' },
              { key: 'deliverables', label: 'Deliverables' },
              { key: 'tech', label: 'Tech Stack' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  border: 'none',
                  background: 'none',
                  color: activeTab === tab.key ? 'var(--blue-600)' : 'var(--text-muted)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: activeTab === tab.key ? 'var(--fw-semibold)' : 'var(--fw-normal)',
                  cursor: 'pointer',
                  borderBottom:
                    activeTab === tab.key ? '2px solid var(--blue-600)' : '2px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="card">
              <div className="card-body">
                <h3
                  style={{
                    fontSize: 'var(--fs-base)',
                    fontWeight: 'var(--fw-bold)',
                    marginBottom: 'var(--sp-3)',
                  }}
                >
                  Project Overview
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--lh-relaxed)',
                    marginBottom: 'var(--sp-6)',
                  }}
                >
                  {project.description}
                </p>
                <h3
                  style={{
                    fontSize: 'var(--fs-base)',
                    fontWeight: 'var(--fw-bold)',
                    marginBottom: 'var(--sp-3)',
                  }}
                >
                  Requirements
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                  {project.requirements ?? 'No specific requirements provided.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="card">
              <div className="card-body">
                <h3
                  style={{
                    fontSize: 'var(--fs-base)',
                    fontWeight: 'var(--fw-bold)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  Key Deliverables
                </h3>
                {project.deliverables.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                    No deliverables have been specified for this project yet.
                  </p>
                ) : (
                  <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)' }}>
                    {project.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="card">
              <div className="card-body">
                <h3
                  style={{
                    fontSize: 'var(--fs-base)',
                    fontWeight: 'var(--fw-bold)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  Required Tech Stack
                </h3>
                {project.techStack.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                    No tech stack has been specified for this project yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                    {project.techStack.map((tech) => (
                      <span key={tech} className="chip selected">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {project.files.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Attachments</h2>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {project.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-3)',
                        padding: 'var(--sp-3)',
                        background: 'var(--neutral-50)',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    >
                      <FileText size={18} style={{ color: 'var(--text-muted)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {file.size}
                        </div>
                      </div>
                      <Download size={16} style={{ color: 'var(--text-muted)' }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div className="card">
            <div
              className="card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}
            >
              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--sp-1)',
                  }}
                >
                  Budget Range
                </div>
                <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>
                  {project.budgetRange || '-'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--sp-1)',
                  }}
                >
                  Timeline
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                  {daysLeft} days remaining
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--sp-1)',
                  }}
                >
                  Seller
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                  {project.seller.companyName}
                </div>
              </div>
              {existingQuote && (
                <div
                  style={{
                    padding: 'var(--sp-3)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--neutral-50)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--text-muted)',
                      marginBottom: '4px',
                    }}
                  >
                    Existing Proposal
                  </div>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                    {existingQuote.currency} {existingQuote.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                    {existingQuote.duration} days · {projectStatusLabels[existingQuote.status]}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setShowBidForm(true)}>
              Submit Proposal
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setShowChat(true)}>
              <MessageSquare size={16} />
              Message Summon Team
            </button>
          </div>
        </div>
      </div>

      {(showBidForm || showChat) && (
        <div
          onClick={() => {
            setShowBidForm(false)
            setShowChat(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 1000,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {showBidForm && (
        <div className="drawer-panel" style={{ zIndex: 1001 }}>
          <div className="drawer-header">
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
                Submit Proposal
              </h2>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                For: {project.name}
              </p>
            </div>
            <button onClick={() => setShowBidForm(false)} className="btn btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>
          <div className="drawer-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
              <div className="form-group">
                <label className="form-label">Bid Amount (USD)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 50000"
                  value={quoteDraft.amount}
                  onChange={(event) =>
                    setQuoteDraft((current) => ({ ...current, amount: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Days to Complete</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 90"
                  value={quoteDraft.duration}
                  onChange={(event) =>
                    setQuoteDraft((current) => ({ ...current, duration: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Proposal Details</label>
                <textarea
                  className="input input-textarea"
                  rows={10}
                  placeholder="Describe your approach, team highlights, and why you are the best fit."
                  value={quoteDraft.proposal}
                  onChange={(event) =>
                    setQuoteDraft((current) => ({ ...current, proposal: event.target.value }))
                  }
                />
              </div>
              <div
                style={{
                  padding: 'var(--sp-4)',
                  background: 'var(--blue-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--blue-100)',
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
                  <p
                    style={{
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--blue-800)',
                      lineHeight: 'var(--lh-relaxed)',
                    }}
                  >
                    Your latest proposal is stored on this project and visible to Summon admin and
                    the seller.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowBidForm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={submitBid}
                style={{ flex: 1 }}
                disabled={isPending}
              >
                {isPending ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChat && (
        <div className="drawer-panel" style={{ zIndex: 1001, width: '420px' }}>
          <div className="drawer-header">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <MessageCircle size={18} style={{ color: 'var(--blue-600)' }} />
                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
                  Chat with Summon Team
                </h2>
              </div>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                Re: {project.name}
              </p>
            </div>
            <button onClick={() => setShowChat(false)} className="btn btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>
          <div
            className="drawer-body"
            style={{ display: 'flex', flexDirection: 'column', padding: 0 }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--sp-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-4)',
              }}
            >
              {comments.map((comment) => {
                const isVendor = comment.authorRole === 'vendor'

                return (
                  <div
                    key={comment.id}
                    style={{
                      display: 'flex',
                      justifyContent: isVendor ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ maxWidth: '85%' }}>
                      {!isVendor && (
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: 'var(--fw-semibold)',
                            color: 'var(--blue-600)',
                            marginBottom: '4px',
                          }}
                        >
                          {comment.authorName}
                        </div>
                      )}
                      <div
                        style={{
                          padding: 'var(--sp-3) var(--sp-4)',
                          borderRadius: 'var(--radius-lg)',
                          background: isVendor ? 'var(--blue-600)' : 'var(--neutral-100)',
                          color: isVendor ? 'white' : 'var(--text-primary)',
                        }}
                      >
                        <p style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.5, margin: 0 }}>
                          {comment.message}
                        </p>
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          marginTop: '4px',
                          color: 'var(--text-muted)',
                          textAlign: isVendor ? 'right' : 'left',
                        }}
                      >
                        {formatDateTime(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                padding: 'var(--sp-4) var(--sp-5)',
                borderTop: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
              }}
            >
              <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                placeholder="Ask about this project..."
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
                className="input"
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={!newMessage.trim() || isPending}
                style={{ padding: '10px' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
