'use client'

import { TrendingUp, ReceiptText, PieChart } from 'lucide-react'
import { formatIDR } from '@/lib/currency'

interface MonthlyData {
  month: string
  submissions: number
  revenue: number
}

interface CategoryData {
  category: string
  count: number
  revenue: number
  percent: number
}

interface PipelineData {
  accepted: { label: string; value: number; color: string }
  inProgress: { label: string; value: number; color: string }
  total: number
}

interface Props {
  monthlyData: MonthlyData[]
  categoryData: CategoryData[]
  pipelineData: PipelineData
}

const CATEGORY_COLORS = [
  'var(--blue-500)',
  'var(--color-success)',
  'var(--color-purple)',
  'var(--color-warning)',
  'var(--color-danger)',
  'var(--blue-400)',
  'var(--color-info)',
]

export default function InsightsCharts({ monthlyData, categoryData, pipelineData }: Props) {
  const maxSubmissions =
    monthlyData.length > 0 ? Math.max(...monthlyData.map((m) => m.submissions), 1) : 1
  const maxRevenue = pipelineData.total || 1

  return (
    <div className="insights-section">
      <div className="insights-header">
        <div>
          <h2 className="insights-title">Business Insights</h2>
          <p className="insights-subtitle">
            Your partnership performance at a glance — Founder&apos;s View
          </p>
        </div>
      </div>

      <div className="insights-grid">
        {/* Submission Trend Chart */}
        <div className="card insight-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <div className="insight-icon insight-icon-blue">
                <TrendingUp size={15} />
              </div>
              <div className="card-title">Submission Trends</div>
            </div>
            <span className="insight-period">Last 6 months</span>
          </div>
          <div className="card-body">
            <div className="bar-chart">
              {monthlyData.map((m) => (
                <div key={m.month} className="bar-chart-col">
                  <div className="bar-chart-value">{m.submissions}</div>
                  <div className="bar-chart-bar-wrapper">
                    <div
                      className="bar-chart-bar"
                      style={{
                        height: `${Math.max((m.submissions / maxSubmissions) * 100, 2)}%`,
                      }}
                    />
                  </div>
                  <div className="bar-chart-label">{m.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Pipeline */}
        <div className="card insight-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <div className="insight-icon insight-icon-green">
                <ReceiptText size={15} />
              </div>
              <div className="card-title">Revenue Pipeline</div>
            </div>
            <span className="insight-total">{formatIDR(pipelineData.total)}</span>
          </div>
          <div className="card-body">
            <div className="pipeline-items">
              <div className="pipeline-item">
                <div className="pipeline-item-header">
                  <span className="pipeline-label">
                    <span
                      className="pipeline-dot"
                      style={{ background: pipelineData.accepted.color }}
                    />
                    {pipelineData.accepted.label}
                  </span>
                  <span className="pipeline-value">{formatIDR(pipelineData.accepted.value)}</span>
                </div>
                <div className="pipeline-bar-track">
                  <div
                    className="pipeline-bar-fill pipeline-bar-accepted"
                    style={{
                      width: `${Math.max((pipelineData.accepted.value / maxRevenue) * 100, 1)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="pipeline-item">
                <div className="pipeline-item-header">
                  <span className="pipeline-label">
                    <span
                      className="pipeline-dot"
                      style={{ background: pipelineData.inProgress.color }}
                    />
                    {pipelineData.inProgress.label}
                  </span>
                  <span className="pipeline-value">{formatIDR(pipelineData.inProgress.value)}</span>
                </div>
                <div className="pipeline-bar-track">
                  <div
                    className="pipeline-bar-fill pipeline-bar-progress"
                    style={{
                      width: `${Math.max((pipelineData.inProgress.value / maxRevenue) * 100, 1)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pipeline-summary">
              <div className="pipeline-summary-item">
                <span className="pipeline-summary-label">Win Rate</span>
                <span className="pipeline-summary-value" style={{ color: 'var(--color-success)' }}>
                  {pipelineData.total > 0
                    ? ((pipelineData.accepted.value / pipelineData.total) * 100).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
              <div className="pipeline-summary-item">
                <span className="pipeline-summary-label">Avg. Deal</span>
                <span className="pipeline-summary-value">
                  {formatIDR(maxRevenue / Math.max(categoryData.length, 1))}
                </span>
              </div>
              <div className="pipeline-summary-item">
                <span className="pipeline-summary-label">Total Deals</span>
                <span className="pipeline-summary-value">{categoryData.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card insight-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <div className="insight-icon insight-icon-purple">
                <PieChart size={15} />
              </div>
              <div className="card-title">Category Distribution</div>
            </div>
          </div>
          <div className="card-body">
            {categoryData.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 'var(--sp-8)',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                No category data available yet.
              </div>
            ) : (
              <div className="category-list">
                {categoryData.map((cat, i) => (
                  <div key={cat.category} className="category-row">
                    <div className="category-row-header">
                      <span className="category-name">
                        <span
                          className="category-dot"
                          style={{
                            background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                          }}
                        />
                        {cat.category}
                      </span>
                      <div className="category-stats">
                        <span className="category-percent">{cat.percent}%</span>
                        <span className="category-revenue">{formatIDR(cat.revenue)}</span>
                      </div>
                    </div>
                    <div className="category-bar-track">
                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${Math.max(cat.percent, 1)}%`,
                          background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
