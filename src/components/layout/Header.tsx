'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, HelpCircle, BookOpen, AlertCircle, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import ReportIssueModal from '../modals/ReportIssueModal';

const breadcrumbMap: Record<string, { parent?: string; label: string }> = {
    '/dashboard': { label: 'Dashboard' },
    '/projects': { parent: 'Dashboard', label: 'My Projects' },
    '/projects/submit': { parent: 'My Projects', label: 'Submit Project' },
    '/notifications': { parent: 'Dashboard', label: 'Notifications' },
    '/factory': { label: 'Summon Factory' },
    '/research': { label: 'Research Blog' },
    '/profile': { label: 'My Profile' },
    '/wiki': { parent: 'Help', label: 'Summon Wiki' },
};

const mockNotifications = [
    {
        id: '1',
        title: 'Project Status Updated',
        desc: 'Your project "E-Commerce Platform Revamp" has been moved to Under Review.',
        time: '2 mins ago',
        link: '/projects/PRJ-001'
    },
    {
        id: '2',
        title: 'New Clarification Request',
        desc: 'Admin has requested additional documents for "Data Analytics Dashboard".',
        time: '1 hour ago',
        link: '/projects/PRJ-003'
    },
    {
        id: '3',
        title: 'Welcome to Summon',
        desc: 'Thank you for joining the Summon Supplier Portal. Start by submitting your first project.',
        time: '2 days ago',
        link: '/projects/submit'
    }
];

export default function Header({ sidebarCollapsed }: { sidebarCollapsed?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Refs for outside click handling
    const notifRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
                setShowHelp(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Match dynamic routes like /projects/[id] and /admin/projects/[id]
    let crumb = breadcrumbMap[pathname];
    if (!crumb) {
        if (pathname.startsWith('/projects/') && pathname !== '/projects/submit') {
            crumb = { parent: 'My Projects', label: 'Project Detail' };
        } else if (pathname.startsWith('/admin/projects/')) {
            crumb = { parent: 'All Projects', label: 'Project Detail' };
        } else {
            crumb = { label: 'Portal' };
        }
    }

    return (
        <header className={`portal-header${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
            {/* Breadcrumb */}
            <div className="header-breadcrumb">
                {crumb.parent && (
                    <>
                        <span className="header-breadcrumb-item">{crumb.parent}</span>
                        <span className="header-breadcrumb-sep">/</span>
                    </>
                )}
                <span className="header-breadcrumb-current">{crumb.label}</span>
            </div>

            {/* Actions */}
            <div className="header-actions">
                <div className="header-search">
                    <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input placeholder="Search projects..." />
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        className={`header-icon-btn${showNotifications ? ' active' : ''}`}
                        aria-label="Notifications"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={18} />
                        <span className="header-notif-dot" />
                    </button>

                    {showNotifications && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <span>Notifications</span>
                                <button onClick={() => setShowNotifications(false)}><X size={14} /></button>
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {mockNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="dropdown-item"
                                        onClick={() => {
                                            router.push(notif.link);
                                            setShowNotifications(false);
                                        }}
                                    >
                                        <span className="dropdown-item-title">{notif.title}</span>
                                        <span className="dropdown-item-desc">{notif.desc}</span>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                            <span className="dropdown-item-time">{notif.time}</span>
                                            <span className="dropdown-item-link">Click here for details →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: 'var(--sp-2)', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
                                <Link href="/notifications" style={{ fontSize: 'var(--fs-xs)', color: 'var(--blue-600)', fontWeight: 'var(--fw-medium)' }}>
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Menu */}
                <div style={{ position: 'relative' }} ref={helpRef}>
                    <button
                        className={`header-icon-btn${showHelp ? ' active' : ''}`}
                        aria-label="Help"
                        onClick={() => setShowHelp(!showHelp)}
                    >
                        <HelpCircle size={18} />
                    </button>

                    {showHelp && (
                        <div className="dropdown-menu" style={{ width: '240px' }}>
                            <div className="dropdown-header">
                                <span>Support & Help</span>
                            </div>
                            <button
                                className="dropdown-item"
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--sp-3)' }}
                                onClick={() => {
                                    setShowReportModal(true);
                                    setShowHelp(false);
                                }}
                            >
                                <AlertCircle size={16} color="var(--blue-600)" />
                                <div style={{ textAlign: 'left' }}>
                                    <div className="dropdown-item-title">Report Issue</div>
                                    <div className="dropdown-item-desc">Found a bug or need help?</div>
                                </div>
                            </button>
                            <button
                                className="dropdown-item"
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--sp-3)' }}
                                onClick={() => {
                                    router.push('/wiki');
                                    setShowHelp(false);
                                }}
                            >
                                <BookOpen size={16} color="var(--color-purple)" />
                                <div style={{ textAlign: 'left' }}>
                                    <div className="dropdown-item-title">Summon Wiki</div>
                                    <div className="dropdown-item-desc">Guides and documentation</div>
                                </div>
                            </button>
                            <div style={{ padding: 'var(--sp-2)', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
                                <a href="#" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    Version 1.0.4 <ExternalLink size={10} />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ReportIssueModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
        </header>
    );
}
