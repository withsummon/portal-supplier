'use client';

import { useState } from 'react';
import { Users, Plus, Search, MoreVertical, Mail, Phone, Trash2, Edit2, Shield, UserCheck, UserPlus, X } from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'active' | 'pending' | 'inactive';
    joinedAt: string;
    avatar?: string;
}

const MOCK_TEAM: TeamMember[] = [
    {
        id: '1',
        name: 'Budi Santoso',
        email: 'budi.santoso@aryateknologi.com',
        phone: '+62 812 3456 7890',
        role: 'Owner',
        status: 'active',
        joinedAt: 'Feb 1, 2024',
    },
    {
        id: '2',
        name: 'Ani Wijaya',
        email: 'ani.wijaya@aryateknologi.com',
        phone: '+62 812 3456 7891',
        role: 'Project Manager',
        status: 'active',
        joinedAt: 'Mar 15, 2024',
    },
    {
        id: '3',
        name: 'Rico Hutapea',
        email: 'rico.hutapea@aryateknologi.com',
        phone: '+62 812 3456 7892',
        role: 'Sales Lead',
        status: 'active',
        joinedAt: 'Apr 1, 2024',
    },
    {
        id: '4',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@aryateknologi.com',
        phone: '+62 812 3456 7893',
        role: 'Technical Lead',
        status: 'pending',
        joinedAt: 'Pending',
    },
];

const ROLES = ['Project Manager', 'Sales Lead', 'Technical Lead', 'Developer', 'Designer', 'Analyst', 'Support'];

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Developer',
    });

    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeMembers = team.filter(m => m.status === 'active').length;
    const pendingMembers = team.filter(m => m.status === 'pending').length;

    const handleAddMember = () => {
        if (!newMember.name || !newMember.email) return;

        const member: TeamMember = {
            id: Date.now().toString(),
            name: newMember.name,
            email: newMember.email,
            phone: newMember.phone,
            role: newMember.role,
            status: 'pending',
            joinedAt: 'Pending',
        };

        setTeam([...team, member]);
        setNewMember({ name: '', email: '', phone: '', role: 'Developer' });
        setShowAddModal(false);
    };

    const handleDeleteMember = (id: string) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            setTeam(team.filter(m => m.id !== id));
        }
    };

    const handleUpdateRole = (id: string, newRole: string) => {
        setTeam(team.map(m => m.id === id ? { ...m, role: newRole } : m));
        setEditingMember(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return { bg: 'var(--color-success-bg)', color: 'var(--color-success)' };
            case 'pending':
                return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
            case 'inactive':
                return { bg: 'var(--neutral-100)', color: 'var(--text-muted)' };
            default:
                return { bg: 'var(--neutral-100)', color: 'var(--text-muted)' };
        }
    };

    const getRoleIcon = (role: string) => {
        if (role === 'Owner') return Shield;
        if (role.includes('Manager')) return UserCheck;
        return UserPlus;
    };

    return (
        <div className="animate-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team</h1>
                    <p className="page-subtitle">Manage your team members and their access.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={15} />
                    Add Member
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                <div className="card" style={{ padding: 'var(--sp-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Users size={20} style={{ color: 'var(--blue-600)' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{team.length}</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Total Members</div>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: 'var(--sp-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <UserCheck size={20} style={{ color: 'var(--color-success)' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{activeMembers}</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Active</div>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: 'var(--sp-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <UserPlus size={20} style={{ color: 'var(--color-warning)' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{pendingMembers}</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Pending</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '36px' }}
                    />
                </div>
            </div>

            {/* Team List */}
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
                            {filteredTeam.map((member) => {
                                const RoleIcon = getRoleIcon(member.role);
                                const statusStyle = getStatusColor(member.status);
                                return (
                                    <tr key={member.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                                <div style={{
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
                                                }}>
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'var(--fw-semibold)' }}>{member.name}</div>
                                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                                                <RoleIcon size={14} style={{ color: 'var(--text-muted)' }} />
                                                {editingMember?.id === member.id ? (
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                                                        className="select"
                                                        style={{ padding: '4px 8px', fontSize: 'var(--fs-xs)' }}
                                                        autoFocus
                                                        onBlur={() => setEditingMember(null)}
                                                    >
                                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                ) : (
                                                    <span style={{ fontSize: 'var(--fs-sm)' }}>{member.role}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontSize: 'var(--fs-xs)',
                                                fontWeight: 'var(--fw-semibold)',
                                                padding: '2px 8px',
                                                borderRadius: 'var(--radius-full)',
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                textTransform: 'capitalize',
                                            }}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={12} /> {member.email}
                                                </div>
                                                {member.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                        <Phone size={12} /> {member.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{member.joinedAt}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => setEditingMember(member)}
                                                    style={{ padding: '6px' }}
                                                    title="Edit role"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                {member.role !== 'Owner' && (
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => handleDeleteMember(member.id)}
                                                        style={{ padding: '6px', color: 'var(--color-danger)' }}
                                                        title="Remove member"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }} onClick={() => setShowAddModal(false)}>
                    <div className="card" style={{ width: '480px', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
                            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>Add Team Member</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter full name"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="Enter email address"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="Enter phone number"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="select"
                                value={newMember.role}
                                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            >
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-5)' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleAddMember}
                                disabled={!newMember.name || !newMember.email}
                            >
                                <UserPlus size={15} />
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
