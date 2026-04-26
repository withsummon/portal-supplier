'use client'

import { CheckCircle, Eye, Mail, Search, Shield, XCircle } from 'lucide-react'
import { useAdminDirectory } from '@/hooks/use-admin-directory'
import type { VendorDirectoryDto } from '@/lib/data/admin'
import { formatUSDtoIDR } from '@/lib/currency'

export default function VendorsPageClient({
  vendors,
  title = 'Vendors Management',
  subtitle = 'Manage vendor partners who deliver Summon projects.',
}: {
  vendors: VendorDirectoryDto[]
  title?: string
  subtitle?: string
}) {
  const { filteredItems, searchQuery, setSearchQuery, setStatusFilter, statusFilter } =
    useAdminDirectory(vendors, ['name', 'email', 'specialty'], 'status')

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
            {vendors.length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Total Vendors</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div
            style={{
              fontSize: 'var(--fs-2xl)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-success)',
            }}
          >
            {vendors.filter((vendor) => vendor.status === 'active').length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Active</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
            {vendors.reduce((sum, vendor) => sum + vendor.activeProjects, 0)}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
            Active Projects
          </div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
            {formatUSDtoIDR(vendors.reduce((sum, vendor) => sum + vendor.revenue, 0))}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Total Revenue</div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              className="input"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <select
            className="select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Specialty</th>
                <th>Status</th>
                <th>Projects</th>
                <th>Revenue</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((vendor) => (
                <tr key={String(vendor.id)}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{String(vendor.name)}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {String(vendor.email)}
                      </div>
                    </div>
                  </td>
                  <td>{String(vendor.specialty)}</td>
                  <td>
                    <span
                      className={`badge badge-${String(vendor.status) === 'active' ? 'accepted' : String(vendor.status) === 'pending' ? 'submitted' : 'rejected'}`}
                    >
                      {String(vendor.status) === 'active' ? (
                        <CheckCircle size={12} />
                      ) : String(vendor.status) === 'pending' ? (
                        <Shield size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {String(vendor.status)}
                    </span>
                  </td>
                  <td>{String(vendor.activeProjects)}</td>
                  <td>{formatUSDtoIDR(Number(vendor.revenue))}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                      <button className="btn btn-ghost btn-sm" type="button">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" type="button">
                        <Mail size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
