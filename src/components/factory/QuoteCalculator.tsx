'use client'

import { useState } from 'react'
import { Calculator, Zap, Users, Database } from 'lucide-react'

const PRESETS = [
  {
    id: 'llm',
    label: 'LLM Deployment',
    icon: Zap,
    unit: 'tokens/month',
    min: 1,
    max: 100,
    step: 1,
    suffix: 'M',
    basePrice: 800,
    color: 'var(--blue-500)',
  },
  {
    id: 'users',
    label: 'Active Users',
    icon: Users,
    unit: 'concurrent users',
    min: 100,
    max: 10000,
    step: 100,
    suffix: '',
    basePrice: 2,
    color: 'var(--color-success)',
  },
  {
    id: 'data',
    label: 'Data Volume',
    icon: Database,
    unit: 'GB/day',
    min: 10,
    max: 1000,
    step: 10,
    suffix: '',
    basePrice: 15,
    color: 'var(--color-purple)',
  },
]

export default function QuoteCalculator() {
  const [values, setValues] = useState<Record<string, number>>({
    llm: 10,
    users: 1000,
    data: 100,
  })

  const totalEstimate = PRESETS.reduce((sum, preset) => {
    return sum + (values[preset.id] ?? 0) * preset.basePrice
  }, 0)

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val}`
  }

  return (
    <div className="card" style={{ marginTop: 'var(--sp-8)' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calculator size={15} />
          </div>
          <div className="card-title">Quick Quote Calculator</div>
        </div>
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-muted)',
            background: 'var(--neutral-100)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
        >
          Estimate
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 'var(--sp-8)' }}>
          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            {PRESETS.map((preset) => {
              const Icon = preset.icon
              const val = values[preset.id] ?? preset.min
              const percent = ((val - preset.min) / (preset.max - preset.min)) * 100
              return (
                <div key={preset.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--sp-2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Icon size={14} style={{ color: preset.color }} />
                      {preset.label}
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 700,
                        color: preset.color,
                        background: `color-mix(in srgb, ${preset.color} 10%, transparent)`,
                        padding: '1px 10px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {val.toLocaleString()}
                      {preset.suffix} {preset.unit}
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="range"
                      min={preset.min}
                      max={preset.max}
                      step={preset.step}
                      value={val}
                      onChange={(e) =>
                        setValues((p) => ({ ...p, [preset.id]: Number(e.target.value) }))
                      }
                      className="quote-slider"
                      style={
                        {
                          '--slider-percent': `${percent}%`,
                          '--slider-color': preset.color,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}
                  >
                    <span>
                      {preset.min.toLocaleString()}
                      {preset.suffix}
                    </span>
                    <span>
                      {preset.max.toLocaleString()}
                      {preset.suffix}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Estimate Panel */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--blue-900), #1a1a2e)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-6)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.1em',
                opacity: 0.6,
                marginBottom: 'var(--sp-3)',
              }}
            >
              Estimated Monthly Cost
            </div>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--sp-4)',
              }}
            >
              {formatCurrency(totalEstimate)}
            </div>
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                opacity: 0.5,
                marginBottom: 'var(--sp-5)',
              }}
            >
              per month · billed annually
            </div>
            <button
              className="btn"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                width: '100%',
                fontWeight: 600,
              }}
            >
              Request Formal Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
