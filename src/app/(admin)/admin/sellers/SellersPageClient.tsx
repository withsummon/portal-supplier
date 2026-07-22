'use client'

import { useState } from 'react'
import { CheckCircle, Eye, Mail, Search, Shield, XCircle, Check, X } from 'lucide-react'
import { useAdminDirectory } from '@/hooks/use-admin-directory'
import type { SellerDirectoryDto } from '@/lib/data/admin'
import { formatIDR } from '@/lib/currency'
import Modal from '@/components/ui/Modal'
import { approveSeller, rejectSeller } from '@/lib/actions/members'

export default function SellersPageClient({ sellers }: { sellers: SellerDirectoryDto[] }) {
  const { filteredItems, searchQuery, setSearchQuery, setStatusFilter, statusFilter } =
    useAdminDirectory(sellers, ['name', 'email', 'specialty'], 'status')

  const [selectedSeller, setSelectedSeller] = useState<SellerDirectoryDto | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleApprove(sellerId: string) {
    setIsPending(true)
    await approveSeller(sellerId)
    setSelectedSeller(null)
    setIsPending(false)
  }

  async function handleReject(sellerId: string) {
    setIsPending(true)
    await rejectSeller(sellerId)
    setSelectedSeller(null)
    setIsPending(false)
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sellers Management</h1>
          <p className="page-subtitle">
            Manage seller partners who source opportunities for Summon.
          </p>
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
            {sellers.length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Total Sellers</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div
            style={{
              fontSize: 'var(--fs-2xl)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-success)',
            }}
          >
            {sellers.filter((seller) => seller.status === 'active').length}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Active</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
            {sellers.reduce((sum, seller) => sum + seller.dealsClosed, 0)}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Deals Closed</div>
        </div>
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
            {formatIDR(sellers.reduce((sum, seller) => sum + seller.revenue, 0))}
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
              placeholder="Search sellers..."
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
                <th>Seller</th>
                <th>Specialty</th>
                <th>Status</th>
                <th>Deals</th>
                <th>Revenue</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((seller) => (
                <tr key={String(seller.id)}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{String(seller.name)}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {String(seller.email)}
                      </div>
                    </div>
                  </td>
                  <td>{String(seller.specialty)}</td>
                  <td>
                    <span
                      className={`badge badge-${String(seller.status) === 'active' ? 'accepted' : String(seller.status) === 'pending' ? 'submitted' : 'rejected'}`}
                    >
                      {String(seller.status) === 'active' ? (
                        <CheckCircle size={12} />
                      ) : String(seller.status) === 'pending' ? (
                        <Shield size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {String(seller.status)}
                    </span>
                  </td>
                  <td>{String(seller.dealsClosed)}</td>
                  <td>{formatIDR(Number(seller.revenue))}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        type="button"
                        onClick={() => setSelectedSeller(seller)}
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

      <Modal isOpen={!!selectedSeller} onClose={() => setSelectedSeller(null)} maxWidth="600px">
        {selectedSeller && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div
              style={{
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: 'var(--sp-4)',
              }}
            >
              <h2
                style={{
                  fontSize: 'var(--fs-xl)',
                  fontWeight: 'var(--fw-bold)',
                  marginBottom: 'var(--sp-1)',
                }}
              >
                {selectedSeller.name}
              </h2>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                {selectedSeller.email} • {selectedSeller.phone}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  Specialty
                </div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>{selectedSeller.specialty}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>{selectedSeller.location}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontWeight: 'var(--fw-medium)', textTransform: 'capitalize' }}>
                  {selectedSeller.status}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Joined</div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>
                  {new Date(selectedSeller.joinedAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  Deals Closed
                </div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>{selectedSeller.dealsClosed}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Revenue</div>
                <div style={{ fontWeight: 'var(--fw-medium)' }}>
                  {formatIDR(selectedSeller.revenue)}
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
              {selectedSeller.status === 'pending' && (
                <>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      void handleApprove(selectedSeller.id)
                    }}
                  >
                    <Check size={14} />
                    Approve
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={isPending}
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => {
                      void handleReject(selectedSeller.id)
                    }}
                  >
                    <X size={14} />
                    Reject
                  </button>
                </>
              )}
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setSelectedSeller(null)}
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
