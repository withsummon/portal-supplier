'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    CheckCircle2,
    FileText,
    Briefcase,
    Send,
    X,
    MessageSquare,
    Paperclip,
    MessageCircle,
    Tag,
    Download,
} from 'lucide-react';
import { formatDate, dbToMockStatus, type MockProjectStatus, type MockPriority } from '@/lib/utils/data';
import Link from 'next/link';

export interface VendorProjectFile {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
}

export interface VendorProjectSeller {
    companyName: string;
    user: {
        name: string | null;
        email: string;
    };
}

export interface VendorProjectProps {
    id: string;
    projectId: string;
    name: string;
    description: string;
    requirements: string | null;
    category: string;
    budgetRange: string | null;
    startDate: string | null;
    endDate: string | null;
    priority: MockPriority;
    status: MockProjectStatus;
    createdAt: string;
    updatedAt: string;
    files: VendorProjectFile[];
    seller: VendorProjectSeller;
}

interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
}

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: '1',
        senderId: 'summon',
        senderName: 'Summon Team',
        text: 'Welcome! This is the project discussion channel. Feel free to ask any questions about this project.',
        timestamp: new Date(Date.now() - 3600000 * 2),
    },
    {
        id: '2',
        senderId: 'summon',
        senderName: 'Summon Team',
        text: 'Our technical team has reviewed the requirements and confirmed that the scope is well-defined. If you need any clarification on deliverables, just let us know.',
        timestamp: new Date(Date.now() - 3600000),
    },
];

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
    return gradients[category] ?? gradients['Web Development'] ?? 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)';
}

function getDaysRemaining(endDate: string | null): number {
    if (!endDate) return 0;
    const now = new Date('2026-02-28');
    const end = new Date(endDate);
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getBudgetValue(budgetRange: string | null): { amount: string; currency: string } {
    if (!budgetRange) return { amount: '0', currency: 'USD' };
    const match = budgetRange.match(/\$?([\d,]+)K?/g);
    if (match && match.length >= 1) {
        const last = match[match.length - 1] ?? '0';
        const normalized = last.replace(/[,$]/g, '');
        if (budgetRange.includes('K')) {
            return { amount: normalized, currency: 'K USD' };
        }
        return { amount: normalized, currency: 'USD' };
    }
    return { amount: '0', currency: 'USD' };
}

export default function VendorProjectDetailClient({ project }: { project: VendorProjectProps }) {
    const router = useRouter();
    const [showBidForm, setShowBidForm] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'deliverables' | 'tech'>('details');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const daysLeft = getDaysRemaining(project.endDate);
    const budget = getBudgetValue(project.budgetRange);

    const handleSubmitBid = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setShowBidForm(false);
            router.push('/vendor/quotes');
        }, 1500);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            senderId: 'vendor',
            senderName: 'You',
            text: newMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        setTimeout(() => {
            const reply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                senderId: 'summon',
                senderName: 'Summon Team',
                text: 'Thank you for your message! Our team will review your question and get back to you shortly.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="animate-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Back button */}
            <div style={{ marginBottom: 'var(--sp-4)' }}>
                <Link href="/vendor/projects">
                    <button className="btn btn-ghost btn-sm" style={{ paddingLeft: '0', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <ArrowLeft size={14} /> Back to Projects
                    </button>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--sp-8)', alignItems: 'start' }}>
                {/* Left: Hero Banner + Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                    {/* Hero Banner */}
                    <div style={{
                        height: '280px',
                        background: getBannerGradient(project.category),
                        borderRadius: 'var(--radius-xl)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* Decorative circles */}
                        <div style={{
                            position: 'absolute',
                            top: '-40px',
                            right: '-40px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)',
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-60px',
                            left: '-60px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '40%',
                            left: '60%',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.03)',
                        }} />

                        {/* Content */}
                        <div style={{ textAlign: 'center', color: 'white', zIndex: 1, padding: 'var(--sp-6)' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--sp-2)',
                                padding: '6px 16px',
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 'var(--radius-full)',
                                marginBottom: 'var(--sp-4)',
                                fontSize: 'var(--fs-sm)',
                                fontWeight: 'var(--fw-semibold)',
                            }}>
                                <Briefcase size={16} /> via Summon
                            </div>
                            <h1 style={{
                                fontSize: 'var(--fs-2xl)',
                                fontWeight: 'var(--fw-bold)',
                                marginBottom: 'var(--sp-3)',
                                lineHeight: 1.2,
                            }}>
                                {project.name}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', justifyContent: 'center', fontSize: 'var(--fs-sm)', opacity: 0.9 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Tag size={14} /> {project.category}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} /> {formatDate(project.startDate)} — {formatDate(project.endDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '1px solid var(--border-default)',
                        gap: 'var(--sp-1)',
                    }}>
                        {[
                            { key: 'details', label: 'Details' },
                            { key: 'deliverables', label: 'Deliverables' },
                            { key: 'tech', label: 'Tech Stack' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                style={{
                                    padding: 'var(--sp-3) var(--sp-4)',
                                    border: 'none',
                                    background: 'none',
                                    color: activeTab === tab.key ? 'var(--blue-600)' : 'var(--text-muted)',
                                    fontSize: 'var(--fs-sm)',
                                    fontWeight: activeTab === tab.key ? 'var(--fw-semibold)' : 'var(--fw-normal)',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === tab.key ? '2px solid var(--blue-600)' : '2px solid transparent',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                {tab.key === 'details' ? 'Details' : tab.key === 'deliverables' ? 'Deliverables' : 'Tech Stack'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'details' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)' }}>
                                    Project Overview
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: 'var(--sp-6)' }}>
                                    {project.description}
                                </p>

                                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)' }}>
                                    Requirements
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                    {project.requirements ?? 'No specific requirements provided.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'deliverables' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-4)' }}>
                                    Key Deliverables
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                                    No deliverables have been specified for this project yet.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tech' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-4)' }}>
                                    Required Tech Stack
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                                    No tech stack has been specified for this project yet.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    {project.files.length > 0 && (
                        <div className="card">
                            <div className="card-header"><h2 className="card-title">Attachments</h2></div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                                    {project.files.map(file => (
                                        <div key={file.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--sp-3)',
                                            padding: 'var(--sp-3)',
                                            background: 'var(--neutral-50)',
                                            borderRadius: 'var(--radius-lg)',
                                            cursor: 'pointer',
                                            transition: 'background 150ms ease',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--neutral-100)'}
                                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--neutral-50)'}
                                        >
                                            <FileText size={18} style={{ color: 'var(--text-muted)' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {file.name}
                                                </div>
                                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{file.size}</div>
                                            </div>
                                            <Download size={16} style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div style={{ position: 'sticky', top: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                    {/* Budget Card */}
                    <div className="card">
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                            {/* Budget */}
                            <div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--sp-1)' }}>
                                    Budget Range
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--color-warning)' }}>
                                        {budget.amount}
                                    </span>
                                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                                        {budget.currency}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'var(--border-default)' }} />

                            {/* Timeline */}
                            <div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>
                                    Timeline
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Starts</span>
                                        <span style={{ fontWeight: 'var(--fw-semibold)' }}>{formatDate(project.startDate)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Ends</span>
                                        <span style={{ fontWeight: 'var(--fw-semibold)' }}>{formatDate(project.endDate)}</span>
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: 'var(--sp-2)',
                                    padding: 'var(--sp-2) var(--sp-3)',
                                    background: daysLeft <= 7 ? '#fef2f2' : '#f0fdf4',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--fs-xs)',
                                    fontWeight: 'var(--fw-semibold)',
                                    color: daysLeft <= 7 ? '#dc2626' : '#16a34a',
                                    textAlign: 'center',
                                }}>
                                    {daysLeft} days remaining
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'var(--border-default)' }} />

                            {/* Category */}
                            <div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>
                                    Category
                                </div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    background: `${CATEGORY_COLORS[project.category] ?? '#2563eb'}10`,
                                    color: CATEGORY_COLORS[project.category] ?? '#2563eb',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--fs-sm)',
                                    fontWeight: 'var(--fw-semibold)',
                                }}>
                                    <Tag size={14} /> {project.category}
                                </span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'var(--border-default)' }} />

                            {/* Tags */}
                            <div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>
                                    Tech Tags
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>No tags specified</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => setShowBidForm(true)}
                            style={{
                                boxShadow: 'var(--shadow-md)',
                                justifyContent: 'center',
                            }}
                        >
                            Submit Proposal
                        </button>
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={() => setShowChat(true)}
                            style={{ justifyContent: 'center' }}
                        >
                            <MessageSquare size={16} /> Message Summon Team
                        </button>
                    </div>

                    {/* Summon Info */}
                    <div style={{
                        padding: 'var(--sp-4)',
                        background: 'var(--blue-50)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--blue-100)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--blue-600)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'var(--fw-bold)',
                                fontSize: 'var(--fs-sm)',
                            }}>
                                S
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>Summon</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Project Acquirer</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--blue-800)', lineHeight: 1.5 }}>
                            This project was acquired by Summon from an end client. All communications and proposals go through the Summon team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {(showBidForm || showChat) && (
                <div
                    onClick={() => { setShowBidForm(false); setShowChat(false); }}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* Bid Form Slide-over */}
            {showBidForm && (
                <div className="drawer-panel" style={{ zIndex: 1001 }}>
                    <div className="drawer-header">
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>Submit Proposal</h2>
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>For: {project.name}</p>
                        </div>
                        <button onClick={() => setShowBidForm(false)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="drawer-body">
                        <form id="bid-form" onSubmit={handleSubmitBid} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                            <div className="form-group">
                                <label className="form-label">Bid Amount (USD) <span className="form-required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</div>
                                    <input className="input" type="number" placeholder="e.g. 50000" style={{ paddingLeft: '28px' }} required />
                                </div>
                                <span className="form-hint">Expected budget: {project.budgetRange ?? 'Not specified'}</span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Estimated Days to Complete <span className="form-required">*</span></label>
                                <input className="input" type="number" placeholder="e.g. 90" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Proposal Details <span className="form-required">*</span></label>
                                <textarea className="input input-textarea" rows={10} placeholder="Describe your approach, team highlights, and why you are the best fit..." required />
                            </div>

                            <div style={{ padding: 'var(--sp-4)', background: 'var(--blue-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--blue-100)' }}>
                                <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                                    <CheckCircle2 size={18} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
                                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--blue-800)', lineHeight: 'var(--lh-relaxed)' }}>
                                        By submitting this proposal, you agree to Summon&apos;s Terms of Service for Vendors.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="drawer-footer">
                        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                            <button className="btn btn-secondary" onClick={() => setShowBidForm(false)} style={{ flex: 1 }}>Cancel</button>
                            <button className="btn btn-primary" type="submit" form="bid-form" style={{ flex: 1 }} disabled={submitting}>
                                {submitting ? 'Submitting...' : <>Submit Bid <Send size={14} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Slide-over */}
            {showChat && (
                <div className="drawer-panel" style={{ zIndex: 1001, width: '420px' }}>
                    <div className="drawer-header">
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                                <MessageCircle size={18} style={{ color: 'var(--blue-600)' }} />
                                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>Chat with Summon Team</h2>
                            </div>
                            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Re: {project.name}</p>
                        </div>
                        <button onClick={() => setShowChat(false)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: message.senderId === 'vendor' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <div style={{ maxWidth: '85%' }}>
                                        {message.senderId !== 'vendor' && (
                                            <div style={{ fontSize: '10px', fontWeight: 'var(--fw-semibold)', color: 'var(--blue-600)', marginBottom: '4px' }}>
                                                {message.senderName}
                                            </div>
                                        )}
                                        <div style={{
                                            padding: 'var(--sp-3) var(--sp-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            background: message.senderId === 'vendor' ? 'var(--blue-600)' : 'var(--neutral-100)',
                                            color: message.senderId === 'vendor' ? 'white' : 'var(--text-primary)',
                                        }}>
                                            <p style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.5, margin: 0 }}>
                                                {message.text}
                                            </p>
                                        </div>
                                        <div style={{
                                            fontSize: '10px',
                                            marginTop: '4px',
                                            color: 'var(--text-muted)',
                                            textAlign: message.senderId === 'vendor' ? 'right' : 'left',
                                        }}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={{
                            padding: 'var(--sp-4) var(--sp-5)',
                            borderTop: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sp-3)',
                        }}>
                            <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                                <Paperclip size={16} />
                            </button>
                            <input
                                type="text"
                                placeholder="Ask about this project..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="input"
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                style={{ padding: '10px' }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
