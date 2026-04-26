'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CommandBar from './CommandBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="portal-layout" style={collapsed ? { '--sidebar-width': 'var(--sidebar-collapsed)' } as React.CSSProperties : undefined}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`portal-main${collapsed ? ' sidebar-collapsed' : ''}`}>
                <Header sidebarCollapsed={collapsed} />
                <main className="portal-content animate-in">
                    {children}
                </main>
            </div>
            <CommandBar />
        </div>
    );
}

