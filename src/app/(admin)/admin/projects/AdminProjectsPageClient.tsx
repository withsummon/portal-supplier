'use client'

import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  MessageSquare,
  Search,
  Send,
  User,
  X,
  XCircle,
} from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { useAdminProjects } from '@/hooks/use-admin-projects'
import type { AdminProjectDto } from '@/lib/data/project-workflows'
import { formatDate, formatDateTime, priorityLabels } from '@/lib/utils/data'

const STATUS_CONFIG: Record<
  AdminProjectDto['status'],
  { label: string; color: string; background: string; icon: LucideIcon }
> = {
  submitted: {
    label: 'Submitted',
    color: 'var(--blue-600)',
    background: 'var(--blue-50)',
    icon: Clock,
  },
  under_review: {
    label: 'Under Review',
    color: 'var(--color-purple)',
    background: 'var(--color-purple-bg)',
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    color: 'var(--color-success)',
    background: 'var(--color-success-bg)',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--color-danger)',
    background: 'var(--color-danger-bg)',
    icon: XCircle,
  },
  need_clarification: {
    label: 'Need Clarification',
    color: 'var(--color-warning)',
    background: 'var(--color-warning-bg)',
    icon: AlertCircle,
  },
  in_progress: {
    label: 'In Progress',
    color: 'var(--color-info)',
    background: 'var(--blue-50)',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    color: 'var(--color-success)',
    background: 'var(--color-success-bg)',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'var(--text-muted)',
    background: 'var(--neutral-100)',
    icon: XCircle,
  },
}

export default function AdminProjectsPageClient({
  initialProjects,
}: {
  initialProjects: AdminProjectDto[]
}) {
  const {
    actionModal,
    actionNote,
    closeActionModal,
    closeProject,
    filteredProjects,
    isPending,
    openProject,
    projects,
    queueAction,
    searchQuery,
    selectedProject,
    setActionNote,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    submitAction,
  } = useAdminProjects(initialProjects)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Review and manage supplier project submissions.</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const Icon = config.icon
          const count = projects.filter((project) => project.status === status).length

          return (
            <button
              key={status}
              type="button"
              className="card"
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setStatusFilter(statusFilter === status ? 'all' : status)
                }
              }}
              style={{
                padding: 'var(--sp-4)',
                cursor: 'pointer',
                textAlign: 'left',
                border:
                  statusFilter === status
                    ? '2px solid var(--blue-600)'
                    : '1px solid var(--border-default)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                <Icon size={16} style={{ color: config.color }} />
                <span
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: config.color,
                    fontWeight: 'var(--fw-semibold)',
                  }}
                >
                  {config.label}
                </span>
              </div>
              <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{count}</div>
            </button>
          )
        })}
      </div>

      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
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
              className="input"
              placeholder="Search by project, seller, or reference..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <select
            className="select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Seller</th>
                <th>Budget</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Quotes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const status = STATUS_CONFIG[project.status]
                const Icon = status.icon

                return (
                  <tr key={project.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 'var(--fw-semibold)' }}>{project.name}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {project.projectId} · {project.category}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 'var(--fw-medium)' }}>{project.supplier}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {project.supplierEmail}
                        </div>
                      </div>
                    </td>
                    <td>{project.budget || '-'}</td>
                    <td>{priorityLabels[project.priority] ?? project.priority}</td>
                    <td>
                      <span
                        className={`badge badge-${project.status === 'accepted' ? 'accepted' : project.status === 'rejected' ? 'rejected' : 'submitted'}`}
                      >
                        <Icon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td>{project.quotes.length}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          type="button"
                          onClick={() => openProject(project.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              openProject(project.id)
                            }
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          type="button"
                          onClick={() => queueAction(project.id, 'clarify')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              queueAction(project.id, 'clarify')
                            }
                          }}
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedProject} onClose={closeProject} maxWidth="960px">
        {selectedProject && (
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
                  {selectedProject.name}
                </h2>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  {selectedProject.projectId} · Submitted {formatDate(selectedProject.submittedAt)}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={closeProject}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    closeProject()
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
                      {selectedProject.description}
                    </p>
                    {selectedProject.requirements && (
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
                          {selectedProject.requirements}
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
                      {selectedProject.comments.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                          No messages yet.
                        </div>
                      ) : (
                        selectedProject.comments.map((comment) => (
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
                        { icon: User, label: 'Seller', value: selectedProject.supplier },
                        { icon: FileText, label: 'Category', value: selectedProject.category },
                        { icon: DollarSign, label: 'Budget', value: selectedProject.budget || '-' },
                        {
                          icon: Calendar,
                          label: 'Timeline',
                          value: `${formatDate(selectedProject.startDate)} - ${formatDate(selectedProject.endDate)}`,
                        },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                          <Icon
                            size={16}
                            style={{ color: 'var(--text-muted)', marginTop: '2px' }}
                          />
                          <div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                              {label}
                            </div>
                            <div
                              style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}
                            >
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
                      {selectedProject.notes.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                          No review notes yet.
                        </div>
                      ) : (
                        selectedProject.notes.map((note) => (
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
                    onClick={() => queueAction(selectedProject.id, 'accept')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        queueAction(selectedProject.id, 'accept')
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
                    onClick={() => queueAction(selectedProject.id, 'clarify')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        queueAction(selectedProject.id, 'clarify')
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
                    onClick={() => queueAction(selectedProject.id, 'reject')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        queueAction(selectedProject.id, 'reject')
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

      <Modal isOpen={!!actionModal} onClose={closeActionModal} maxWidth="520px">
        {actionModal && (
          <>
            <h2
              id="action-modal-title"
              style={{
                fontSize: 'var(--fs-xl)',
                fontWeight: 'var(--fw-bold)',
                marginBottom: 'var(--sp-3)',
              }}
            >
              {actionModal.action === 'accept'
                ? 'Accept Project'
                : actionModal.action === 'reject'
                  ? 'Reject Project'
                  : 'Request Clarification'}
            </h2>
            <p
              style={{
                fontSize: 'var(--fs-sm)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--sp-4)',
              }}
            >
              This note will be stored in project history and sent to the seller.
            </p>
            <textarea
              className="input input-textarea"
              rows={6}
              placeholder="Add a review note..."
              value={actionNote}
              onChange={(event) => setActionNote(event.target.value)}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--sp-3)',
                marginTop: 'var(--sp-5)',
              }}
            >
              <button
                className="btn btn-secondary"
                type="button"
                onClick={closeActionModal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    closeActionModal()
                  }
                }}
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                disabled={isPending}
                onClick={submitAction}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    submitAction()
                  }
                }}
              >
                <Send size={14} />
                {isPending ? 'Saving...' : 'Confirm'}
              </button>
            </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
