'use client';

import {
    Building2,
    Globe,
    Mail,
    Phone,
    Users,
    MapPin,
    FileText,
    Upload,
    Save,
    Camera,
    Shield,
    Settings,
    Bell
} from 'lucide-react';
import { useState } from 'react';

export default function AdminProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Controlled form state
    const [form, setForm] = useState({
        fullName: 'Rina Hartati',
        email: 'rina@withsummon.com',
        phone: '+62 812 3456 7890',
        department: 'Operations',
        role: 'Platform Administrator',
        location: 'Jakarta, Indonesia',
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        projectUpdates: true,
        vendorApplications: true,
        weeklyReports: true,
    });

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1500);
    };

    return (
        <div className="animate-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Profile</h1>
                    <p className="page-subtitle">Manage your profile settings and preferences.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ gap: '8px' }}
                >
                    <Save size={15} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div style={{
                    position: 'fixed', top: '80px', right: '20px',
                    background: 'var(--color-success)', color: 'white',
                    padding: 'var(--sp-3) var(--sp-5)', borderRadius: 'var(--radius-md)',
                    fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                }}>
                    <Shield size={16} />
                    Profile updated successfully
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-5)' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                    {/* Profile Card */}
                    <div className="card">
                        <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--border-default)' }}>
                            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>Personal Information</h2>
                        </div>
                        <div style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                            {/* Avatar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: 'var(--radius-full)',
                                    background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--blue-700)',
                                    position: 'relative',
                                }}>
                                    RH
                                    <div style={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        background: 'var(--color-success)', border: '3px solid white',
                                    }} />
                                </div>
                                <div>
                                    <button className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                                        <Camera size={14} />
                                        Change Photo
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        className="input"
                                        value={form.fullName}
                                        onChange={e => updateField('fullName', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        className="input"
                                        type="email"
                                        value={form.email}
                                        onChange={e => updateField('email', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        className="input"
                                        value={form.phone}
                                        onChange={e => updateField('phone', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        className="input"
                                        value={form.location}
                                        onChange={e => updateField('location', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <select
                                        className="select"
                                        value={form.department}
                                        onChange={e => updateField('department', e.target.value)}
                                    >
                                        <option>Operations</option>
                                        <option>Engineering</option>
                                        <option>Business Development</option>
                                        <option>Support</option>
                                        <option>Marketing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <input
                                        className="input"
                                        value={form.role}
                                        disabled
                                        style={{ background: 'var(--neutral-100)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="card">
                        <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--border-default)' }}>
                            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                                <Bell size={18} />
                                Notification Preferences
                            </h2>
                        </div>
                        <div style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                            {[
                                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                { key: 'projectUpdates', label: 'Project Updates', desc: 'Get notified when projects are submitted or updated' },
                                { key: 'vendorApplications', label: 'Vendor Applications', desc: 'Receive alerts for new vendor applications' },
                                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly platform performance reports' },
                            ].map(item => (
                                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{item.label}</div>
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{item.desc}</div>
                                    </div>
                                    <label style={{ position: 'relative', width: '44px', height: '24px' }}>
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.key as keyof typeof notifications]}
                                            onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute', cursor: 'pointer', inset: 0,
                                            background: notifications[item.key as keyof typeof notifications] ? 'var(--blue-600)' : 'var(--neutral-300)',
                                            borderRadius: 'var(--radius-full)',
                                            transition: 'var(--transition-fast)',
                                        }}>
                                            <span style={{
                                                position: 'absolute', width: '18px', height: '18px',
                                                borderRadius: '50%', background: 'white',
                                                top: '3px', left: notifications[item.key as keyof typeof notifications] ? '23px' : '3px',
                                                transition: 'var(--transition-fast)',
                                            }} />
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                    {/* Admin Info Card */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: 'var(--radius-full)',
                                background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--blue-700)',
                                margin: '0 auto var(--sp-3)',
                            }}>
                                RH
                            </div>
                            <h3 style={{ fontWeight: 'var(--fw-bold)', marginBottom: '4px' }}>{form.fullName}</h3>
                            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>{form.role}</p>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: 'var(--color-success-bg)', color: 'var(--color-success)',
                                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                            }}>
                                <Shield size={12} />
                                Verified Admin
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--sp-5)', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--sp-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                                <Mail size={14} />
                                {form.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                                <Phone size={14} />
                                {form.phone}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                                <MapPin size={14} />
                                {form.location}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                        <h4 style={{ fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-4)' }}>Platform Stats</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Total Sellers</span>
                                <span style={{ fontWeight: 'var(--fw-semibold)' }}>24</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Total Vendors</span>
                                <span style={{ fontWeight: 'var(--fw-semibold)' }}>18</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Active Projects</span>
                                <span style={{ fontWeight: 'var(--fw-semibold)' }}>12</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>This Month</span>
                                <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-success)' }}>+5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
