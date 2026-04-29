'use client'

import { useState } from 'react'
import { CheckCircle, Eye, Mail, Search, Shield, XCircle, Check, X } from 'lucide-react'
import { useAdminDirectory } from '@/hooks/use-admin-directory'
import type { VendorDirectoryDto } from '@/lib/data/admin'
import { formatUSDtoIDR } from '@/lib/currency'
import Modal from '@/components/ui/Modal'
import { approveVendor, rejectVendor } from '@/lib/actions/members'

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

  const [selectedVendor, setSelectedVendor] = useState<VendorDirectoryDto | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleApprove(vendorId: string) {
    setIsPending(true)
    await approveVendor(vendorId)
    setSelectedVendor(null)
    setIsPending(false)
  }

  async function handleReject(vendorId: string) {
    setIsPending(true)
    await rejectVendor(vendorId)
    setSelectedVendor(null)
    setIsPending(false)
  }

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
                      <button
                        className="btn btn-ghost btn-sm"
                        type="button"
                        onClick={() => setSelectedVendor(vendor)}
                      >
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

      <Modal isOpen={!!selectedVendor} onClose={() => setSelectedVendor(null)} maxWidth="600px">
        {selectedVendor && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div
              style={{
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: 'var(--sp-4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 'var(--fs-xl)',
                      fontWeight: 'var(--fw-bold)',
                      marginBottom: 'var(--sp-1)',
                    }}
                  >
                    {selectedVendor.name}
                  </h2>
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                    {selectedVendor.email} • {selectedVendor.phone}
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--blue-50)',
                    color: 'var(--blue-700)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-semibold)',
                  }}
                >
                  Tier {selectedVendor.tier}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  Specialty
                </div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>{selectedVendor.specialty}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>{selectedVendor.location}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontWeight: 'var(--fw-medium)', textTransform: 'capitalize' }}>
                  {selectedVendor.status}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Joined</div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>
                  {new Date(selectedVendor.joinedAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  Active Projects
                </div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>
                  {selectedVendor.activeProjects}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  Projects Completed
                </div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>
                  {selectedVendor.projectsCompleted}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Rating</div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>{selectedVendor.rating} / 5.0</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  Revenue Generated
                </div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>
                  {formatUSDtoIDR(selectedVendor.revenue)}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--sp-3)',
                marginTop: 'var(--sp-2)',
              }}
            >
              {selectedVendor.status === 'pending' && (
                <>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={isPending}
                    onClick={() => handleApprove(selectedVendor.id)}
                  >
                    <Check size={14} />
                    Approve
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={isPending}
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => handleReject(selectedVendor.id)}
                  >
                    <X size={14} />
                    Reject
                  </button>
                </>
              )}
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setSelectedVendor(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
