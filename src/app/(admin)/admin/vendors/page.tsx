'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Eye, Mail, Phone, Shield, TrendingUp, Users, DollarSign, Briefcase, Wrench, Calendar } from 'lucide-react';
import { formatUSDtoIDR } from '@/lib/currency';

interface Vendor {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    status: 'active' | 'pending' | 'suspended';
    projectsCompleted: number;
    activeProjects: number;
    rating: number;
    revenue: number; // in USD
    joinedAt: string;
    specialty: string;
}

const MOCK_VENDORS: Vendor[] = [
    {
        id: '1',
        name: 'PT Arya Teknologi',
        email: 'info@aryateknologi.com',
        phone: '+62 812 3456 7890',
        location: 'Jakarta, Indonesia',
        status: 'active',
        projectsCompleted: 12,
        activeProjects: 3,
        rating: 4.8,
        revenue: 45000,
        joinedAt: 'Feb 1, 2024',
        specialty: 'Web Development',
    },
    {
        id: '2',
        name: 'Digital Solusi Indonesia',
        email: 'hello@digitalsolusi.id',
        phone: '+62 812 3456 7891',
        location: 'Surabaya, Indonesia',
        status: 'active',
        projectsCompleted: 8,
        activeProjects: 2,
        rating: 4.5,
        revenue: 28000,
        joinedAt: 'Mar 15, 2024',
        specialty: 'Mobile Apps',
    },
    {
        id: '3',
        name: 'Tech Nusantara',
        email: 'contact@technusantara.com',
        phone: '+62 812 3456 7892',
        location: 'Bandung, Indonesia',
        status: 'pending',
        projectsCompleted: 3,
        activeProjects: 0,
        rating: 4.2,
        revenue: 12000,
        joinedAt: 'Apr 20, 2024',
        specialty: 'UI/UX Design',
    },
    {
        id: '4',
        name: 'IndoCloud Solutions',
        email: 'sales@indocloud.id',
        phone: '+62 812 3456 7893',
        location: 'Jakarta, Indonesia',
        status: 'active',
        projectsCompleted: 25,
        activeProjects: 5,
        rating: 4.9,
        revenue: 180000,
        joinedAt: 'Sep 10, 2023',
        specialty: 'Cloud Infrastructure',
    },
    {
        id: '5',
        name: 'Code Factory Indonesia',
        email: 'hello@codefactory.id',
        phone: '+62 812 3456 7894',
        location: 'Bali, Indonesia',
        status: 'active',
        projectsCompleted: 15,
        activeProjects: 4,
        rating: 4.7,
        revenue: 65000,
        joinedAt: 'Nov 5, 2023',
        specialty: 'Full Stack Development',
    },
];

export default function VendorsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
    const [tierFilter, setTierFilter] = useState<'all'>('all');

    const filteredVendors = MOCK_VENDORS.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
        const matchesTier = tierFilter === 'all';
        return matchesSearch && matchesStatus && matchesTier;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'suspended': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Vendors Management</h1>
                <p style={{ color: '#6b7280' }}>Manage your vendor partners who help complete Summon projects</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#dbeafe', padding: '10px', borderRadius: '8px' }}>
                            <Wrench size={20} color="#3b82f6" />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Total Vendors</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_VENDORS.length}</p>
                        </div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#d1fae5', padding: '10px', borderRadius: '8px' }}>
                            <CheckCircle size={20} color="#10b981" />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Active</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_VENDORS.filter(v => v.status === 'active').length}</p>
                        </div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px' }}>
                            <Briefcase size={20} color="#f59e0b" />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Active Projects</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_VENDORS.reduce((acc, v) => acc + v.activeProjects, 0)}</p>
                        </div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#f3e8ff', padding: '10px', borderRadius: '8px' }}>
                            <DollarSign size={20} color="#7c3aed" />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Total Pendapatan</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{formatUSDtoIDR(MOCK_VENDORS.reduce((acc, v) => acc + v.revenue, 0))}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white',
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value as any)}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white',
                            display: 'none',
                        }}
                    >
                        <option value="all">All Tiers</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Vendor</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Spesialisasi</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Rating</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Projects</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Pendapatan</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendors.map((vendor) => (
                            <tr key={vendor.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '16px' }}>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{vendor.name}</p>
                                        <p style={{ fontSize: '13px', color: '#6b7280' }}>{vendor.email}</p>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '16px', fontSize: '13px' }}>
                                        {vendor.specialty}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '16px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        background: `${getStatusColor(vendor.status)}20`,
                                        color: getStatusColor(vendor.status),
                                    }}>
                                        {vendor.status === 'active' ? <CheckCircle size={14} /> : vendor.status === 'pending' ? <Shield size={14} /> : <XCircle size={14} />}
                                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                        <span style={{ fontWeight: '600' }}>{vendor.rating}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: '600' }}>{vendor.projectsCompleted}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '12px' }}> completed</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <span style={{ fontWeight: '600', color: '#10b981' }}>{formatUSDtoIDR(vendor.revenue)}</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        color: '#6b7280',
                                    }}>
                                        <Eye size={18} />
                                    </button>
                                    <button style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        color: '#6b7280',
                                    }}>
                                        <Mail size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
