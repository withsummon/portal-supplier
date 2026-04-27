'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  Building2,
  Users,
  ArrowRight,
} from 'lucide-react'

type UserRole = 'seller' | 'vendor'

const roles = [
  {
    id: 'seller' as UserRole,
    label: 'Seller',
    icon: Building2,
    desc: 'Submit and track projects. Access enterprise AI solutions and business insights.',
    href: '/register/seller',
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
  },
  {
    id: 'vendor' as UserRole,
    label: 'Vendor',
    icon: Users,
    desc: 'Find and execute client projects. Scale your business with high-quality leads.',
    href: '/register/vendor',
    color: 'var(--color-purple)',
    bg: 'var(--color-purple-bg)',
  },
]

export default function RegisterLandingPage() {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null)

  return (
    <div className="auth-layout">
      {/* Selection Panel */}
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-logo">S</div>
          <span className="auth-brand-name">Summon</span>
        </div>

        <div className="auth-form animate-in">
          <h1 className="auth-heading">Choose your path</h1>
          <p className="auth-sub" style={{ marginBottom: 'var(--sp-10)' }}>
            Select the workspace that matches your business goals to get started.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {roles.map((role) => {
              const Icon = role.icon
              const isHovered = hoveredRole === role.id
              return (
                <Link
                  key={role.id}
                  href={role.href}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--sp-6)',
                    background: isHovered ? role.bg : 'var(--white)',
                    border: `1px solid ${isHovered ? role.color : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-xl)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-base)',
                    gap: 'var(--sp-5)',
                    boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      background: isHovered ? role.color : 'var(--neutral-100)',
                      minWidth: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-lg)',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    <Icon size={28} style={{ color: isHovered ? 'white' : 'var(--text-muted)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 'var(--fs-lg)',
                        fontWeight: 'var(--fw-bold)',
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                      }}
                    >
                      Join as {role.label}
                      {isHovered && <ArrowRight size={16} style={{ color: role.color }} />}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--text-secondary)',
                        lineHeight: 'var(--lh-relaxed)',
                      }}
                    >
                      {role.desc}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <p
            style={{
              textAlign: 'center',
              marginTop: 'var(--sp-8)',
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
            Register in minutes and gain access to Summon&apos;s network of vetted execution
            partners. Structured, transparent, and enterprise-ready.
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
  )
}
