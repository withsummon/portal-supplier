"use client";

import { useState } from "react";
import {
    Search,
    Grid,
    List,
    Clock,
    DollarSign,
    Calendar,
    Briefcase,
    ArrowUpRight,
    SlidersHorizontal,
    X,
} from "lucide-react";
import Link from "next/link";
import { dbToMockStatus } from "@/lib/utils/data";

function formatDate(iso: string) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

interface Project {
    id: string;
    name: string;
    category: string;
    status: string;
    budgetRange: string | null;
    startDate: string;
    endDate: string;
    techStack: string[];
}

interface Props {
    projects: Project[];
}

const CATEGORIES = ["All", "Web Development", "Mobile App", "Data & AI", "Cloud Infrastructure", "Design"];

const STATUS_OPTIONS = [
    { label: 'Open', value: 'submitted', color: '#16a34a' },
    { label: 'Under Review', value: 'under_review', color: '#2563eb' },
    { label: 'Need Clarification', value: 'need_clarification', color: '#ea580c' },
];

const CATEGORY_COLORS: Record<string, string> = {
    'Web Development': '#2563eb',
    'Mobile App': '#7c3aed',
    'Data & AI': '#059669',
    'Cloud Infrastructure': '#d97706',
    'Design': '#dc2626',
};

// Generate a gradient banner based on category
function getBannerGradient(category: string): string {
    const gradients: Record<string, string> = {
        'Web Development': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)',
        'Mobile App': 'linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #a78bfa 100%)',
        'Data & AI': 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
        'Cloud Infrastructure': 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
        'Design': 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)',
    };
    return gradients[category] ?? gradients['Web Development'] ?? 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)';
}

function getDaysRemaining(endDate: string | null): number {
    if (!endDate) return 0;
    const now = new Date('2026-02-28');
    const end = new Date(endDate);
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getBudgetValue(budgetRange: string | null): string {
    if (!budgetRange) return '0';
    // Extract the upper bound or the single value
    const match = budgetRange.match(/\$?([\d,]+)K?/g);
    if (match) {
        const last = match[match.length - 1] ?? '0';
        const normalized = last.replace(/[,$K]/g, '');
        return normalized;
    }
    return '0';
}

export default function ProjectMarketplace({ projects }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeStatus, setActiveStatus] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);

    const openProjects = projects.filter((p) => {
        const dbStatus = dbToMockStatus[p.status] ?? p.status;
        return (
            (dbStatus === "accepted" || dbStatus === "submitted" || dbStatus === "under_review" || dbStatus === "need_clarification") &&
            (activeCategory === "All" || p.category === activeCategory) &&
            (activeStatus === null || dbStatus === activeStatus) &&
            (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    return (
        <div className="animate-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{ marginBottom: 'var(--sp-6)' }}>
                <h1 className="page-title">Explore Projects</h1>
                <p className="page-subtitle">{openProjects.length} opportunities available — find your next project</p>
            </div>

            {/* Search & Filter Bar */}
            <div style={{
                display: 'flex',
                gap: 'var(--sp-3)',
                alignItems: 'center',
                marginBottom: 'var(--sp-6)',
                flexWrap: 'wrap'
            }}>
                {/* Search */}
                <div style={{
                    flex: '1 1 300px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'white',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0 var(--sp-3)',
                    height: '44px'
                }}>
                    <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            padding: '0 var(--sp-3)',
                            fontSize: 'var(--fs-sm)',
                            background: 'transparent',
                            color: 'var(--text-primary)'
                        }}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <button
                    className="btn btn-secondary"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        background: showFilters ? 'var(--blue-50)' : 'white',
                        borderColor: showFilters ? 'var(--blue-300)' : undefined,
                    }}
                >
                    <SlidersHorizontal size={16} /> Filters
                    {activeStatus && <span style={{
                        background: 'var(--blue-600)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'var(--fw-bold)'
                    }}>1</span>}
                </button>

                {/* View Toggle */}
                <div style={{
                    display: 'flex',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '8px 12px',
                            background: viewMode === 'grid' ? 'var(--blue-600)' : 'white',
                            color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Grid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '8px 12px',
                            background: viewMode === 'list' ? 'var(--blue-600)' : 'white',
                            color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            borderLeft: '1px solid var(--border-default)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div style={{
                    display: 'flex',
                    gap: 'var(--sp-6)',
                    marginBottom: 'var(--sp-6)',
                    padding: 'var(--sp-5)',
                    background: 'white',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    flexWrap: 'wrap'
                }}>
                    {/* Status Filter */}
                    <div>
                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>
                            Status
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setActiveStatus(null)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 'var(--radius-full)',
                                    border: `1px solid ${activeStatus === null ? 'var(--blue-600)' : 'var(--border-default)'}`,
                                    background: activeStatus === null ? 'var(--blue-50)' : 'white',
                                    color: activeStatus === null ? 'var(--blue-700)' : 'var(--text-secondary)',
                                    fontSize: 'var(--fs-sm)',
                                    cursor: 'pointer',
                                    fontWeight: activeStatus === null ? 'var(--fw-semibold)' : 'var(--fw-normal)',
                                }}
                            >
                                All
                            </button>
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setActiveStatus(activeStatus === s.value ? null : s.value)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)',
                                        border: `1px solid ${activeStatus === s.value ? s.color : 'var(--border-default)'}`,
                                        background: activeStatus === s.value ? `${s.color}10` : 'white',
                                        color: activeStatus === s.value ? s.color : 'var(--text-secondary)',
                                        fontSize: 'var(--fs-sm)',
                                        cursor: 'pointer',
                                        fontWeight: activeStatus === s.value ? 'var(--fw-semibold)' : 'var(--fw-normal)',
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>
                            Category
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)',
                                        border: `1px solid ${activeCategory === cat ? 'var(--blue-600)' : 'var(--border-default)'}`,
                                        background: activeCategory === cat ? 'var(--blue-50)' : 'white',
                                        color: activeCategory === cat ? 'var(--blue-700)' : 'var(--text-secondary)',
                                        fontSize: 'var(--fs-sm)',
                                        cursor: 'pointer',
                                        fontWeight: activeCategory === cat ? 'var(--fw-semibold)' : 'var(--fw-normal)',
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Project Grid */}
            {viewMode === 'grid' ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 'var(--sp-5)'
                }}>
                    {openProjects.map((project) => {
                        const daysLeft = getDaysRemaining(project.endDate);
                        const budgetNum = getBudgetValue(project.budgetRange);
                        return (
                            <Link href={`/vendor/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    background: 'white',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-xl)',
                                    overflow: 'hidden',
                                    transition: 'all 200ms ease',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-200)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                                }}
                                >
                                    {/* Banner Image */}
                                    <div style={{
                                        height: '160px',
                                        background: getBannerGradient(project.category),
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Decorative elements */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-30px',
                                            left: '-30px',
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.05)',
                                        }} />

                                        {/* Category badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 'var(--sp-3)',
                                            left: 'var(--sp-3)',
                                            padding: '4px 10px',
                                            background: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '10px',
                                            fontWeight: 'var(--fw-bold)',
                                            color: 'white',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}>
                                            {project.category}
                                        </div>

                                        {/* Status badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 'var(--sp-3)',
                                            right: 'var(--sp-3)',
                                            padding: '4px 10px',
                                            background: daysLeft <= 7 ? '#dc2626' : '#16a34a',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '10px',
                                            fontWeight: 'var(--fw-bold)',
                                            color: 'white',
                                        }}>
                                            {daysLeft <= 7 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : `${daysLeft} days left`}
                                        </div>

                                        {/* Center text */}
                                        <div style={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
                                            <Briefcase size={32} style={{ opacity: 0.8, marginBottom: '8px' }} />
                                            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', opacity: 0.9 }}>
                                                via Summon
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div style={{ padding: 'var(--sp-4)' }}>
                                        <h3 style={{
                                            fontSize: 'var(--fs-base)',
                                            fontWeight: 'var(--fw-bold)',
                                            marginBottom: 'var(--sp-2)',
                                            color: 'var(--text-primary)',
                                            lineHeight: 1.4,
                                        }}>
                                            {project.name}
                                        </h3>

                                        {/* Tags */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)', marginBottom: 'var(--sp-3)' }}>
                                            {project.techStack.slice(0, 3).map(tech => (
                                                <span key={tech} style={{
                                                    padding: '2px 8px',
                                                    background: `${CATEGORY_COLORS[project.category]}10`,
                                                    color: CATEGORY_COLORS[project.category],
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '10px',
                                                    fontWeight: 'var(--fw-medium)',
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: 'var(--neutral-100)',
                                                    color: 'var(--text-muted)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '10px',
                                                }}>
                                                    +{project.techStack.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Budget */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: 'var(--sp-3)',
                                            borderTop: '1px solid var(--border-default)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <DollarSign size={14} style={{ color: 'var(--color-warning)' }} />
                                                <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--color-warning)' }}>
                                                    {budgetNum}
                                                </span>
                                                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>USD</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: 'var(--blue-600)',
                                                fontSize: 'var(--fs-xs)',
                                                fontWeight: 'var(--fw-semibold)',
                                            }}>
                                                View Details <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {openProjects.map((project) => {
                        const daysLeft = getDaysRemaining(project.endDate);
                        const budgetNum = getBudgetValue(project.budgetRange);
                        return (
                            <Link href={`/vendor/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    display: 'flex',
                                    background: 'white',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    transition: 'all 200ms ease',
                                    cursor: 'pointer',
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
                                    {/* Left accent bar */}
                                    <div style={{
                                        width: '4px',
                                        background: CATEGORY_COLORS[project.category],
                                        flexShrink: 0,
                                    }} />

                                    <div style={{ flex: 1, padding: 'var(--sp-4) var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                                        {/* Icon */}
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-lg)',
                                            background: getBannerGradient(project.category),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <Briefcase size={20} style={{ color: 'white' }} />
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: '4px' }}>
                                                <h3 style={{
                                                    fontSize: 'var(--fs-base)',
                                                    fontWeight: 'var(--fw-bold)',
                                                    color: 'var(--text-primary)',
                                                }}>
                                                    {project.name}
                                                </h3>
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
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} /> {daysLeft} days left
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={12} /> {formatDate(project.startDate)}
                                                </span>
                                                <span>via Summon</span>
                                            </div>
                                        </div>

                                        {/* Tech tags */}
                                        <div style={{ display: 'flex', gap: 'var(--sp-1)', flexShrink: 0 }}>
                                            {project.techStack.slice(0, 4).map(tech => (
                                                <span key={tech} style={{
                                                    padding: '4px 10px',
                                                    background: 'var(--neutral-50)',
                                                    color: 'var(--text-secondary)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 'var(--fs-xs)',
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Budget */}
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                                <DollarSign size={14} style={{ color: 'var(--color-warning)' }} />
                                                <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--color-warning)' }}>
                                                    {budgetNum}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>USD</div>
                                        </div>

                                        {/* Arrow */}
                                        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {openProjects.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--sp-20)',
                    background: 'white',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--neutral-100)',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--sp-6)',
                    }}>
                        <Briefcase size={36} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)' }}>
                        No projects found
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                        Try adjusting your filters or search query to find more opportunities.
                    </p>
                </div>
            )}
        </div>
    );
}
