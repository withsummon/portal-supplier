'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, Zap, Shield, TrendingUp, Building2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

type UserRole = 'seller' | 'vendor';

const roles = [
    {
        id: 'seller' as UserRole,
        label: 'Seller',
        icon: Building2,
        desc: 'Submit and track projects.',
    },
    {
        id: 'vendor' as UserRole,
        label: 'Vendor',
        icon: Users,
        desc: 'Find and execute client projects.',
    },
];

const industries = [
    'Technology', 'Construction', 'Manufacturing', 'Retail & E-Commerce',
    'Healthcare', 'Education', 'Finance & Banking', 'Marketing & Advertising',
    'Logistics & Supply Chain', 'Consulting', 'Other',
];

const companySizes = [
    '1–10 employees', '11–50 employees', '51–200 employees',
    '201–500 employees', '500+ employees',
];

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>('seller');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app we'd save to a provider/context, here we pass role as query param
        router.push(`/onboarding?role=${selectedRole}`);
    };

    return (
        <div className="auth-layout">
            {/* Form Panel */}
            <div className="auth-panel" style={{ overflowY: 'auto' }}>
                <div className="auth-brand">
                    <div className="auth-logo">S</div>
                    <span className="auth-brand-name">Summon</span>
                </div>

                <div className="auth-form animate-in">
                    <h1 className="auth-heading">Create your account</h1>
                    <p className="auth-sub">
                        Join as a {roles.find(r => r.id === selectedRole)?.label} to start using Summon.
                    </p>

                    {/* Role Selection */}
                    <div style={{ marginBottom: 'var(--sp-6)', marginTop: 'var(--sp-4)' }}>
                        <label className="form-label" style={{ marginBottom: 'var(--sp-3)', display: 'block' }}>
                            Select your path
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-3)' }}>
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            padding: 'var(--sp-3)',
                                            background: isSelected ? 'var(--blue-50)' : 'var(--neutral-50)',
                                            border: `1px solid ${isSelected ? 'var(--blue-500)' : 'var(--border-default)'}`,
                                            borderRadius: 'var(--radius-lg)',
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                            gap: 'var(--sp-3)',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{
                                            color: isSelected ? 'var(--blue-600)' : 'var(--text-muted)',
                                            background: isSelected ? 'var(--white)' : 'transparent',
                                            minWidth: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 'var(--radius-md)',
                                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                                            marginTop: '2px'
                                        }}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: 'var(--fs-sm)',
                                                fontWeight: 'var(--fw-bold)',
                                                color: isSelected ? 'var(--blue-700)' : 'var(--text-primary)',
                                                marginBottom: '2px'
                                            }}>
                                                {role.label}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: isSelected ? 'var(--blue-600)' : 'var(--text-muted)',
                                                lineHeight: '1.2'
                                            }}>
                                                {role.desc}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <form className="auth-fields" onSubmit={handleRegister}>
                        {/* Personal */}
                        <div
                            style={{
                                fontSize: 'var(--fs-xs)',
                                fontWeight: 'var(--fw-semibold)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: 'var(--text-muted)',
                                marginBottom: 'var(--sp-1)',
                            }}
                        >
                            Personal Information
                        </div>

                        <div className="grid-2" style={{ gap: 'var(--sp-3)' }}>
                            <div className="form-group">
                                <label className="form-label">First name <span className="form-required">*</span></label>
                                <input required className="input" type="text" placeholder="Budi" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last name <span className="form-required">*</span></label>
                                <input required className="input" type="text" placeholder="Santoso" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email address <span className="form-required">*</span></label>
                            <input required className="input" type="email" placeholder="budi@company.com" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password <span className="form-required">*</span></label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    required
                                    className="input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Minimum 8 characters"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%',
                                        transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                        background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Company */}
                        <div
                            style={{
                                fontSize: 'var(--fs-xs)',
                                fontWeight: 'var(--fw-semibold)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: 'var(--text-muted)',
                                marginTop: 'var(--sp-2)',
                                marginBottom: 'var(--sp-1)',
                            }}
                        >
                            Company Information
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company name <span className="form-required">*</span></label>
                            <input required className="input" type="text" placeholder="PT Arya Teknologi" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company website</label>
                            <input className="input" type="url" placeholder="https://yourcompany.com" />
                        </div>

                        <div className="grid-2" style={{ gap: 'var(--sp-3)' }}>
                            <div className="form-group">
                                <label className="form-label">Industry <span className="form-required">*</span></label>
                                <select required className="select">
                                    <option value="">Select industry</option>
                                    {industries.map((i) => <option key={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company size <span className="form-required">*</span></label>
                                <select required className="select">
                                    <option value="">Select size</option>
                                    {companySizes.map((s) => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Terms */}
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', cursor: 'pointer', marginTop: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                            <input required type="checkbox" style={{ marginTop: '2px', accentColor: 'var(--blue-600)', flexShrink: 0 }} />
                            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                I agree to Summon&apos;s{' '}
                                <a href="#" style={{ color: 'var(--text-accent)', fontWeight: 'var(--fw-medium)' }}>Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" style={{ color: 'var(--text-accent)', fontWeight: 'var(--fw-medium)' }}>Privacy Policy</a>.
                            </span>
                        </label>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Continue to Onboarding
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 'var(--sp-6)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--text-accent)', fontWeight: 'var(--fw-semibold)' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Hero Panel */}
            <div className="auth-hero">
                <div className="auth-hero-content">
                    <div className="auth-hero-eyebrow">
                        <Zap size={11} />
                        Trusted by 200+ Companies
                    </div>
                    <h2 className="auth-hero-title">
                        Your projects deserve the best execution.
                    </h2>
                    <p className="auth-hero-desc">
                        Register in minutes and gain access to Summon&apos;s network of vetted execution partners. Structured, transparent, and enterprise-ready.
                    </p>

                    <div className="auth-feature-list">
                        {[
                            { icon: CheckCircle, text: 'No complicated onboarding — get started fast' },
                            { icon: Shield, text: 'All vendors are pre-screened and verified' },
                            { icon: TrendingUp, text: 'End-to-end project visibility from day one' },
                        ].map(({ icon: Icon, text }) => (
                            <div className="auth-feature-item" key={text}>
                                <div className="auth-feature-dot">
                                    <Icon size={11} />
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
