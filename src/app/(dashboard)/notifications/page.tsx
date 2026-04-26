'use client';

import { Bell, Check, Clock, ChevronRight, Info, AlertTriangle, MessageSquare, Mail } from 'lucide-react';
import { useState } from 'react';

const FILTER_TABS = ['All', 'Project Updates', 'Messages', 'System'];

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'status',
        tab: 'Project Updates',
        title: 'Project Accepted',
        description: 'Your project "Cloud Infrastructure Migration" has been accepted by the Summon team. You can now view the next steps in the project dashboard.',
        time: '2 hours ago',
        category: 'Project Update',
        icon: Check,
        iconColor: 'var(--color-success)',
        bgColor: 'var(--color-success-bg)',
        unread: true,
    },
    {
        id: '2',
        type: 'message',
        tab: 'Messages',
        title: 'New Message from Summon Admin',
        description: 'The admin has left a comment on your recent project submission. Please click here to view and respond to the feedback.',
        time: '5 hours ago',
        category: 'Communication',
        icon: MessageSquare,
        iconColor: 'var(--blue-600)',
        bgColor: 'var(--blue-50)',
        unread: true,
    },
    {
        id: '3',
        type: 'system',
        tab: 'System',
        title: 'New Research Published',
        description: 'A new research study "The State of AI Transformation in Enterprise 2024" is now available in the Research Blog.',
        time: '1 day ago',
        category: 'Explore',
        icon: Info,
        iconColor: 'var(--color-purple)',
        bgColor: 'var(--color-purple-bg)',
        unread: false,
    },
    {
        id: '4',
        type: 'alert',
        tab: 'System',
        title: 'Action Required: Profile Incomplete',
        description: 'Your company profile is missing a WhatsApp contact number. Adding this helps Summon team reach you faster for project updates.',
        time: '2 days ago',
        category: 'System',
        icon: AlertTriangle,
        iconColor: 'var(--color-warning)',
        bgColor: 'var(--color-warning-bg)',
        unread: false,
    },
    {
        id: '5',
        type: 'status',
        tab: 'Project Updates',
        title: 'Clarification Requested',
        description: 'Admin has requested additional details on "Data Analytics Dashboard". Check the project page to respond.',
        time: '3 days ago',
        category: 'Project Update',
        icon: AlertTriangle,
        iconColor: 'var(--color-purple)',
        bgColor: 'var(--color-purple-bg)',
        unread: true,
    },
];

export default function NotificationsPage() {
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
                    <p className="page-subtitle">Stay updated on your projects and Summon insights.</p>
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

            {/* Email Notification Banner */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                padding: 'var(--sp-3) var(--sp-4)',
                background: 'var(--color-success-bg)',
                border: '1px solid var(--color-success-border)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--sp-5)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--color-success)',
                fontWeight: 600,
            }}>
                <Mail size={14} />
                Email notifications are enabled — updates are sent to budi@aryateknologi.co.id
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
                                    <span>Click here for details</span>
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
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>We&apos;ll notify you when something important happens.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
