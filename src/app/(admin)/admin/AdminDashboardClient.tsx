'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  DollarSign,
  FolderOpen,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { AdminActivityDto, AdminStatDto } from '@/lib/data/admin'
import type { AdminProjectDto } from '@/lib/data/project-workflows'
import { formatUSDtoIDR } from '@/lib/currency'
import ProjectDetailModal from '@/components/admin/ProjectDetailModal'
import Modal from '@/components/ui/Modal'
import { Send } from 'lucide-react'

function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.floor(diff / 60000))
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  return `${Math.floor(hours / 24)} days ago`
}

const DASHBOARD_STAT_CARDS: Array<{
  title: string
  icon: LucideIcon
  background: string
  color: string
  getValue: (stats: AdminStatDto) => string
}> = [
  {
    title: 'Total Sellers',
    icon: Users,
    background: 'var(--blue-50)',
    color: 'var(--blue-600)',
    getValue: (stats) => String(stats.totalSellers),
  },
  {
    title: 'Total Vendors',
    icon: Users,
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    getValue: (stats) => String(stats.totalVendors),
  },
  {
    title: 'Active Projects',
    icon: FolderOpen,
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    getValue: (stats) => String(stats.activeProjects),
  },
  {
    title: 'Total Revenue',
    icon: DollarSign,
    background: 'var(--color-purple-bg)',
    color: 'var(--color-purple)',
    getValue: (stats) => formatUSDtoIDR(stats.totalRevenue),
  },
  {
    title: 'Conversion Rate',
    icon: TrendingUp,
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
    getValue: (stats) => `${stats.conversionRate}%`,
  },
]

export default function AdminDashboardClient({
  stats,
  activities,
  pendingActions,
  projects,
}: {
  stats: AdminStatDto
  activities: AdminActivityDto[]
  pendingActions: Array<{ id: string; title: string; count: number; priority: string }>
  projects: AdminProjectDto[]
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<{
    projectId: string
    action: 'accept' | 'reject' | 'clarify'
  } | null>(null)
  const [actionNote, setActionNote] = useState('')
  const [isPending, setIsPending] = useState(false)

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null

  function openProject(projectId: string) {
    setSelectedProjectId(projectId)
  }

  function closeProject() {
    setSelectedProjectId(null)
  }

  function queueAction(projectId: string, action: 'accept' | 'reject' | 'clarify') {
    setActionModal({ projectId, action })
    setActionNote('')
  }

  function closeActionModal() {
    setActionModal(null)
    setActionNote('')
  }

  async function submitAction() {
    if (!actionModal) return

    const requiresNote = actionModal.action !== 'accept'
    if (requiresNote && !actionNote.trim()) return

    setIsPending(true)
    try {
      const { reviewProjectSubmission } = await import('@/lib/actions/projects')
      const result = await reviewProjectSubmission({
        projectId: actionModal.projectId,
        action: actionModal.action,
        note: actionNote,
      })

      if ('error' in result) {
        setIsPending(false)
        return
      }

      setProjects((current) =>
        current.map((project) =>
          project.id === result.id
            ? {
                ...project,
                status: result.status as AdminProjectDto['status'],
                notes: [
                  {
                    id: result.note.id,
                    text: result.note.text,
                    by: 'Admin',
                    at: new Date().toISOString(),
                    type: 'status_change' as const,
                  },
                  ...project.notes,
                ],
              }
            : project,
        ),
      )
      setActionModal(null)
      setActionNote('')
      setSelectedProjectId(null)
    } finally {
      setIsPending(false)
    }
  }

  function setProjects(_fn: (current: AdminProjectDto[]) => AdminProjectDto[]) {
    // no-op: projects prop is immutable, we use local state for optimistic updates
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Platform performance and recent activity overview.</p>
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
        {DASHBOARD_STAT_CARDS.map(({ title, icon: Icon, background, color, getValue }) => (
          <div key={title} className="card" style={{ padding: 'var(--sp-5)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--sp-4)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} style={{ color }} />
              </div>
            </div>
            <div
              style={{
                fontSize: 'var(--fs-2xl)',
                fontWeight: 'var(--fw-bold)',
                marginBottom: '4px',
              }}
            >
              {getValue(stats)}
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{title}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <h3
            style={{
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              marginBottom: 'var(--sp-5)',
            }}
          >
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                role={activity.type === 'project' ? 'button' : undefined}
                tabIndex={activity.type === 'project' ? 0 : undefined}
                onClick={() => {
                  if (activity.type === 'project') {
                    const projectId = activity.id.replace('project-', '')
                    openProject(projectId)
                  }
                }}
                onKeyDown={(e) => {
                  if (activity.type === 'project' && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    const projectId = activity.id.replace('project-', '')
                    openProject(projectId)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--neutral-50)',
                  cursor: activity.type === 'project' ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (activity.type === 'project') {
                    e.currentTarget.style.background = 'var(--neutral-100)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--neutral-50)'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background:
                      activity.type === 'project' ? 'var(--color-success-bg)' : 'var(--blue-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {activity.type === 'project' ? (
                    <FolderOpen size={18} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <Users size={18} style={{ color: 'var(--blue-600)' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                    {activity.action}
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                    {activity.subject}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatRelative(activity.time)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <h3
            style={{
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              marginBottom: 'var(--sp-5)',
            }}
          >
            Pending Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {pendingActions.map((action) => (
              <div
                key={action.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--sp-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  {action.priority === 'high' ? (
                    <AlertCircle size={20} style={{ color: 'var(--color-danger)' }} />
                  ) : action.priority === 'medium' ? (
                    <CheckCircle size={20} style={{ color: 'var(--color-warning)' }} />
                  ) : (
                    <Activity size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                    {action.title}
                  </span>
                </div>
                <span className="badge badge-submitted">{action.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={closeProject}
        onAction={queueAction}
        isPending={isPending}
      />

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
          </>
        )}
      </Modal>
    </div>
  )
}
