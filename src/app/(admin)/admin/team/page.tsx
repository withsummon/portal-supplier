'use client';

import { useState } from 'react';
import { Users, Plus, Search, MoreVertical, Mail, Phone, Shield, UserCheck, UserPlus, X, Building2, Star } from 'lucide-react';

interface AdminTeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'active' | 'pending' | 'inactive';
    joinedAt: string;
    verified: boolean;
}

const MOCK_ADMIN_TEAM: AdminTeamMember[] = [
    {
        id: '1',
        name: 'Rina Hartati',
        email: 'rina@withsummon.com',
        role: 'Platform Administrator',
        department: 'Operations',
        status: 'active',
        joinedAt: 'Jan 15, 2024',
        verified: true,
    },
    {
        id: '2',
        name: 'Reza Mahendra',
        email: 'reza@withsummon.com',
        role: 'Technical Reviewer',
        department: 'Engineering',
        status: 'active',
        joinedAt: 'Feb 1, 2024',
        verified: true,
    },
    {
        id: '3',
        name: 'Dewi Lestari',
        email: 'dewi@withsummon.com',
        role: 'Vendor Relations',
        department: 'Business Development',
        status: 'active',
        joinedAt: 'Mar 10, 2024',
        verified: true,
    },
    {
        id: '4',
        name: 'Fajar Rahman',
        email: 'fajar@withsummon.com',
        role: 'Project Coordinator',
        department: 'Operations',
        status: 'active',
        joinedAt: 'Apr 5, 2024',
        verified: true,
    },
    {
        id: '5',
        name: 'Nina Kusuma',
        email: 'nina@withsummon.com',
        role: 'Quality Assurance',
        department: 'Operations',
        status: 'pending',
        joinedAt: 'Pending',
        verified: false,
    },
];

const DEPARTMENTS = ['Operations', 'Engineering', 'Business Development', 'Support', 'Marketing'];
const ROLES = ['Platform Administrator', 'Technical Reviewer', 'Vendor Relations', 'Project Coordinator', 'Quality Assurance', 'Support Staff'];

export default function AdminTeamPage() {
    const [team, setTeam] = useState<AdminTeamMember[]>(MOCK_ADMIN_TEAM);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        role: 'Support Staff',
        department: 'Operations',
    });

    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeMembers = team.filter(m => m.status === 'active').length;
    const pendingMembers = team.filter(m => m.status === 'pending').length;

    const handleAddMember = () => {
        if (!newMember.name || !newMember.email) return;

        const member: AdminTeamMember = {
            id: Date.now().toString(),
            ...newMember,
            status: 'pending',
            joinedAt: 'Pending',
            verified: false,
        };

        setTeam(prev => [...prev, member]);
        setNewMember({ name: '', email: '', role: 'Support Staff', department: 'Operations' });
        setShowAddModal(false);
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Management</h1>
                    <p className="page-subtitle">Manage your Summon team members and their roles.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ gap: '6px' }}>
                    <UserPlus size={16} />
                    Add Team Member
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                <div className="card" style={{ padding: 'var(--sp-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Users size={20} color="var(--blue-600)" />
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
                            width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <UserCheck size={20} color="var(--color-success)" />
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
                            width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Shield size={20} color="var(--color-warning)" />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>{pendingMembers}</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Pending</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="input"
                        placeholder="Search by name, email, role, or department..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                    />
                </div>
            </div>

            {/* Team Table */}
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
                            {filteredTeam.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: 'var(--radius-full)',
                                                background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--blue-700)',
                                            }}>
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{member.name}</span>
                                                    {member.verified && (
                                                        <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                                                    )}
                                                </div>
                                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: 'var(--fs-sm)' }}>{member.role}</span>
                                    </td>
                                    <td>
                                        <span style={{ 
                                            fontSize: 'var(--fs-xs)', 
                                            padding: '2px 8px', 
                                            borderRadius: 'var(--radius-full)',
                                            background: 'var(--neutral-100)',
                                            color: 'var(--text-secondary)',
                                        }}>
                                            {member.department}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${member.status === 'active' ? 'success' : member.status === 'pending' ? 'warning' : 'neutral'}`}>
                                            {member.status === 'active' ? 'Active' : member.status === 'pending' ? 'Pending' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{member.joinedAt}</span>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm" title="More options">
                                            <MoreVertical size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
                            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>Add Team Member</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name <span className="form-required">*</span></label>
                                <input
                                    className="input"
                                    placeholder="Enter full name"
                                    value={newMember.name}
                                    onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address <span className="form-required">*</span></label>
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="name@withsummon.com"
                                    value={newMember.email}
                                    onChange={e => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    className="select"
                                    value={newMember.role}
                                    onChange={e => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                                >
                                    {ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    className="select"
                                    value={newMember.department}
                                    onChange={e => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                                >
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-6)' }}>
                            <button className="btn btn-primary" onClick={handleAddMember} style={{ flex: 1 }}>
                                Add Member
                            </button>
                            <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
