'use client';

import { Bell, Check, Clock, ChevronRight, Info, AlertTriangle, MessageSquare, Mail, Users, FolderOpen } from 'lucide-react';
import { useState } from 'react';

const FILTER_TABS = ['All', 'Seller Activity', 'Vendor Updates', 'System'];

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'seller',
        tab: 'Seller Activity',
        title: 'New Project Submission',
        description: 'PT Arya Teknologi submitted a new project "Cloud Infrastructure Migration" for review.',
        time: '10 minutes ago',
        category: 'Submission',
        icon: FolderOpen,
        iconColor: 'var(--blue-600)',
        bgColor: 'var(--blue-50)',
        unread: true,
    },
    {
        id: '2',
        type: 'vendor',
        tab: 'Vendor Updates',
        title: 'Vendor Application Received',
        description: 'CV Maju Bersama applied to become a verified vendor for the Web Development category.',
        time: '1 hour ago',
        category: 'Vendor',
        icon: Users,
        iconColor: 'var(--color-success)',
        bgColor: 'var(--color-success-bg)',
        unread: true,
    },
    {
        id: '3',
        type: 'system',
        tab: 'System',
        title: 'Weekly Report Generated',
        description: 'Your weekly platform performance report is ready. View insights on submissions, acceptances, and vendor activity.',
        time: '3 hours ago',
        category: 'Report',
        icon: Info,
        iconColor: 'var(--color-purple)',
        bgColor: 'var(--color-purple-bg)',
        unread: false,
    },
    {
        id: '4',
        type: 'alert',
        tab: 'System',
        title: 'Pending Reviews',
        description: 'You have 3 project submissions waiting for review. Priority: High.',
        time: '5 hours ago',
        category: 'Action Required',
        icon: AlertTriangle,
        iconColor: 'var(--color-warning)',
        bgColor: 'var(--color-warning-bg)',
        unread: true,
    },
    {
        id: '5',
        type: 'seller',
        tab: 'Seller Activity',
        title: 'Clarification Response Received',
        description: 'Budi Santoso responded to the clarification request for "Data Analytics Dashboard" project.',
        time: '1 day ago',
        category: 'Response',
        icon: MessageSquare,
        iconColor: 'var(--color-success)',
        bgColor: 'var(--color-success-bg)',
        unread: false,
    },
];

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All'
        ? notifications
        : notifications.filter(n => n.tab === activeTab);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">Monitor seller submissions, vendor updates, and platform activity.</p>
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

            {/* Admin Stats Banner */}
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
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''} requiring your attention
            </div>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                {filtered.length > 0 ? (
                    filtered.map((notification) => (
                        <div key={notification.id} className="card notification-item-hover" style={{
                            padding: 'var(--sp-5)',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: 'var(--sp-4)',
                            transition: 'all var(--transition-fast)',
                            position: 'relative',
                        }}>
                            {/* Unread Indicator */}
                            {notification.unread && (
                                <div style={{
                                    position: 'absolute', top: 'var(--sp-5)', left: '8px',
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: 'var(--blue-500)',
                                }} />
                            )}
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: notification.bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <notification.icon size={22} style={{ color: notification.iconColor }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {notification.category}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                        <Clock size={12} />
                                        <span>{notification.time}</span>
                                    </div>
                                </div>
                                <h3 style={{
                                    fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px',
                                }}>
                                    {notification.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                                    {notification.description}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--blue-600)', fontSize: '13px', fontWeight: 600 }}>
                                    <span>View details</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
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
                            margin: '0 auto var(--sp-4)'
                        }}>
                            <Bell size={32} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No notifications in this category</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
