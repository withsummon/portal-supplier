'use client'

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
import { formatUSDtoIDR } from '@/lib/currency'

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
}: {
  stats: AdminStatDto
  activities: AdminActivityDto[]
  pendingActions: Array<{ id: string; title: string; count: number; priority: string }>
}) {
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--neutral-50)',
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
    </div>
  )
}
