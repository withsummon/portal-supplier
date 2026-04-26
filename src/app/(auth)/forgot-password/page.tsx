'use client';

import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface-page)', padding: 'var(--sp-8)',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div className="auth-brand" style={{ justifyContent: 'center', marginBottom: 'var(--sp-8)' }}>
                    <div className="auth-logo">S</div>
                    <span className="auth-brand-name">Summon</span>
                </div>

                <div className="card animate-in">
                    <div className="card-body" style={{ padding: 'var(--sp-8)' }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                            background: 'var(--blue-50)', color: 'var(--blue-600)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 'var(--sp-5)',
                        }}>
                            <Mail size={24} />
                        </div>
                        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)', letterSpacing: '-0.3px' }}>
                            Reset your password
                        </h1>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-6)', lineHeight: 'var(--lh-relaxed)' }}>
                            Enter your registered email address and we&apos;ll send you a link to reset your password.
                        </p>

                        <div className="form-group" style={{ marginBottom: 'var(--sp-5)' }}>
                            <label className="form-label">Email address</label>
                            <input className="input" type="email" placeholder="you@company.com" />
                        </div>

                        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 'var(--sp-4)' }}>
                            Send Reset Link
                        </button>

                        <Link href="/login">
                            <button className="btn btn-ghost" style={{ width: '100%', gap: 'var(--sp-2)' }}>
                                <ArrowLeft size={14} /> Back to Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
