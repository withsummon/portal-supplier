'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Eye, Mail, Phone, Shield, TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react';
import { formatUSDtoIDR } from '@/lib/currency';

interface Seller {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    status: 'active' | 'pending' | 'suspended';
    dealsClosed: number;
    revenue: number; // in USD
    joinedAt: string;
    specialty: string;
}

const MOCK_SELLERS: Seller[] = [
    {
        id: '1',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@example.com',
        phone: '+62 812 3456 7890',
        location: 'Jakarta, Indonesia',
        status: 'active',
        dealsClosed: 15,
        revenue: 125000,
        joinedAt: 'Jan 10, 2024',
        specialty: 'Enterprise SaaS',
    },
    {
        id: '2',
        name: 'Budi Santoso',
        email: 'budi.s@partner.id',
        phone: '+62 812 3456 7891',
        location: 'Surabaya, Indonesia',
        status: 'active',
        dealsClosed: 8,
        revenue: 68000,
        joinedAt: 'Feb 20, 2024',
        specialty: 'SMEs',
    },
    {
        id: '3',
        name: 'Lisa Chen',
        email: 'lisa.chen@techsales.com',
        phone: '+62 812 3456 7892',
        location: 'Bali, Indonesia',
        status: 'active',
        dealsClosed: 22,
        revenue: 210000,
        joinedAt: 'Nov 5, 2023',
        specialty: 'Government & Enterprise',
    },
    {
        id: '4',
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@digitalbiz.id',
        phone: '+62 812 3456 7893',
        location: 'Bandung, Indonesia',
        status: 'pending',
        dealsClosed: 3,
        revenue: 18500,
        joinedAt: 'Apr 1, 2024',
        specialty: 'Startup Ecosystem',
    },
    {
        id: '5',
        name: 'Diana Puteri',
        email: 'diana.puteri@salespro.id',
        phone: '+62 812 3456 7894',
        location: 'Jakarta, Indonesia',
        status: 'active',
        dealsClosed: 12,
        revenue: 95000,
        joinedAt: 'Dec 15, 2023',
        specialty: 'Financial Services',
    },
];

export default function SellersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
    const [tierFilter, setTierFilter] = useState<'all'>('all');

    const filteredSellers = MOCK_SELLERS.filter(seller => {
        const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seller.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
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
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Sellers Management</h1>
                <p style={{ color: '#6b7280' }}>Manage your seller partners who help sell Summon services</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#dbeafe', padding: '10px', borderRadius: '8px' }}>
                            <Users size={20} color="#3b82f6" />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Total Sellers</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_SELLERS.length}</p>
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
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_SELLERS.filter(s => s.status === 'active').length}</p>
                        </div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px' }}>
                            <TrendingUp size={20} color="#f59e0b" />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Deals Closed</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_SELLERS.reduce((acc, s) => acc + s.dealsClosed, 0)}</p>
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
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{formatUSDtoIDR(MOCK_SELLERS.reduce((acc, s) => acc + s.revenue, 0))}</p>
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
                            placeholder="Search sellers..."
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
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Penjual</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Spesialisasi</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Deals</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Pendapatan</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSellers.map((seller) => (
                            <tr key={seller.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '16px' }}>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{seller.name}</p>
                                        <p style={{ fontSize: '13px', color: '#6b7280' }}>{seller.email}</p>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '16px', fontSize: '13px' }}>
                                        {seller.specialty}
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
                                        background: `${getStatusColor(seller.status)}20`,
                                        color: getStatusColor(seller.status),
                                    }}>
                                        {seller.status === 'active' ? <CheckCircle size={14} /> : seller.status === 'pending' ? <Shield size={14} /> : <XCircle size={14} />}
                                        {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <span style={{ fontWeight: '600' }}>{seller.dealsClosed}</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <span style={{ fontWeight: '600', color: '#10b981' }}>{formatUSDtoIDR(seller.revenue)}</span>
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
