'use client';

import { TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { monthlySubmissions, revenuePipeline, categoryBreakdown } from '@/lib/mock-data';

export default function InsightsCharts() {
    const maxSubmissions = Math.max(...monthlySubmissions.map(m => m.submissions));
    const maxRevenue = revenuePipeline.total;

    const formatCurrency = (val: number) =>
        val >= 1000 ? `$${(val / 1000).toFixed(0)}K` : `$${val}`;

    return (
        <div className="insights-section">
            {/* Section Header */}
            <div className="insights-header">
                <div>
                    <h2 className="insights-title">Business Insights</h2>
                    <p className="insights-subtitle">Your partnership performance at a glance — Founder&apos;s View</p>
                </div>
            </div>

            <div className="insights-grid">
                {/* — Submission Trend Chart — */}
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
                            {monthlySubmissions.map((m) => (
                                <div key={m.month} className="bar-chart-col">
                                    <div className="bar-chart-value">{m.submissions}</div>
                                    <div className="bar-chart-bar-wrapper">
                                        <div
                                            className="bar-chart-bar"
                                            style={{
                                                height: `${(m.submissions / maxSubmissions) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="bar-chart-label">{m.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* — Revenue Pipeline — */}
                <div className="card insight-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                            <div className="insight-icon insight-icon-green">
                                <DollarSign size={15} />
                            </div>
                            <div className="card-title">Revenue Pipeline</div>
                        </div>
                        <span className="insight-total">{formatCurrency(revenuePipeline.total)}</span>
                    </div>
                    <div className="card-body">
                        <div className="pipeline-items">
                            {/* Accepted */}
                            <div className="pipeline-item">
                                <div className="pipeline-item-header">
                                    <span className="pipeline-label">
                                        <span className="pipeline-dot" style={{ background: revenuePipeline.accepted.color }} />
                                        {revenuePipeline.accepted.label}
                                    </span>
                                    <span className="pipeline-value">{formatCurrency(revenuePipeline.accepted.value)}</span>
                                </div>
                                <div className="pipeline-bar-track">
                                    <div
                                        className="pipeline-bar-fill pipeline-bar-accepted"
                                        style={{ width: `${(revenuePipeline.accepted.value / maxRevenue) * 100}%` }}
                                    />
                                </div>
                            </div>
                            {/* In Progress */}
                            <div className="pipeline-item">
                                <div className="pipeline-item-header">
                                    <span className="pipeline-label">
                                        <span className="pipeline-dot" style={{ background: revenuePipeline.inProgress.color }} />
                                        {revenuePipeline.inProgress.label}
                                    </span>
                                    <span className="pipeline-value">{formatCurrency(revenuePipeline.inProgress.value)}</span>
                                </div>
                                <div className="pipeline-bar-track">
                                    <div
                                        className="pipeline-bar-fill pipeline-bar-progress"
                                        style={{ width: `${(revenuePipeline.inProgress.value / maxRevenue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Summary row */}
                        <div className="pipeline-summary">
                            <div className="pipeline-summary-item">
                                <span className="pipeline-summary-label">Win Rate</span>
                                <span className="pipeline-summary-value" style={{ color: 'var(--color-success)' }}>
                                    {((revenuePipeline.accepted.value / maxRevenue) * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="pipeline-summary-item">
                                <span className="pipeline-summary-label">Avg. Deal</span>
                                <span className="pipeline-summary-value">{formatCurrency(maxRevenue / 5)}</span>
                            </div>
                            <div className="pipeline-summary-item">
                                <span className="pipeline-summary-label">Total Deals</span>
                                <span className="pipeline-summary-value">5</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* — Category Distribution — */}
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
                        <div className="category-list">
                            {categoryBreakdown.map((cat) => (
                                <div key={cat.category} className="category-row">
                                    <div className="category-row-header">
                                        <span className="category-name">
                                            <span className="category-dot" style={{ background: cat.color }} />
                                            {cat.category}
                                        </span>
                                        <div className="category-stats">
                                            <span className="category-percent">{cat.percent}%</span>
                                            <span className="category-revenue">{formatCurrency(cat.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="category-bar-track">
                                        <div
                                            className="category-bar-fill"
                                            style={{ width: `${cat.percent}%`, background: cat.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
