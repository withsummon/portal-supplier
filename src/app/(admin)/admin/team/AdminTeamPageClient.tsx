'use client'

import type { LucideIcon } from 'lucide-react'
import { CheckCircle, Mail, Search, Shield, Star, Trash2, UserPlus, Users, X } from 'lucide-react'
import { useAdminTeam } from '@/hooks/use-admin-team'
import type { AdminTeamMemberDto } from '@/lib/data/teams'

const DEPARTMENTS = ['Operations', 'Engineering', 'Business Development', 'Support', 'Marketing']
const ROLES = [
  'Platform Administrator',
  'Technical Reviewer',
  'Partner Relations',
  'Project Coordinator',
  'Quality Assurance',
  'Support Staff',
]

const ADMIN_TEAM_STATS: Array<{
  label: string
  icon: LucideIcon
  background: string
  color: string
  getValue: (members: AdminTeamMemberDto[]) => number
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
    icon: CheckCircle,
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    getValue: (members) => members.filter((member) => member.status === 'active').length,
  },
  {
    label: 'Pending',
    icon: Shield,
    background: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
    getValue: (members) => members.filter((member) => member.status === 'pending').length,
  },
]

export default function AdminTeamPageClient({
  initialMembers,
}: {
  initialMembers: AdminTeamMemberDto[]
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
    updateMember,
    removeMember,
    isPending,
  } = useAdminTeam(initialMembers)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Management</h1>
          <p className="page-subtitle">Manage your Summon team members and their roles.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} />
          Add Team Member
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
        {ADMIN_TEAM_STATS.map(({ label, icon: Icon, background, color, getValue }) => (
          <div key={label} className="card" style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
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

      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
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
            placeholder="Search by name, email, role, or department..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--blue-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-bold)',
                          color: 'var(--blue-700)',
                        }}
                      >
                        {member.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}
                          >
                            {member.name}
                          </span>
                          {member.verified && (
                            <Star
                              size={12}
                              fill="var(--color-warning)"
                              color="var(--color-warning)"
                            />
                          )}
                        </div>
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
                      onChange={(event) => updateMember(member.id, { role: event.target.value })}
                      style={{ padding: '6px 10px', fontSize: 'var(--fs-xs)' }}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="select"
                      value={member.department}
                      onChange={(event) =>
                        updateMember(member.id, { department: event.target.value })
                      }
                      style={{ padding: '6px 10px', fontSize: 'var(--fs-xs)' }}
                    >
                      {DEPARTMENTS.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className={`badge badge-${member.status === 'active' ? 'accepted' : member.status === 'pending' ? 'submitted' : 'rejected'}`}
                      type="button"
                      aria-label={`Set ${member.name} status to ${
                        member.status === 'active' ? 'pending' : 'active'
                      }`}
                      onClick={() => {
                        const nextStatus = member.status === 'active' ? 'pending' : 'active'
                        if (!window.confirm(`Set ${member.name} to ${nextStatus}?`)) return
                        updateMember(member.id, {
                          status: nextStatus,
                          verified: member.status !== 'active',
                        })
                      }}
                    >
                      {member.status}
                    </button>
                  </td>
                  <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      aria-label={`Delete ${member.name}`}
                      title="Delete team member"
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${member.name} from the admin team?`)) {
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
            aria-labelledby="admin-add-team-title"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--sp-5)',
              }}
            >
              <h2
                id="admin-add-team-title"
                style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}
              >
                Add Team Member
              </h2>
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => setShowAddModal(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setShowAddModal(false)
                  }
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
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
                  placeholder="Alicia Admin"
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
                  placeholder="alicia@summon.co"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>
              <label>
                <span className="form-label">Department</span>
                <select
                  className="select"
                  value={draft.department}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, department: event.target.value }))
                  }
                >
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
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
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                disabled={isPending}
                onClick={submitNewMember}
              >
                <Mail size={14} />
                {isPending ? 'Saving...' : 'Add Team Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
