'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { useSellerTeam } from '@/hooks/use-seller-team'
import type { SellerTeamMemberDto } from '@/lib/data/teams'

const ROLES = [
  'Project Manager',
  'Sales Lead',
  'Technical Lead',
  'Developer',
  'Designer',
  'Analyst',
  'Support',
]

const TEAM_STATS: Array<{
  label: string
  icon: LucideIcon
  background: string
  color: string
  getValue: (members: SellerTeamMemberDto[]) => number
}> = [
  {
    label: 'Total Members',
    icon: Users,
    background: 'var(--blue-50)',
    color: 'var(--blue-600)',
    getValue: (members) => members.length,
  },
  {
    label: 'Active',
    icon: UserCheck,
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    getValue: (members) => members.filter((member) => member.status === 'active').length,
  },
  {
    label: 'Pending',
    icon: UserPlus,
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
    getValue: (members) => members.filter((member) => member.status === 'pending').length,
  },
]

export default function TeamPageClient({
  initialMembers,
}: {
  initialMembers: SellerTeamMemberDto[]
}) {
  const {
    draft,
    error,
    filteredMembers,
    members,
    searchQuery,
    setDraft,
    setSearchQuery,
    setShowAddModal,
    showAddModal,
    submitNewMember,
    changeRole,
    removeMember,
    isPending,
  } = useSellerTeam(initialMembers)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage your team members and their access.</p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setShowAddModal(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setShowAddModal(true)
            }
          }}
        >
          <Plus size={15} />
          Add Member
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        {TEAM_STATS.map(({ label, icon: Icon, background, color, getValue }) => (
          <div key={label} className="card" style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
                  {getValue(members)}
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--blue-100)',
                          color: 'var(--blue-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'var(--fw-bold)',
                          fontSize: 'var(--fs-sm)',
                        }}
                      >
                        {member.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'var(--fw-semibold)' }}>{member.name}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className="select"
                      value={member.role}
                      onChange={(event) => changeRole(member.id, event.target.value)}
                      style={{ padding: '6px 10px', fontSize: 'var(--fs-xs)', maxWidth: '180px' }}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${member.status === 'active' ? 'accepted' : member.status === 'pending' ? 'submitted' : 'rejected'}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {member.email}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '4px',
                        }}
                      >
                        <Phone size={12} /> {member.phone || 'No phone'}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => removeMember(member.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          removeMember(member.id)
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setShowAddModal(false)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
            style={{ maxWidth: '480px' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
          >
            <h2
              id="add-member-title"
              style={{
                fontSize: 'var(--fs-xl)',
                fontWeight: 'var(--fw-bold)',
                marginBottom: 'var(--sp-5)',
              }}
            >
              Add Team Member
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
              style={{ position: 'absolute', right: 'var(--sp-5)', top: 'var(--sp-5)' }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {error && (
                <div style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-sm)' }}>
                  {error}
                </div>
              )}
              <label>
                <span className="form-label">
                  Full name <span className="form-required">*</span>
                </span>
                <input
                  className="input"
                  placeholder="Budi Santoso"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label>
                <span className="form-label">
                  Email <span className="form-required">*</span>
                </span>
                <input
                  className="input"
                  type="email"
                  placeholder="budi@company.com"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>
              <label>
                <span className="form-label">Phone</span>
                <input
                  className="input"
                  placeholder="+62 812 0000 0000"
                  value={draft.phone}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </label>
              <label>
                <span className="form-label">Role</span>
                <select
                  className="select"
                  value={draft.role}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, role: event.target.value }))
                  }
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--sp-3)',
                marginTop: 'var(--sp-6)',
              }}
            >
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setShowAddModal(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setShowAddModal(false)
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                disabled={isPending}
                onClick={submitNewMember}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    submitNewMember()
                  }
                }}
              >
                <Shield size={14} />
                {isPending ? 'Saving...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
