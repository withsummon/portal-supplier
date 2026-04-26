'use client';

import {
    DollarSign,
    Clock,
    CheckCircle,
    Briefcase,
    Zap,
    ArrowRight,
    ChevronRight,
    Tag,
    Calendar,
} from 'lucide-react';
import { mockProjects, mockQuotes, mockVendor, formatDate } from '@/lib/mock-data';
import StatusBadge from '@/components/projects/StatusBadge';
import Link from 'next/link';

const CATEGORY_COLORS: Record<string, string> = {
    'Web Development': '#2563eb',
    'Mobile App': '#7c3aed',
    'Data & AI': '#059669',
    'Cloud Infrastructure': '#d97706',
    'Design': '#dc2626',
};

function getBannerGradient(category: string): string {
    const gradients: Record<string, string> = {
        'Web Development': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)',
        'Mobile App': 'linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #a78bfa 100%)',
        'Data & AI': 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
        'Cloud Infrastructure': 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
        'Design': 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)',
    };
    return gradients[category] || gradients['Web Development'];
}

export default function VendorDashboard() {
    const availableCount = mockProjects.filter(p => p.status === 'accepted' || p.status === 'submitted').length;
    const activeBids = mockQuotes.filter(q => q.status === 'pending').length;
    const wonProjects = mockQuotes.filter(q => q.status === 'accepted').length;
    const totalEarnings = mockQuotes
        .filter(q => q.status === 'accepted')
        .reduce((sum, q) => sum + q.amount, 0);

    const availableProjects = mockProjects
        .filter(p => p.status === 'accepted' || p.status === 'submitted')
        .slice(0, 3);

    const recentQuotes = [...mockQuotes]
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5);

    return (
        <div className="animate-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Welcome back, {mockVendor.name.split(' ')[0]}!</h1>
                    <p className="page-subtitle">You have {activeBids} active proposals and {availableCount} new opportunities today.</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                    <Link href="/vendor/projects">
                        <button className="btn btn-primary">
                            Browse Projects <ArrowRight size={15} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid" style={{ marginBottom: 'var(--sp-6)' }}>
                {[
                    { label: 'Open Opportunities', value: availableCount, icon: Zap, color: 'var(--blue-600)' },
                    { label: 'Active Proposals', value: activeBids, icon: Briefcase, color: 'var(--color-warning)' },
                    { label: 'Projects Won', value: wonProjects, icon: CheckCircle, color: 'var(--color-success)' },
                    { label: 'Total Revenue', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'var(--color-purple)' },
                ].map((stat, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-card-top">
                            <div className="kpi-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                <stat.icon size={18} />
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>This month</span>
                        </div>
                        <div className="kpi-value">{stat.value}</div>
                        <div className="kpi-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--sp-6)' }}>
                {/* Available Projects Quick View */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">Recommended Projects</h2>
                            <p className="card-subtitle">Based on your industry focus</p>
                        </div>
                        <Link href="/vendor/projects">
                            <button className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></button>
                        </Link>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                        {availableProjects.map((project) => (
                            <Link href={`/vendor/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--sp-4)',
                                    padding: 'var(--sp-4)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl)',
                                    transition: 'all 200ms ease',
                                    cursor: 'pointer',
                                    background: 'white',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-200)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                                }}
                                >
                                    {/* Left accent with gradient */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: 'var(--radius-lg)',
                                        background: getBannerGradient(project.category),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Briefcase size={24} style={{ color: 'white', opacity: 0.8 }} />
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-1)' }}>
                                            <h3 style={{
                                                fontSize: 'var(--fs-sm)',
                                                fontWeight: 'var(--fw-bold)',
                                                color: 'var(--text-primary)',
                                                lineHeight: 1.3,
                                            }}>
                                                {project.name}
                                            </h3>
                                            <StatusBadge status={project.status} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                background: `${CATEGORY_COLORS[project.category]}15`,
                                                color: CATEGORY_COLORS[project.category],
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '10px',
                                                fontWeight: 'var(--fw-semibold)',
                                            }}>
                                                {project.category}
                                            </span>
                                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>via Summon</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: 'var(--sp-3)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <DollarSign size={12} /> {project.budgetRange}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={12} /> {formatDate(project.startDate)}
                                                </span>
                                            </div>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: 'var(--blue-600)',
                                                fontSize: 'var(--fs-xs)',
                                                fontWeight: 'var(--fw-semibold)',
                                            }}>
                                                Bid Now <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Quotes Status */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Proposals</h2>
                    </div>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentQuotes.map((quote) => (
                                    <tr key={quote.id}>
                                        <td style={{ minWidth: '160px' }}>
                                            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.projectName}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formatDate(quote.submittedAt)}</div>
                                        </td>
                                        <td>
                                            <StatusBadge status={quote.status} type="quote" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: 'var(--sp-4)', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
                         <Link href="/vendor/quotes">
                            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}>View All Proposals</button>
                         </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
