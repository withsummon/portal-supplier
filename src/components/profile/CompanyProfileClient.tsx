'use client'

import Image from 'next/image'
import { Building2, Camera, Globe, Mail, MapPin, Phone, Save, Users } from 'lucide-react'
import { useCompanyProfileForm } from '@/hooks/use-company-profile-form'
import type { CompanyProfileDto } from '@/lib/data/profiles'

export default function CompanyProfileClient({
  pageTitle,
  pageSubtitle,
  profile,
}: {
  pageTitle: string
  pageSubtitle: string
  profile: CompanyProfileDto
}) {
  const { form, isPending, logoPreview, message, setNextLogo, submit, tierLabel, updateField } =
    useCompanyProfileForm(profile)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={submit} disabled={isPending}>
          <Save size={15} />
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: 'var(--sp-5)',
            padding: 'var(--sp-3) var(--sp-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 'var(--fw-semibold)',
          }}
        >
          {message}
        </div>
      )}

      <div
        className="card"
        style={{
          padding: 'var(--sp-6)',
          marginBottom: 'var(--sp-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-5)',
        }}
      >
        <label
          style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-lg)',
            background: logoPreview ? 'transparent' : 'var(--neutral-100)',
            border: logoPreview ? 'none' : '2px dashed var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            flexShrink: 0,
            color: 'var(--text-muted)',
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(event) => setNextLogo(event.target.files?.[0] ?? null)}
          />
          {logoPreview ? (
            <Image
              src={logoPreview}
              alt={`${form.companyName} logo`}
              width={80}
              height={80}
              unoptimized
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Camera size={18} />
          )}
        </label>
        <div>
          <h2
            style={{ fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-bold)', marginBottom: '4px' }}
          >
            {form.companyName}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            {form.industry}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--sp-3)' }}>
            <span className="badge badge-accepted">{profile.status}</span>
            <span className="badge badge-submitted">{tierLabel} Tier</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--sp-8)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--sp-6)' }}>
          Company Information
        </div>

        <div className="grid-2" style={{ gap: 'var(--sp-6)' }}>
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Name</label>
            <div style={{ position: 'relative' }}>
              <Building2
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: '36px' }}
                value={form.companyName}
                onChange={(event) => updateField('companyName', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Company Description</label>
            <textarea
              className="input input-textarea"
              rows={4}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <div style={{ position: 'relative' }}>
              <Globe
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: '36px' }}
                value={form.website}
                onChange={(event) => updateField('website', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: '36px' }}
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                className="input"
                style={{ paddingLeft: '36px' }}
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <div style={{ position: 'relative' }}>
              <Phone
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: '36px' }}
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Industry</label>
            <input
              className="input"
              value={form.industry}
              onChange={(event) => updateField('industry', event.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Size</label>
            <div style={{ position: 'relative' }}>
              <Users
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: '36px' }}
                value={form.companySize}
                onChange={(event) => updateField('companySize', event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
