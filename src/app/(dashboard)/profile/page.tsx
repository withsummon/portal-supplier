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
    Camera
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [logoImage, setLogoImage] = useState<string | null>(null);

    // Load logo from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('company-logo');
            if (stored) {
                setLogoImage(stored);
            }
        } catch { /* empty */ }
    }, []);

    // Controlled form state — avoids hydration mismatch from defaultValue
    const [form, setForm] = useState({
        description: 'We are a leading technology consulting firm specializing in helping enterprise clients across Southeast Asia implement cutting-edge AI and automation solutions.',
        website: 'https://aryateknologi.com',
        location: 'Jakarta, Indonesia',
        employees: '51-200 employees',
        email: 'info@aryateknologi.com',
        whatsapp: '+62 812 3456 7890',
        industry: 'Technology & IT Services',
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image must be less than 2MB');
                return;
            }
            // Read and display the image
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setLogoImage(result);
                // Save to localStorage
                try {
                    localStorage.setItem('company-logo', result);
                } catch { /* empty */ }
            };
            reader.readAsDataURL(file);
        }
    };

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
                    <h1 className="page-title">Company Profile</h1>
                    <p className="page-subtitle">Manage your company details and brand identity.</p>
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

            {/* Header Card with Logo */}
            <div className="card" style={{
                padding: 'var(--sp-6)',
                marginBottom: 'var(--sp-6)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-5)',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-lg)',
                    background: logoImage ? 'transparent' : 'var(--neutral-100)',
                    border: logoImage ? 'none' : '2px dashed var(--border-strong)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: logoImage ? 'flex-start' : 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: 'var(--text-muted)',
                    transition: 'all 150ms ease',
                    overflow: 'hidden',
                    padding: 0,
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{
                            position: 'absolute',
                            width: '80px',
                            height: '80px',
                            opacity: 0,
                            cursor: 'pointer',
                        }}
                    />
                    {logoImage ? (
                        <img
                            src={logoImage}
                            alt="Company Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <>
                            <Camera size={20} />
                            <span style={{ fontSize: '9px', marginTop: '4px', fontWeight: 'var(--fw-semibold)' }}>Upload</span>
                        </>
                    )}
                </div>
                <div>
                    <h2 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-bold)', marginBottom: '4px' }}>PT Arya Teknologi</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>System Integrator &amp; AI Solutions Provider</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--sp-3)' }}>
                        <span className="badge badge-accepted">Verified Supplier</span>
                        <span className="badge badge-submitted">Gold Partner</span>
                    </div>
                </div>
            </div>

            {/* Details Form */}
            <div className="card" style={{ padding: 'var(--sp-8)' }}>
                <div className="card-title" style={{ marginBottom: 'var(--sp-6)' }}>Company Information</div>

                <div className="grid-2" style={{ gap: 'var(--sp-6)' }}>
                    {/* Company Description — Full Width */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Company Description</label>
                        <textarea
                            className="input input-textarea"
                            rows={4}
                            value={form.description}
                            onChange={e => updateField('description', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Website</label>
                        <div style={{ position: 'relative' }}>
                            <Globe size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input" style={{ paddingLeft: '36px' }}
                                value={form.website} onChange={e => updateField('website', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input" style={{ paddingLeft: '36px' }}
                                value={form.location} onChange={e => updateField('location', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Number of Employees</label>
                        <div style={{ position: 'relative' }}>
                            <Users size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', zIndex: 1 }} />
                            <select className="select" style={{ paddingLeft: '36px' }}
                                value={form.employees} onChange={e => updateField('employees', e.target.value)}>
                                <option>1-10 employees</option>
                                <option>11-50 employees</option>
                                <option>51-200 employees</option>
                                <option>201-500 employees</option>
                                <option>500+ employees</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                            <input type="email" className="input" style={{ paddingLeft: '36px' }}
                                value={form.email} onChange={e => updateField('email', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">WhatsApp Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input" style={{ paddingLeft: '36px' }}
                                value={form.whatsapp} onChange={e => updateField('whatsapp', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Industry</label>
                        <select className="select" value={form.industry} onChange={e => updateField('industry', e.target.value)}>
                            <option>Technology &amp; IT Services</option>
                            <option>Financial Services</option>
                            <option>Manufacturing</option>
                            <option>Healthcare</option>
                            <option>Retail &amp; E-commerce</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Attachment — Full Width */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Company Profile (PDF)</label>
                        <div className="file-item">
                            <div className="file-item-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                                <FileText size={18} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="file-item-name">PT_Arya_Teknologi_Profile_2024.pdf</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>2.4 MB • Uploaded on Feb 10, 2024</div>
                            </div>
                            <button className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
                                <Upload size={13} />
                                Replace
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Section */}
            <div className="card" style={{ padding: 'var(--sp-8)', marginTop: 'var(--sp-6)' }}>
                <div className="card-title" style={{ marginBottom: 'var(--sp-6)' }}>Account</div>
                <div className="grid-2" style={{ gap: 'var(--sp-6)' }}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="input" value="Budi Santoso" readOnly style={{ background: 'var(--neutral-50)', color: 'var(--text-muted)' }} />
                        <span className="form-hint">Contact Summon admin to change your name.</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="input" value="budi.santoso@aryateknologi.com" readOnly style={{ background: 'var(--neutral-50)', color: 'var(--text-muted)' }} />
                        <span className="form-hint">This is your login email and cannot be changed.</span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <input type="text" className="input" value="Seller" readOnly style={{ background: 'var(--neutral-50)', color: 'var(--text-muted)' }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Member Since</label>
                        <input type="text" className="input" value="February 1, 2024" readOnly style={{ background: 'var(--neutral-50)', color: 'var(--text-muted)' }} />
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div style={{
                    position: 'fixed',
                    bottom: 'var(--sp-8)',
                    right: 'var(--sp-8)',
                    background: 'var(--color-success)',
                    color: 'white',
                    padding: 'var(--sp-4) var(--sp-6)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 'var(--fw-semibold)',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease',
                }}>
                    ✓ Profile saved successfully
                </div>
            )}
        </div>
    );
}
