'use client'

import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Search,
} from 'lucide-react'
import StatusBadge from '@/components/projects/StatusBadge'
import Link from 'next/link'
import { useState } from 'react'

interface Quote {
  id: string
  projectId: string
  projectName: string
  amount: number
  currency: string
  status: string
  submittedAt: string
}

interface Props {
  quotes: Quote[]
}

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function MyQuotesPage({ quotes }: Props) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredQuotes = quotes.filter((q) =>
    q.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = [
    { label: 'Total Bids', value: quotes.length, icon: Clock, color: 'var(--blue-600)' },
    {
      label: 'Pending',
      value: quotes.filter((q) => q.status === 'pending').length,
      icon: AlertCircle,
      color: 'var(--color-warning)',
    },
    {
      label: 'Won',
      value: quotes.filter((q) => q.status === 'accepted').length,
      icon: CheckCircle,
      color: 'var(--color-success)',
    },
    {
      label: 'Rejected',
      value: quotes.filter((q) => q.status === 'rejected').length,
      icon: XCircle,
      color: 'var(--color-danger)',
    },
  ]

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Quotes</h1>
          <p className="page-subtitle">Track and manage your submitted project proposals.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--sp-6)' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="kpi-card">
            <div className="kpi-card-top">
              <div
                className="kpi-icon"
                style={{ background: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon size={18} />
              </div>
            </div>
            <div className="kpi-value">{stat.value}</div>
            <div className="kpi-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="card">
        <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-6)' }}>
          <div
            className="header-search"
            style={{
              border: 'none',
              background: 'var(--neutral-50)',
              width: '100%',
              maxWidth: '360px',
            }}
          >
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Bid Amount</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td>
                    <div style={{ fontWeight: 'var(--fw-semibold)' }}>{quote.projectName}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                      {quote.id}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 'var(--fw-bold)' }}>
                      {quote.currency === 'USD' ? '$' : 'Rp'} {quote.amount.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <StatusBadge
                      status={quote.status as 'pending' | 'accepted' | 'rejected' | 'withdrawn'}
                      type="quote"
                    />
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(quote.submittedAt)}
                  </td>
                  <td>
                    <div
                      style={{ display: 'flex', gap: 'var(--sp-2)', justifyContent: 'flex-end' }}
                    >
                      <Link href={`/vendor/projects/${quote.projectId}`}>
                        <button className="btn btn-ghost btn-sm" title="View Project">
                          <ExternalLink size={14} />
                        </button>
                      </Link>
                      <button className="btn btn-ghost btn-sm">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
