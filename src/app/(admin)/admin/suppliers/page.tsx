'use client'

import { CheckCircle, Eye, MoreVertical, Search, Star, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  location: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  status: 'active' | 'pending' | 'suspended'
  projectsCompleted: number
  revenue: string
  joinedAt: string
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'PT Arya Teknologi',
    email: 'info@aryateknologi.com',
    phone: '+62 812 3456 7890',
    location: 'Jakarta, Indonesia',
    tier: 'Gold',
    status: 'active',
    projectsCompleted: 12,
    revenue: '$45,000',
    joinedAt: 'Feb 1, 2024',
  },
  {
    id: '2',
    name: 'Digital Solusi Indonesia',
    email: 'hello@digitalsolusi.id',
    phone: '+62 812 3456 7891',
    location: 'Surabaya, Indonesia',
    tier: 'Silver',
    status: 'active',
    projectsCompleted: 8,
    revenue: '$28,000',
    joinedAt: 'Mar 15, 2024',
  },
  {
    id: '3',
    name: 'Tech Nusantara',
    email: 'contact@technusantara.com',
    phone: '+62 812 3456 7892',
    location: 'Bandung, Indonesia',
    tier: 'Bronze',
    status: 'pending',
    projectsCompleted: 0,
    revenue: '$0',
    joinedAt: 'Apr 1, 2024',
  },
  {
    id: '4',
    name: 'Cahaya Digital Makmur',
    email: 'admin@cahayadigital.co.id',
    phone: '+62 812 3456 7893',
    location: 'Medan, Indonesia',
    tier: 'Platinum',
    status: 'active',
    projectsCompleted: 25,
    revenue: '$125,000',
    joinedAt: 'Jan 10, 2024',
  },
  {
    id: '5',
    name: 'Indo AI Solutions',
    email: 'info@indoai.id',
    phone: '+62 812 3456 7894',
    location: 'Jakarta, Indonesia',
    tier: 'Silver',
    status: 'suspended',
    projectsCompleted: 3,
    revenue: '$12,000',
    joinedAt: 'Nov 20, 2023',
  },
]

const STATUS_OPTIONS = ['all', 'active', 'pending', 'suspended']
const TIER_OPTIONS = ['All Tiers', 'Platinum', 'Gold', 'Silver', 'Bronze']

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('All Tiers')

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter
    const matchesTier = tierFilter === 'All Tiers' || supplier.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: CheckCircle }
      case 'pending':
        return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: Eye }
      case 'suspended':
        return { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', icon: XCircle }
      default:
        return { bg: 'var(--neutral-100)', color: 'var(--text-muted)', icon: Eye }
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return { bg: '#e5e5e5', color: '#525252', border: '#a3a3a3' }
      case 'Gold':
        return { bg: '#fef9c3', color: '#a16207', border: '#fde047' }
      case 'Silver':
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' }
      case 'Bronze':
        return { bg: '#fef0e6', color: '#9a3412', border: '#fdba74' }
      default:
        return {
          bg: 'var(--neutral-100)',
          color: 'var(--text-muted)',
          border: 'var(--neutral-300)',
        }
    }
  }

  return (
    <div className="animate-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">Manage and monitor all registered suppliers.</p>
        </div>
        <button className="btn btn-primary">Export Data</button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <div className="card" style={{ padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
            {suppliers.length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
            Total Suppliers
          </div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-4)' }}>
          <div
            style={{
              fontSize: 'var(--fs-2xl)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-success)',
            }}
          >
            {suppliers.filter((s) => s.status === 'active').length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Active</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-4)' }}>
          <div
            style={{
              fontSize: 'var(--fs-2xl)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-warning)',
            }}
          >
            {suppliers.filter((s) => s.status === 'pending').length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Pending</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-4)' }}>
          <div
            style={{
              fontSize: 'var(--fs-2xl)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-muted)',
            }}
          >
            $
            {suppliers
              .reduce((acc, s) => acc + parseInt(s.revenue.replace(/[^0-9]/g, '')), 0)
              .toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Total Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '10px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setStatusFilter(status)}
                style={{ textTransform: 'capitalize' }}
              >
                {status}
              </button>
            ))}
          </div>
          <select
            className="select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            {TIER_OPTIONS.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Location</th>
                <th>Projects</th>
                <th>Revenue</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => {
                const statusStyle = getStatusColor(supplier.status)
                const tierStyle = getTierColor(supplier.tier)
                const StatusIcon = statusStyle.icon
                return (
                  <tr key={supplier.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--blue-100)',
                            color: 'var(--blue-600)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'var(--fw-bold)',
                            fontSize: 'var(--fs-xs)',
                          }}
                        >
                          {supplier.name
                            .split(' ')
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}
                          >
                            {supplier.name}
                          </div>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                            {supplier.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                          background: tierStyle.bg,
                          color: tierStyle.color,
                          border: `1px solid ${tierStyle.border}`,
                        }}
                      >
                        <Star size={10} fill={tierStyle.color} /> {supplier.tier}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          textTransform: 'capitalize',
                        }}
                      >
                        <StatusIcon size={12} /> {supplier.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                      {supplier.location}
                    </td>
                    <td style={{ fontSize: 'var(--fs-sm)' }}>{supplier.projectsCompleted}</td>
                    <td style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
                      {supplier.revenue}
                    </td>
                    <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                      {supplier.joinedAt}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
