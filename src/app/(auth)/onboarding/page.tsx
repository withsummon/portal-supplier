'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle,
  UploadCloud,
  ChevronLeft,
  Briefcase,
  FileCheck,
  Layers,
} from 'lucide-react'

function OnboardingWizard() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [volume, setVolume] = useState('')

  const totalSteps = 3

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
    else handleSubmit()
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.push('/register')
  }

  const handleSubmit = () => {
    // Submit logic would go here
    router.push('/pending-approval?role=seller')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 'var(--sp-6)',
        position: 'relative',
      }}
    >
      {/* Background elements for premium feel */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--blue-100) 0%, transparent 60%)',
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-10%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--neutral-100) 0%, transparent 60%)',
          opacity: 0.8,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--sp-8)',
        }}
      >
        <div className="auth-brand" style={{ margin: 0, justifyContent: 'flex-start' }}>
          <div className="auth-logo" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
            S
          </div>
          <span className="auth-brand-name" style={{ fontSize: 'var(--fs-lg)' }}>
            Summon
          </span>
        </div>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            background: 'transparent',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            fontSize: 'var(--fs-sm)',
            fontWeight: 'var(--fw-medium)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      {/* Wizard Container */}
      <div
        className="animate-in"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: '600px',
          padding: 'var(--sp-8)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-8)' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                height: '4px',
                flex: 1,
                background: s <= step ? 'var(--blue-600)' : 'var(--neutral-100)',
                borderRadius: '2px',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* Step Content */}
        <div style={{ minHeight: '380px' }}>
          {step === 1 && (
            <div className="animate-in" style={{ animationDuration: '0.4s' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                <div
                  style={{
                    background: 'var(--blue-50)',
                    color: 'var(--blue-600)',
                    padding: 'var(--sp-2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Briefcase size={24} />
                </div>
                <h2
                  style={{
                    fontSize: 'var(--fs-2xl)',
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Tell us about your business
                </h2>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--sp-8)',
                  fontSize: 'var(--fs-base)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                Before we set up your Makelar workspace, we need a few more details to customize
                your experience.
              </p>

              <div className="auth-fields">
                <div className="form-group">
                  <label className="form-label">What is your primary goal?</label>
                  <select className="select">
                    <option value="">Select a goal</option>
                    <option>Find execution partners for our projects</option>
                    <option>Explore the platform capabilities</option>
                    <option>Get reviewed by the Summon team</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">How did you hear about Summon?</label>
                  <select className="select">
                    <option value="">Select a source</option>
                    <option>Search Engine</option>
                    <option>Social Media</option>
                    <option>Referral</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected annual project volume</label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 'var(--sp-2)',
                    }}
                  >
                    {[
                      '< Rp 250.000.000',
                      'Rp 250.000.000 - Rp 1.000.000.000',
                      '> Rp 1.000.000.000',
                    ].map((vol) => {
                      const isSelected = volume === vol
                      return (
                        <div
                          key={vol}
                          onClick={() => setVolume(vol)}
                          style={{
                            padding: 'var(--sp-3) var(--sp-2)',
                            textAlign: 'center',
                            fontSize: 'var(--fs-sm)',
                            border: isSelected
                              ? '1px solid var(--blue-500)'
                              : '1px solid var(--border-default)',
                            background: isSelected ? 'var(--blue-50)' : 'transparent',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                            color: isSelected ? 'var(--blue-700)' : 'var(--text-primary)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {vol}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in" style={{ animationDuration: '0.4s' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                <div
                  style={{
                    background: 'var(--blue-50)',
                    color: 'var(--blue-600)',
                    padding: 'var(--sp-2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <FileCheck size={24} />
                </div>
                <h2
                  style={{
                    fontSize: 'var(--fs-2xl)',
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Verify your identity
                </h2>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--sp-6)',
                  fontSize: 'var(--fs-base)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                To maintain a trusted network, all Summon users must verify their company details.
              </p>

              <div
                onClick={() => document.getElementById('document-upload')?.click()}
                style={{
                  border: '2px dashed var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--sp-8)',
                  textAlign: 'center',
                  background: 'var(--neutral-50)',
                  marginBottom: 'var(--sp-6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--blue-400)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              >
                <input
                  type="file"
                  id="document-upload"
                  accept=".pdf,.jpg,.png"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      alert(`File selected: ${file.name}`)
                    }
                  }}
                />
                <UploadCloud
                  size={32}
                  color="var(--text-muted)"
                  style={{ margin: '0 auto var(--sp-3)' }}
                />
                <div
                  style={{
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--sp-1)',
                  }}
                >
                  Upload Company Document
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                  Drag & drop your SIUP, NIB, or NPWP here.
                  <br />
                  PDF, JPG, or PNG (max. 5MB)
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tax ID Number (NPWP)</label>
                <input className="input" type="text" placeholder="00.000.000.0-000.000" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in" style={{ animationDuration: '0.4s' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                <div
                  style={{
                    background: 'var(--blue-50)',
                    color: 'var(--blue-600)',
                    padding: 'var(--sp-2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Layers size={24} />
                </div>
                <h2
                  style={{
                    fontSize: 'var(--fs-2xl)',
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Platform Preferences
                </h2>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--sp-6)',
                  fontSize: 'var(--fs-base)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                Final step. Select the types of projects you are interested in.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                {[
                  'Web Development',
                  'Mobile App',
                  'Cloud Infrastructure',
                  'UI/UX Design',
                  'Digital Marketing',
                  'Data Analytics',
                ].map((pref) => (
                  <label
                    key={pref}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-3)',
                      padding: 'var(--sp-4)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: 'var(--white)',
                    }}
                  >
                    <input type="checkbox" style={{ accentColor: 'var(--blue-600)' }} />
                    <span
                      style={{
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 'var(--fw-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {pref}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 'var(--sp-8)',
            paddingTop: 'var(--sp-6)',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <button
            onClick={handleNext}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              padding: '12px 24px',
            }}
          >
            {step === totalSteps ? 'Complete Request' : 'Continue'}
            {step === totalSteps ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
          </button>
        </div>
      </div>

      {/* Steps indicator */}
      <div
        style={{
          marginTop: 'var(--sp-6)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--text-secondary)',
          fontWeight: 'var(--fw-medium)',
        }}
      >
        Step {step} of {totalSteps}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingWizard />
    </Suspense>
  )
}
