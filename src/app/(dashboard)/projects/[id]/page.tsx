import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, FileText, Download, Calendar, DollarSign,
    Flag, User, CheckCircle, Clock, AlertCircle, XCircle
} from 'lucide-react';
import { mockProjects, formatDate, formatDateTime, statusLabels, priorityLabels } from '@/lib/mock-data';
import StatusBadge from '@/components/projects/StatusBadge';
import ProjectComments from '@/components/projects/ProjectComments';
import type { ProjectStatus } from '@/lib/mock-data';

const priorityColors: Record<string, string> = {
    low: 'var(--text-muted)',
    medium: 'var(--color-info)',
    high: 'var(--color-warning)',
    critical: 'var(--color-danger)',
};

const statusIcons: Record<ProjectStatus, typeof CheckCircle> = {
    submitted: FileText,
    under_review: Clock,
    need_clarification: AlertCircle,
    accepted: CheckCircle,
    rejected: XCircle,
};

export async function generateStaticParams() {
    return mockProjects.map((p) => ({ id: p.id }));
}

interface Props { params: Promise<{ id: string }> }

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;
    const project = mockProjects.find((p) => p.id === id);
    if (!project) notFound();

    return (
        <div className="animate-in">
            {/* Back nav */}
            <div style={{ marginBottom: 'var(--sp-6)' }}>
                <Link href="/projects">
                    <button className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--sp-4)', paddingLeft: '4px' }}>
                        <ArrowLeft size={14} /> Back to Projects
                    </button>
                </Link>

                <div className="page-header" style={{ marginBottom: 0 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
                            <h1 className="page-title" style={{ fontSize: 'var(--fs-3xl)' }}>{project.name}</h1>
                            <StatusBadge status={project.status} />
                        </div>
                        <p className="page-subtitle">
                            {project.id} · Client: {project.clientName} · Submitted {formatDate(project.submittedAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Need Clarification Banner */}
            {project.status === 'need_clarification' && (
                <div style={{
                    background: 'var(--color-purple-bg)',
                    border: '1px solid var(--color-purple-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--sp-4) var(--sp-5)',
                    marginBottom: 'var(--sp-6)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--sp-3)',
                }}>
                    <AlertCircle size={16} style={{ color: 'var(--color-purple)', marginTop: '1px', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)', color: 'var(--color-purple)', marginBottom: 'var(--sp-1)' }}>
                            Admin requested clarification
                        </div>
                        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                            {project.statusHistory[project.statusHistory.length - 1]?.note}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-6)' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                    {/* Project Overview */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Project Overview</div>
                        </div>
                        <div className="card-body">
                            <div className="info-row">
                                <div className="info-label">Description</div>
                                <div className="info-value" style={{ lineHeight: 'var(--lh-relaxed)' }}>{project.description}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Category</div>
                                <div className="info-value">{project.category}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Client Name</div>
                                <div className="info-value">{project.clientName}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Priority</div>
                                <div className="info-value">
                                    <span style={{ color: priorityColors[project.priority], fontWeight: 'var(--fw-semibold)', textTransform: 'capitalize' }}>
                                        ● {priorityLabels[project.priority]}
                                    </span>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Budget Range</div>
                                <div className="info-value">{project.budgetRange}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Timeline</div>
                                <div className="info-value">
                                    {formatDate(project.startDate)} → {formatDate(project.endDate)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Requirements & Scope</div>
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: 'var(--sp-5)' }}>
                                {project.requirements}
                            </p>

                            <div style={{ marginBottom: 'var(--sp-5)' }}>
                                <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
                                    Key Deliverables
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                                    {project.deliverables.map((d, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)' }}>
                                            <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                                            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>{d}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
                                    Tech Stack
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                                    {project.techStack.map((t) => (
                                        <span key={t} className="chip selected">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Files */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Attached Documents</div>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                                {project.files.length} file{project.files.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="card-body">
                            {project.files.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                                    No documents attached.
                                </div>
                            ) : (
                                <div className="file-list" style={{ marginTop: 0 }}>
                                    {project.files.map((file) => (
                                        <div key={file.id} className="file-item">
                                            <div className="file-item-icon">
                                                <FileText size={16} />
                                            </div>
                                            <span className="file-item-name">{file.name}</span>
                                            <span className="file-item-size">{file.size}</span>
                                            <button className="file-remove" title="Download">
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages & Clarifications */}
                    <ProjectComments projectStatus={project.status} />
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                    {/* Quick Info */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Project Info</div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                                {[
                                    { icon: User, label: 'Client', value: project.clientName },
                                    { icon: FileText, label: 'Category', value: project.category },
                                    { icon: Calendar, label: 'Deadline', value: formatDate(project.endDate) },
                                    { icon: DollarSign, label: 'Budget', value: project.budgetRange },
                                    { icon: Flag, label: 'Priority', value: priorityLabels[project.priority] },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                            background: 'var(--neutral-100)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Icon size={14} style={{ color: 'var(--text-secondary)' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{label}</div>
                                            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Status History</div>
                        </div>
                        <div className="card-body">
                            <div className="timeline">
                                {project.statusHistory.map((entry, i) => {
                                    const Icon = statusIcons[entry.status];
                                    const isLatest = i === project.statusHistory.length - 1;
                                    return (
                                        <div key={entry.id} className="timeline-item">
                                            <div className={`timeline-dot${isLatest ? ' active' : ' complete'}`}>
                                                <Icon size={13} />
                                            </div>
                                            <div className="timeline-content">
                                                <div className="timeline-date">{formatDateTime(entry.date)}</div>
                                                <div className="timeline-title">
                                                    <StatusBadge status={entry.status} showDot={false} />
                                                </div>
                                                {entry.note && (
                                                    <div className="timeline-desc">{entry.note}</div>
                                                )}
                                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
                                                    by {entry.changedBy}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
