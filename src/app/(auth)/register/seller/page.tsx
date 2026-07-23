'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from 'lucide-react'
import { registerUser } from '@/lib/actions/auth'

const industries = [
  'Technology',
  'Construction',
  'Manufacturing',
  'Retail & E-Commerce',
  'Healthcare',
  'Education',
  'Finance & Banking',
  'Marketing & Advertising',
  'Logistics & Supply Chain',
  'Consulting',
  'Other',
]

const companySizes = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '500+ employees',
]

type RegisterState = {
  error?: string
  success?: boolean
} | null

async function handleRegister(
  _prevState: RegisterState,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const companyName = formData.get('companyName') as string
  const website = formData.get('website') as string
  const industry = formData.get('industry') as string
  const companySize = formData.get('companySize') as string
  const role = 'SELLER'

  if (!firstName || !lastName || !email || !password || !companyName) {
    return { error: 'Please fill in all required fields' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const name = `${firstName} ${lastName}`.trim()

  const result = await registerUser({
    name,
    email,
    password,
    role,
    companyName,
    website: website || undefined,
    industry: industry || undefined,
    companySize: companySize || undefined,
  })

  if (result.error) {
    return { error: result.error }
  }

  return { success: true }
}

export default function RegisterSellerPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(handleRegister, null)

  useEffect(() => {
    if (!state?.success || typeof window === 'undefined') {
      return
    }

    window.location.href = '/pending-approval?role=seller'
  }, [state])

  return (
    <div className="auth-layout">
      {/* Form Panel */}
      <div className="auth-panel" style={{ overflowY: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--sp-8)',
          }}
        >
          <div className="auth-brand" style={{ marginBottom: 0 }}>
            <div className="auth-logo">S</div>
            <span className="auth-brand-name">Summon</span>
          </div>
          <Link
            href="/register"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              fontWeight: 'var(--fw-medium)',
            }}
          >
            <ChevronLeft size={14} /> Change Role
          </Link>
        </div>

        <div className="auth-form animate-in">
          <h1 className="auth-heading">Join as a Seller</h1>
          <p className="auth-sub">
            Create your seller account to start submitting and tracking projects.
          </p>

          <form action={formAction}>
            {state?.error && (
              <div
                style={{
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
                }}
              >
                <AlertCircle size={16} />
                {state.error}
              </div>
            )}

            <div className="auth-fields">
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
                  <label className="form-label">
                    First name <span className="form-required">*</span>
                  </label>
                  <input
                    required
                    className="input"
                    type="text"
                    name="firstName"
                    placeholder="Budi"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Last name <span className="form-required">*</span>
                  </label>
                  <input
                    required
                    className="input"
                    type="text"
                    name="lastName"
                    placeholder="Santoso"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email address <span className="form-required">*</span>
                </label>
                <input
                  required
                  className="input"
                  type="email"
                  name="email"
                  placeholder="budi@company.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password <span className="form-required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Minimum 8 characters"
                    style={{ paddingRight: '44px' }}
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
                <label className="form-label">
                  Company name <span className="form-required">*</span>
                </label>
                <input
                  required
                  className="input"
                  type="text"
                  name="companyName"
                  placeholder="PT Arya Teknologi"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company website</label>
                <input
                  className="input"
                  type="text"
                  name="website"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div className="grid-2" style={{ gap: 'var(--sp-3)' }}>
                <div className="form-group">
                  <label className="form-label">
                    Industry <span className="form-required">*</span>
                  </label>
                  <select required className="select" name="industry">
                    <option value="">Select industry</option>
                    {industries.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Company size <span className="form-required">*</span>
                  </label>
                  <select required className="select" name="companySize">
                    <option value="">Select size</option>
                    {companySizes.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Terms */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--sp-3)',
                  cursor: 'pointer',
                  marginTop: 'var(--sp-2)',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                <input
                  required
                  type="checkbox"
                  style={{ marginTop: '2px', accentColor: 'var(--blue-600)', flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--lh-relaxed)',
                  }}
                >
                  I agree to Summon&apos;s Terms of Service and Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={isPending}
              >
                {isPending ? (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--sp-2)',
                    }}
                  >
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Creating account...
                  </span>
                ) : (
                  'Submit Seller Registration'
                )}
              </button>
            </div>
          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: 'var(--sp-6)',
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              style={{ color: 'var(--text-accent)', fontWeight: 'var(--fw-semibold)' }}
            >
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
          <h2 className="auth-hero-title">Your projects deserve the best execution.</h2>
          <p className="auth-hero-desc">
            Register in minutes and manage project submissions with Summon&apos;s review team.
            Structured, transparent, and enterprise-ready.
          </p>

          <div className="auth-feature-list">
            {[
              { icon: CheckCircle, text: 'No complicated onboarding — get started fast' },
              { icon: Shield, text: 'Seller accounts are reviewed by the Summon team' },
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

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
