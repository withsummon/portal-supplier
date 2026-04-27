import React from 'react'
import Link from 'next/link'
import {
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import StatusBadge from '@/components/projects/StatusBadge'
import InsightsCharts from '@/components/dashboard/InsightsCharts'
import { formatDate, dbToMockStatus } from '@/lib/utils/data'
import {
  getCachedAllProjects,
  getCachedSeller,
  getCachedMonthlyData,
  getCachedCategoryData,
  getCachedPipelineData,
} from '@/lib/data/projects'

// ============================================================
// STATIC CONFIG (hoisted outside component)
// ============================================================

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  need_clarification: 'Need Clarification',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

const STATUS_ITEMS = [
  { status: 'submitted', icon: FolderOpen, color: 'var(--blue-500)' },
  { status: 'under_review', icon: Clock, color: 'var(--color-warning)' },
  { status: 'need_clarification', icon: AlertCircle, color: 'var(--color-purple)' },
  { status: 'accepted', icon: CheckCircle, color: 'var(--color-success)' },
  { status: 'rejected', icon: XCircle, color: 'var(--color-danger)' },
] as const

import { requireRole } from '@/lib/auth/session'

// ============================================================
// PAGE (server component - parallel fetch, no inline db calls)
// ============================================================

export default async function DashboardPage() {
  const user = await requireRole('SELLER')
  const sellerId = user.seller?.id

  // Start promises early, await late — parallel fetching (async-parallel)
  const [allProjects, seller, monthlyData, categoryData, pipelineData] = await Promise.all([
    getCachedAllProjects(sellerId),
    getCachedSeller(user.id),
    getCachedMonthlyData(sellerId),
    getCachedCategoryData(sellerId),
    getCachedPipelineData(sellerId),
  ])

  const total = allProjects.length
  const submitted = allProjects.filter((p) => p.status === 'SUBMITTED').length
  const underReview = allProjects.filter((p) => p.status === 'UNDER_REVIEW').length
  const accepted = allProjects.filter((p) => p.status === 'ACCEPTED').length
  const rejected = allProjects.filter((p) => p.status === 'REJECTED').length
  const needClarification = allProjects.filter((p) => p.status === 'NEED_CLARIFICATION').length
  const recentProjects = allProjects.slice(0, 5)
  const sellerName = seller?.user?.name ?? 'User'

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good evening, {sellerName.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">
            Here&apos;s an overview of your project activity on Summon Supplier Portal.
          </p>
        </div>
        <Link href="/projects/submit">
          <button className="btn btn-primary" style={{ gap: '8px' }}>
            <Plus size={15} />
            Submit New Project
          </button>
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-blue">
              <TrendingUp size={18} />
            </div>
            <span
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--color-success)',
                fontWeight: 'var(--fw-semibold)',
                background: 'var(--color-success-bg)',
                border: '1px solid var(--color-success-border)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              All time
            </span>
          </div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-label">Total Projects</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-blue">
              <FolderOpen size={18} />
            </div>
          </div>
          <div className="kpi-value">{submitted}</div>
          <div className="kpi-label">Newly Submitted</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">{underReview + needClarification}</div>
          <div className="kpi-label">In Progress / Review</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-green">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="kpi-value">{accepted}</div>
          <div className="kpi-label">Accepted</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-red">
              <XCircle size={18} />
            </div>
          </div>
          <div className="kpi-value">{rejected}</div>
          <div className="kpi-label">Rejected</div>
        </div>
      </div>

      <InsightsCharts
        monthlyData={monthlyData}
        categoryData={categoryData}
        pipelineData={pipelineData}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 'var(--sp-6)',
        }}
      >
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Projects</div>
              <div className="card-subtitle">Your latest project submissions</div>
            </div>
            <Link href="/projects">
              <button className="btn btn-ghost btn-sm" style={{ gap: '4px' }}>
                View all <ArrowRight size={13} />
              </button>
            </Link>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div style={{ fontWeight: 'var(--fw-semibold)', marginBottom: '2px' }}>
                        {project.name}
                      </div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {project.clientName ?? '—'} · {project.projectId}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{project.category}</td>
                    <td>
                      <StatusBadge
                        status={
                          (dbToMockStatus[project.status] ?? project.status) as
                            | 'submitted'
                            | 'under_review'
                            | 'accepted'
                            | 'rejected'
                            | 'need_clarification'
                            | 'in_progress'
                            | 'completed'
                            | 'cancelled'
                        }
                      />
                    </td>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(project.createdAt)}
                    </td>
                    <td>
                      <Link href={`/projects/${project.id}`}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0 8px' }}>
                          <ChevronRight size={14} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div
              className="card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}
            >
              <Link href="/projects/submit" style={{ width: '100%' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--sp-3)' }}
                >
                  <Plus size={15} />
                  Submit New Project
                </button>
              </Link>
              <Link href="/projects" style={{ width: '100%' }}>
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--sp-3)' }}
                >
                  <FolderOpen size={15} />
                  View All Projects
                </button>
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Status Breakdown</div>
            </div>
            <div
              className="card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}
            >
              {STATUS_ITEMS.map(({ status, icon: Icon, color }) => {
                const count =
                  status === 'submitted'
                    ? submitted
                    : status === 'under_review'
                      ? underReview
                      : status === 'need_clarification'
                        ? needClarification
                        : status === 'accepted'
                          ? accepted
                          : rejected
                return (
                  <div
                    key={status}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}
                  >
                    <Icon size={15} style={{ color, flexShrink: 0 }} />
                    <span
                      style={{ flex: 1, fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 'var(--fw-semibold)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {seller && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Company Profile</div>
              </div>
              <div className="card-body">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-3)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--blue-100)',
                      color: 'var(--blue-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'var(--fw-bold)',
                      fontSize: 'var(--fs-md)',
                      flexShrink: 0,
                    }}
                  >
                    {seller.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                      {seller.companyName}
                    </div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                      {seller.industry}
                    </div>
                  </div>
                </div>
                {[
                  { label: 'Contact', value: seller.user?.email ?? '—' },
                  { label: 'Size', value: seller.companySize ?? '—' },
                  { label: 'Member since', value: formatDate(seller.createdAt) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--sp-2) 0',
                      borderBottom: '1px solid var(--border-default)',
                      gap: 'var(--sp-2)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-secondary)',
                        textAlign: 'right',
                        wordBreak: 'break-word',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
