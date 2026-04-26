'use client';

import {
    User,
    Building2,
    Globe,
    Mail,
    ShieldCheck,
    Calendar,
    Edit3,
    Camera
} from 'lucide-react';
import { formatDate } from '@/lib/utils/data';

export interface VendorProfileProps {
    id: string;
    companyName: string;
    industry: string | null;
    companySize: string | null;
    website: string | null;
    tier: string;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string | null;
        email: string;
        createdAt: string;
        updatedAt: string;
    };
}

export default function VendorProfileClient({ vendor }: { vendor: VendorProfileProps }) {
    const displayName = vendor.user.name ?? vendor.companyName;
    const displayInitials = displayName.charAt(0).toUpperCase();
    const tierLabel = vendor.tier.charAt(0) + vendor.tier.slice(1).toLowerCase();
    const websiteDisplay = vendor.website?.split('//')[1] ?? '-';

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Vendor Profile</h1>
                    <p className="page-subtitle">Manage your company information and settings.</p>
                </div>
                <button className="btn btn-primary" style={{ gap: '8px' }}>
                    <Edit3 size={15} /> Edit Profile
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--sp-8)' }}>
                {/* Profile Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                    <div className="card" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto var(--sp-6)' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 'var(--radius-3xl)',
                                background: 'var(--blue-600)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                fontWeight: 'var(--fw-bold)',
                                boxShadow: 'var(--shadow-lg)'
                            }}>
                                {displayInitials}
                            </div>
                            <button style={{
                                position: 'absolute',
                                bottom: '-8px',
                                right: '-8px',
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-full)',
                                background: 'white',
                                border: '1px solid var(--border-default)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <Camera size={16} />
                            </button>
                        </div>
                        <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', marginBottom: '4px' }}>{displayName}</h2>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--sp-2)',
                            padding: '4px 12px',
                            background: 'var(--color-purple-bg)',
                            color: 'var(--color-purple)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--fs-xs)',
                            fontWeight: 'var(--fw-bold)',
                            marginBottom: 'var(--sp-6)'
                        }}>
                            <ShieldCheck size={12} />
                            {tierLabel} Tier Vendor
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 'var(--sp-6)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                                <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                                    <Mail size={16} className="text-muted" />
                                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{vendor.user.email}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                                    <Globe size={16} className="text-muted" />
                                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--blue-600)' }}>{websiteDisplay}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                                    <Calendar size={16} className="text-muted" />
                                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>Joined {formatDate(vendor.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                    <div className="card">
                        <div className="card-header"><h3 className="card-title">Company Information</h3></div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)' }}>
                                <div className="form-group">
                                    <label className="form-label">Legal Company Name</label>
                                    <input className="input" defaultValue={vendor.companyName} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Industry</label>
                                    <input className="input" defaultValue={vendor.industry ?? ''} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company Size</label>
                                    <select className="select" defaultValue={vendor.companySize ?? ''}>
                                        <option value="">Select company size</option>
                                        <option>1-10 employees</option>
                                        <option>10-20 employees</option>
                                        <option>20-50 employees</option>
                                        <option>50-200 employees</option>
                                        <option>200+ employees</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input className="input" defaultValue="Jakarta, Indonesia" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><h3 className="card-title">Security & Access</h3></div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>Email Address</div>
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Primary email for all notifications</div>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Change Email</button>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-default)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>Password</div>
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Last changed 3 months ago</div>
                                    </div>
                                    <button className="btn btn-secondary btn-sm">Update Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
