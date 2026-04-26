'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FolderOpen,
    PlusCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    Factory,
    BookOpen,
    User,
    MessageSquare,
    Users,
    Shield,
    Store,
    FileText,
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

// Type definition for nav items
type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
};

type NavSection = {
    section: string;
    items: NavItem[];
};

// Seller navigation
const sellerNavItems: NavSection[] = [
    {
        section: 'Main',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { label: 'My Projects', href: '/projects', icon: FolderOpen, badge: '5' },
            { label: 'Submit Project', href: '/projects/submit', icon: PlusCircle },
        ],
    },
    {
        section: 'Explore',
        items: [
            { label: 'Summon Factory', href: '/factory', icon: Factory },
            { label: 'Research Blog', href: '/research', icon: BookOpen },
        ],
    },
];

// Vendor navigation
const vendorNavItems: NavSection[] = [
    {
        section: 'Main',
        items: [
            { label: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
            { label: 'Find Projects', href: '/vendor/projects', icon: FolderOpen },
            { label: 'My Quotes', href: '/vendor/quotes', icon: FileText },
            { label: 'Messages', href: '/vendor/messages', icon: MessageSquare },
        ],
    },
];

// Admin navigation
const adminNavItems: NavSection[] = [
    {
        section: 'Main',
        items: [
            { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { label: 'Sellers', href: '/admin/sellers', icon: Users },
            { label: 'Vendors', href: '/admin/vendors', icon: Store },
            { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
        ],
    },
    {
        section: 'Manage',
        items: [
            { label: 'Summon Factory', href: '/admin/products', icon: Factory },
        ],
    },
    {
        section: 'Communication',
        items: [
            { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
            { label: 'Notifications', href: '/admin/notifications', icon: Bell },
            { label: 'Team', href: '/admin/team', icon: Users },
        ],
    },
    {
        section: 'Account',
        items: [
            { label: 'Profile', href: '/admin/profile', icon: User },
        ],
    },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    
    // Determine which navigation to show based on route
    const isAdmin = pathname.startsWith('/admin');
    const isVendor = pathname.startsWith('/vendor');
    const currentNavItems = isAdmin ? adminNavItems : isVendor ? vendorNavItems : sellerNavItems;

    const isActive = (href: string) => {
        if (isAdmin) {
            return href === '/admin' ? pathname === href : pathname.startsWith(href);
        }
        if (isVendor) {
            return href === '/vendor' ? pathname === href : pathname.startsWith(href);
        }
        return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
    };

    const handleLogout = () => {
        // Since we're using hardcoded logic, just redirect to login
        router.push('/login');
    };

    return (
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-logo">S</div>
                {!collapsed && (
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-name">Summon</span>
                        {isAdmin ? null : <span className="sidebar-brand-sub">{isVendor ? 'Vendor Portal' : 'Supplier Portal'}</span>}
                    </div>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                className="sidebar-collapse-btn"
                onClick={onToggle}
                aria-label="Toggle sidebar"
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {currentNavItems.map((group) => (
                    <div key={group.section}>
                        {!collapsed && (
                            <div className="sidebar-section-label">{group.section}</div>
                        )}
                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-item${isActive(item.href) ? ' active' : ''}`}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon size={17} className="sidebar-item-icon" />
                                {!collapsed && <span>{item.label}</span>}
                                {!collapsed && item.badge && (
                                    <span className="sidebar-badge">{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}

                {/* Only show these for non-admin routes (they're in adminNavItems for admin) */}
                {!isAdmin && (
                    <>
                        <div className="sidebar-divider" />

                        <Link
                            href={`${isAdmin ? '/admin' : isVendor ? '/vendor' : ''}/notifications`}
                            className={`sidebar-item${isActive('/notifications') ? ' active' : ''}`}
                            title={collapsed ? 'Notifications' : undefined}
                        >
                            <Bell size={17} className="sidebar-item-icon" />
                            {!collapsed && <span>Notifications</span>}
                            {!collapsed && <span className="sidebar-badge">3</span>}
                        </Link>
                        <Link
                            href={`${isAdmin ? '/admin' : isVendor ? '/vendor' : ''}/team`}
                            className={`sidebar-item${isActive('/team') ? ' active' : ''}`}
                            title={collapsed ? 'Team' : undefined}
                        >
                            <Users size={17} className="sidebar-item-icon" />
                            {!collapsed && <span>Team</span>}
                        </Link>
                    </>
                )}

                <div className="sidebar-divider" />

                {/* Admin Panel - only show for admin route */}
                {isAdmin && (
                    <Link
                        href="/admin"
                        className={`sidebar-item${isActive('/admin') ? ' active' : ''}`}
                        title={collapsed ? 'Admin Panel' : undefined}
                        style={{ background: isActive('/admin') ? 'var(--blue-50)' : undefined }}
                    >
                        <Shield size={17} className="sidebar-item-icon" />
                        {!collapsed && <span>Admin Panel</span>}
                    </Link>
                )}
            </nav>

            {/* Footer / User */}
            <div className="sidebar-footer">
                <div
                    className={`sidebar-user${isActive('/profile') ? ' active-profile' : ''}`}
                    onClick={() => router.push(`${isAdmin ? '/admin' : isVendor ? '/vendor' : ''}/profile`)}
                    style={{ cursor: 'pointer' }}
                    title={collapsed ? 'Budi Santoso (PT Arya Teknologi)' : undefined}
                >
                    <div className="sidebar-avatar">AT</div>
                    {!collapsed && (
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">Budi Santoso</div>
                            <div className="sidebar-user-role">PT Arya Teknologi</div>
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: 'auto'
                        }}
                        title="Sign Out"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
