'use client'

import { X, Download, Share2, CheckCircle2, Building2 } from 'lucide-react'

interface PitchProduct {
  name: string
  category: string
  longDescription: string
  features: string[]
  useCases: string[]
  clients: string[]
  iconBg: string
  iconColor: string
}

export default function PitchPreview({
  product,
  onClose,
}: {
  product: PitchProduct
  onClose: () => void
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
      >
        {/* Gradient Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--blue-700), var(--blue-900))',
            padding: 'var(--sp-8) var(--sp-8) var(--sp-10)',
            color: 'white',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 'var(--sp-4)',
              right: 'var(--sp-4)',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-full)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.7,
              marginBottom: 'var(--sp-2)',
            }}
          >
            Client Pitch Deck Preview
          </div>
          <h2 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, marginBottom: 'var(--sp-2)' }}>
            {product.name}
          </h2>
          <p style={{ fontSize: 'var(--fs-sm)', opacity: 0.8 }}>
            {product.category} — Powered by Summon
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--sp-3)',
              marginTop: 'var(--sp-5)',
            }}
          >
            <button
              className="btn"
              style={{
                background: 'white',
                color: 'var(--blue-700)',
                fontWeight: 600,
                gap: '6px',
                border: 'none',
              }}
            >
              <Download size={14} /> Download PDF
            </button>
            <button
              className="btn"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 600,
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Share2 size={14} /> Share Link
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--sp-8)' }}>
          {/* Executive Summary */}
          <div style={{ marginBottom: 'var(--sp-8)' }}>
            <h3
              style={{
                fontSize: 'var(--fs-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                fontWeight: 700,
                marginBottom: 'var(--sp-3)',
              }}
            >
              Executive Summary
            </h3>
            <p
              style={{
                fontSize: 'var(--fs-md)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--lh-relaxed)',
              }}
            >
              {product.longDescription}
            </p>
          </div>

          {/* Key Capabilities */}
          <div style={{ marginBottom: 'var(--sp-8)' }}>
            <h3
              style={{
                fontSize: 'var(--fs-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                fontWeight: 700,
                marginBottom: 'var(--sp-4)',
              }}
            >
              Key Capabilities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
              {product.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    fontSize: 'var(--fs-sm)',
                    padding: 'var(--sp-2) 0',
                  }}
                >
                  <CheckCircle2
                    size={14}
                    style={{ color: 'var(--color-success)', flexShrink: 0 }}
                  />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div style={{ marginBottom: 'var(--sp-8)' }}>
            <h3
              style={{
                fontSize: 'var(--fs-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                fontWeight: 700,
                marginBottom: 'var(--sp-4)',
              }}
            >
              Ideal Use Cases
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
              {product.useCases.map((uc, i) => (
                <span
                  key={i}
                  style={{
                    padding: 'var(--sp-2) var(--sp-4)',
                    background: 'var(--blue-50)',
                    color: 'var(--blue-700)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 600,
                    border: '1px solid var(--blue-200)',
                  }}
                >
                  {uc}
                </span>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div
            style={{
              padding: 'var(--sp-6)',
              background: 'var(--neutral-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--fs-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                fontWeight: 700,
                marginBottom: 'var(--sp-4)',
              }}
            >
              Trusted By Industry Leaders
            </h3>
            <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
              {product.clients.map((client) => (
                <div
                  key={client}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    padding: 'var(--sp-2) var(--sp-4)',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 500,
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Building2 size={14} />
                  <span>{client}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Branding */}
          <div
            style={{
              marginTop: 'var(--sp-8)',
              textAlign: 'center',
              paddingTop: 'var(--sp-5)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-muted)',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--blue-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                S
              </div>
              Powered by Summon · Generated for PT Arya Teknologi
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
