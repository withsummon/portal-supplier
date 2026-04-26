'use client'

import { Mail, Phone, Plus, Search, Shield, Trash2, UserCheck, UserPlus, Users } from 'lucide-react'
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

export default function TeamPageClient({
  initialMembers,
}: {
  initialMembers: SellerTeamMemberDto[]
}) {
  const {
    draft,
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

  const activeMembers = members.filter((member) => member.status === 'active').length
  const pendingMembers = members.filter((member) => member.status === 'pending').length

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage your team members and their access.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowAddModal(true)}>
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
        {[
          ['Total Members', members.length, Users, 'var(--blue-50)', 'var(--blue-600)'],
          ['Active', activeMembers, UserCheck, 'var(--color-success-bg)', 'var(--color-success)'],
          ['Pending', pendingMembers, UserPlus, 'var(--color-warning-bg)', 'var(--color-warning)'],
        ].map(([label, value, Icon, bg, color]) => (
          <div key={String(label)} className="card" style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  background: String(bg),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} style={{ color: String(color) }} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
                  {value}
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
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            <h2
              style={{
                fontSize: 'var(--fs-xl)',
                fontWeight: 'var(--fw-bold)',
                marginBottom: 'var(--sp-5)',
              }}
            >
              Add Team Member
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <input
                className="input"
                placeholder="Full name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
              <input
                className="input"
                type="email"
                placeholder="Email address"
                value={draft.email}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, email: event.target.value }))
                }
              />
              <input
                className="input"
                placeholder="Phone number"
                value={draft.phone}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, phone: event.target.value }))
                }
              />
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
