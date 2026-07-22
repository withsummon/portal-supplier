'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Clock, ShieldCheck, ArrowRight, CheckCircle, Rocket, BarChart2 } from 'lucide-react'

function PendingApprovalContent() {
  const benefits = [
    {
      icon: Rocket,
      title: 'Submit Projects Instantly',
      desc: 'Create detailed project briefs and get reviewed by the Summon team in minutes.',
    },
    {
      icon: BarChart2,
      title: 'Real-time Tracking',
      desc: 'Monitor project milestones, communications, and deliverables in one centralized dashboard.',
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Quality',
      desc: 'Execution partners are reviewed by the Summon team for peace of mind.',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--sp-6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background elements */}
      <div
        style={{
          position: 'fixed',
          top: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--blue-100) 0%, transparent 70%)',
          opacity: 0.6,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--neutral-100) 0%, transparent 70%)',
          opacity: 0.8,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        className="animate-in"
        style={{
          width: '100%',
          maxWidth: '900px',
          position: 'relative',
          zIndex: 1,
          animationDuration: '0.6s',
        }}
      >
        <div
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-default)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          }}
        >
          {/* Left Side: Status */}
          <div
            style={{
              padding: 'var(--sp-12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              className="auth-brand"
              style={{ margin: 0, marginBottom: 'var(--sp-8)', justifyContent: 'flex-start' }}
            >
              <div
                className="auth-logo"
                style={{ width: '32px', height: '32px', fontSize: '14px' }}
              >
                S
              </div>
              <span className="auth-brand-name" style={{ fontSize: 'var(--fs-lg)' }}>
                Summon
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                padding: '6px 12px',
                background: 'var(--neutral-100)',
                borderRadius: 'var(--radius-full)',
                width: 'fit-content',
                marginBottom: 'var(--sp-6)',
              }}
            >
              <Clock size={16} color="var(--text-secondary)" />
              <span
                style={{
                  fontSize: 'var(--fs-xs)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Under Review
              </span>
            </div>

            <h1
              style={{
                fontSize: 'var(--fs-3xl)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-primary)',
                lineHeight: '1.1',
                marginBottom: 'var(--sp-4)',
                letterSpacing: '-0.03em',
              }}
            >
              Your request has been received.
            </h1>

            <p
              style={{
                fontSize: 'var(--fs-base)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--lh-relaxed)',
                marginBottom: 'var(--sp-8)',
              }}
            >
              Thank you for applying to join Summon as a seller. Our team is reviewing your profile
              to ensure the highest quality network. We typically respond within 24-48 hours.
            </p>

            <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
              <Link href="/">
                <button
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}
                >
                  Return home <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: What's Next */}
          <div
            style={{
              background: 'var(--neutral-50)',
              borderLeft: '1px solid var(--border-default)',
              padding: 'var(--sp-10)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--fs-lg)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--sp-8)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
              }}
            >
              What awaits you inside
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={benefit.title}
                    style={{
                      display: 'flex',
                      gap: 'var(--sp-4)',
                      transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.1}s`,
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--white)',
                        padding: 'var(--sp-2)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-default)',
                        height: 'fit-content',
                      }}
                    >
                      <Icon size={20} color="var(--blue-600)" />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: 'var(--fs-base)',
                          fontWeight: 'var(--fw-semibold)',
                          color: 'var(--text-primary)',
                          marginBottom: '2px',
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 'var(--fs-sm)',
                          color: 'var(--text-secondary)',
                          lineHeight: 'var(--lh-relaxed)',
                        }}
                      >
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                marginTop: 'var(--sp-8)',
                paddingTop: 'var(--sp-6)',
                borderTop: '1px solid var(--border-default)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <CheckCircle size={18} color="var(--color-success)" />
                <span
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 'var(--fw-medium)',
                  }}
                >
                  You will receive an email upon approval.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                @media (max-width: 768px) {
                    .animate-in > div {
                        grid-template-columns: 1fr !important;
                    }
                    .animate-in > div > div:first-child {
                        padding: var(--sp-8) !important;
                    }
                    .animate-in > div > div:last-child {
                        padding: var(--sp-8) !important;
                        border-left: none !important;
                        border-top: 1px solid var(--border-default) !important;
                    }
                }
            `,
        }}
      />
    </div>
  )
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PendingApprovalContent />
    </Suspense>
  )
}
