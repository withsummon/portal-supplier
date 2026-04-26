'use client';

import {
    Bell,
    Check,
    Clock,
    ChevronRight,
    Info,
    AlertTriangle,
    MessageSquare,
    Mail,
    TrendingUp,
    FileText,
    FolderOpen,
    Award,
    XCircle,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const FILTER_TABS = ['All', 'Quote Updates', 'New Projects', 'Messages', 'System'];

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'quote_accepted',
        tab: 'Quote Updates',
        title: 'Proposal Accepted!',
        description: 'Your proposal for "Cloud Infrastructure Migration" has been accepted by the Summon team. Check the project details for next steps.',
        time: '2 hours ago',
        category: 'Bid Won',
        icon: Award,
        iconColor: 'var(--color-success)',
        bgColor: 'var(--color-success-bg)',
        unread: true,
        link: '/vendor/projects/PRJ-004',
    },
    {
        id: '2',
        type: 'quote_rejected',
        tab: 'Quote Updates',
        title: 'Proposal Not Selected',
        description: 'Your proposal for "Corporate Branding & Design System" was not selected. The client chose a vendor with a lower bid. You can review feedback in the project details.',
        time: '1 day ago',
        category: 'Bid Result',
        icon: XCircle,
        iconColor: 'var(--color-danger)',
        bgColor: 'var(--color-danger-bg)',
        unread: true,
        link: '/vendor/projects/PRJ-005',
    },
    {
        id: '3',
        type: 'new_project',
        tab: 'New Projects',
        title: 'New Project Matches Your Profile',
        description: 'A new project "AI-Powered Customer Support Platform" in Data & AI has been posted. Your expertise in machine learning makes you a great fit.',
        time: '3 hours ago',
        category: 'Opportunity',
        icon: Zap,
        iconColor: 'var(--blue-600)',
        bgColor: 'var(--blue-50)',
        unread: true,
        link: '/vendor/projects',
    },
    {
        id: '4',
        type: 'message',
        tab: 'Messages',
        title: 'New Reply from Summon Team',
        description: 'The Summon team replied to your question about the "E-Commerce Platform Revamp" project. Click here to view the conversation.',
        time: '5 hours ago',
        category: 'Communication',
        icon: MessageSquare,
        iconColor: 'var(--color-purple)',
        bgColor: 'var(--color-purple-bg)',
        unread: true,
        link: '/vendor/messages',
    },
    {
        id: '5',
        type: 'quote_pending',
        tab: 'Quote Updates',
        title: 'Proposal Under Review',
        description: 'Your proposal for "HR Management Mobile App" is currently being reviewed by the Summon admin team. Expected response within 2-3 business days.',
        time: '1 day ago',
        category: 'Bid Status',
        icon: Clock,
        iconColor: 'var(--color-warning)',
        bgColor: 'var(--color-warning-bg)',
        unread: false,
        link: '/vendor/quotes',
    },
    {
        id: '6',
        type: 'system',
        tab: 'System',
        title: 'Your Vendor Tier Has Been Updated',
        description: 'Congratulations! Your vendor tier has been upgraded from Silver to Gold based on your completed projects and client ratings.',
        time: '3 days ago',
        category: 'Account Update',
        icon: TrendingUp,
        iconColor: 'var(--color-purple)',
        bgColor: 'var(--color-purple-bg)',
        unread: false,
        link: '/vendor/profile',
    },
    {
        id: '7',
        type: 'new_project',
        tab: 'New Projects',
        title: '2 New Projects in Your Category',
        description: 'There are 2 new projects in "Web Development" that match your expertise. Check them out before the deadline.',
        time: '4 days ago',
        category: 'Opportunity',
        icon: FolderOpen,
        iconColor: 'var(--blue-600)',
        bgColor: 'var(--blue-50)',
        unread: false,
        link: '/vendor/projects',
    },
    {
        id: '8',
        type: 'system',
        tab: 'System',
        title: 'Weekly Platform Digest',
        description: 'This week: 5 new projects posted, 3 proposals reviewed, and your profile was viewed by 12 Summon team members.',
        time: '5 days ago',
        category: 'Weekly Digest',
        icon: FileText,
        iconColor: 'var(--text-muted)',
        bgColor: 'var(--neutral-50)',
        unread: false,
        link: '/vendor',
    },
];

export default function VendorNotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All'
        ? notifications
        : notifications.filter(n => n.tab === activeTab);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">Stay updated on your proposals, new projects, and Summon team messages.</p>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                    disabled={unreadCount === 0}
                    style={{ gap: '6px' }}
                >
                    <Check size={14} />
                    Mark all as read
                </button>
            </div>

            {/* Unread Banner */}
            {unreadCount > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                    padding: 'var(--sp-3) var(--sp-4)',
                    background: 'var(--blue-50)',
                    border: '1px solid var(--blue-200)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--sp-5)',
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--blue-700)',
                    fontWeight: 600,
                }}>
                    <Bell size={14} />
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="tabs" style={{ marginBottom: 'var(--sp-5)' }}>
                {FILTER_TABS.map(tab => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                        {tab !== 'All' && (
                            <span style={{
                                marginLeft: '6px', fontSize: '10px',
                                background: activeTab === tab ? 'var(--blue-100)' : 'var(--neutral-100)',
                                color: activeTab === tab ? 'var(--blue-700)' : 'var(--text-muted)',
                                padding: '0 6px', borderRadius: 'var(--radius-full)',
                                fontWeight: 700,
                            }}>
                                {notifications.filter(n => n.tab === tab).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                {filtered.length > 0 ? (
                    filtered.map((notification) => (
                        <Link
                            key={notification.id}
                            href={notification.link}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{
                                padding: 'var(--sp-5)',
                                background: notification.unread ? 'var(--blue-50)' : 'white',
                                border: notification.unread ? '1px solid var(--blue-200)' : '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-xl)',
                                cursor: 'pointer',
                                display: 'flex',
                                gap: 'var(--sp-4)',
                                transition: 'all 200ms ease',
                                position: 'relative',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                            >
                                {/* Unread Indicator */}
                                {notification.unread && (
                                    <div style={{
                                        position: 'absolute', top: 'var(--sp-5)', left: '8px',
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: 'var(--blue-500)',
                                    }} />
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    backgroundColor: notification.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <notification.icon size={22} style={{ color: notification.iconColor }} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}>
                                            {notification.category}
                                            {notification.unread && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    padding: '1px 8px',
                                                    background: 'var(--blue-600)',
                                                    color: 'white',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                }}>
                                                    New
                                                </span>
                                            )}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                            <Clock size={12} />
                                            <span>{notification.time}</span>
                                        </div>
                                    </div>

                                    <h3 style={{
                                        fontSize: 'var(--fs-base)',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        marginBottom: '6px',
                                    }}>
                                        {notification.title}
                                    </h3>

                                    <p style={{
                                        fontSize: 'var(--fs-sm)',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.5,
                                        marginBottom: '12px',
                                    }}>
                                        {notification.description}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--blue-600)',
                                        fontSize: 'var(--fs-sm)',
                                        fontWeight: 600,
                                    }}>
                                        <span>View details</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="card" style={{ padding: 'var(--sp-12)', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--neutral-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--sp-4)',
                        }}>
                            <Bell size={32} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No notifications in this category</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>We&apos;ll notify you when something important happens.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
