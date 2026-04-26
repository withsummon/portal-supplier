'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { ReactNode } from 'react';

export default function VendorLayout({ children }: { children: ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
