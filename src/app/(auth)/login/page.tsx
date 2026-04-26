'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, Zap, Shield, TrendingUp, Building2, Users, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/actions/auth';

type UserRole = 'seller' | 'vendor' | 'admin';

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
    {
        id: 'admin' as UserRole,
        label: 'Summon Team',
        icon: ShieldCheck,
        desc: 'Verify and route submissions.',
        domain: '@withsummon.com',
    },
];

type SignInState = {
    error?: string;
    success?: boolean;
} | null;

const redirectMap: Record<UserRole, string> = {
    admin: '/admin',
    vendor: '/vendor',
    seller: '/dashboard',
};

async function handleSignIn(_prevState: SignInState, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as UserRole;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const expectedRole =
        role === 'admin' ? 'ADMIN' : role === 'vendor' ? 'VENDOR' : 'SELLER';

    const result = await signIn({ email, password, expectedRole });

    if (result.error) {
        return { error: result.error };
    }

    return { success: true };
}

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>('seller');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, formAction, isPending] = useActionState(handleSignIn, null);

    useEffect(() => {
        if (!state?.success) {
            return;
        }

        router.push(redirectMap[selectedRole]);
        router.refresh();
    }, [router, selectedRole, state]);

    return (
        <div className="auth-layout">
            {/* Form Panel */}
            <div className="auth-panel">
                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-logo">S</div>
                    <span className="auth-brand-name">Summon</span>
                </div>

                <div className="auth-form animate-in">
                    <h1 className="auth-heading">Welcome back</h1>
                    <p className="auth-sub" style={{ marginBottom: 'var(--sp-6)' }}>
                        Sign in to the {roles.find(r => r.id === selectedRole)?.label} Portal to continue.
                    </p>

                    {/* Role Selection */}
                    <div style={{ marginBottom: 'var(--sp-8)' }}>
                        <label className="form-label" style={{ marginBottom: 'var(--sp-3)', display: 'block' }}>
                            Select Workspace Role
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)' }}>
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
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: 'var(--sp-3) var(--sp-2)',
                                            background: isSelected ? 'var(--blue-50)' : 'var(--neutral-50)',
                                            border: `1px solid ${isSelected ? 'var(--blue-500)' : 'var(--border-default)'}`,
                                            borderRadius: 'var(--radius-lg)',
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                            gap: 'var(--sp-2)',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div style={{
                                            color: isSelected ? 'var(--blue-600)' : 'var(--text-muted)',
                                            background: isSelected ? 'var(--white)' : 'transparent',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 'var(--radius-md)',
                                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                                        }}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: 'var(--fs-xs)',
                                                fontWeight: 'var(--fw-bold)',
                                                color: isSelected ? 'var(--blue-700)' : 'var(--text-primary)'
                                            }}>
                                                {role.label}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <p style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            marginTop: 'var(--sp-2)',
                            textAlign: 'center'
                        }}>
                            {roles.find(r => r.id === selectedRole)?.desc}
                        </p>
                    </div>

                    <form action={formAction}>
                        <input type="hidden" name="role" value={selectedRole} />

                        {state?.error && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--sp-2)',
                                padding: 'var(--sp-3)',
                                background: 'var(--color-danger-bg)',
                                border: '1px solid var(--color-danger)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--sp-4)',
                                color: 'var(--color-danger)',
                                fontSize: 'var(--fs-sm)',
                            }}>
                                <AlertCircle size={16} />
                                {state.error}
                            </div>
                        )}

                        <div className="auth-fields">
                            <div className="form-group">
                                <label className="form-label">
                                    Email address
                                    {selectedRole === 'admin' && <span style={{ color: 'var(--color-danger)', marginLeft: '4px' }}>*</span>}
                                </label>
                                <input
                                    className="input"
                                    type="email"
                                    name="email"
                                    placeholder={selectedRole === 'admin' ? 'you@withsummon.com' : 'you@company.com'}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                {selectedRole === 'admin' && (
                                    <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>
                                        Only @withsummon.com emails can access the Summon Team portal
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="input"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{ paddingRight: '44px' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-muted)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Link
                                    href="/forgot-password"
                                    style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-accent)', fontWeight: 'var(--fw-medium)' }}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 'var(--sp-4)' }}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)' }}>
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    Signing in...
                                </span>
                            ) : (
                                `Sign in to ${roles.find(r => r.id === selectedRole)?.label} Portal`
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 'var(--sp-6)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" style={{ color: 'var(--text-accent)', fontWeight: 'var(--fw-semibold)' }}>
                            Register as Seller
                        </Link>
                    </p>
                </div>
            </div>

            {/* Hero Panel */}
            <div className="auth-hero">
                <div className="auth-hero-content">
                    <div className="auth-hero-eyebrow">
                        <Zap size={11} />
                        B2B Project Exchange Platform
                    </div>
                    <h2 className="auth-hero-title">
                        Submit. Track.<br />Execute with confidence.
                    </h2>
                    <p className="auth-hero-desc">
                        Summon connects businesses with vetted execution partners through a structured, enterprise-grade workflow.
                    </p>

                    <div className="auth-feature-list">
                        {[
                            { icon: CheckCircle, text: 'Structured project submission in minutes' },
                            { icon: Shield, text: 'Admin-reviewed quality assurance' },
                            { icon: TrendingUp, text: 'Real-time status tracking & transparency' },
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

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
