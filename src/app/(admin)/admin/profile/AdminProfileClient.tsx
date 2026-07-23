'use client'

import Image from 'next/image'
import { Bell, Camera, Mail, Phone, Save, Shield } from 'lucide-react'
import { useAdminProfileForm } from '@/hooks/use-admin-profile-form'
import type { AdminProfileDto } from '@/lib/data/profiles'

export default function AdminProfileClient({ profile }: { profile: AdminProfileDto }) {
  const {
    form,
    imagePreview,
    isPending,
    message,
    preferences,
    setNextImage,
    submit,
    updateField,
    updatePreference,
  } = useAdminProfileForm(profile)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Profile</h1>
          <p className="page-subtitle">Manage your profile settings and preferences.</p>
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

      <div className="form-aside-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div className="card">
            <div
              style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--border-default)' }}
            >
              <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
                Personal Information
              </h2>
            </div>
            <div
              style={{
                padding: 'var(--sp-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                <label
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--blue-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(event) => setNextImage(event.target.files?.[0] ?? null)}
                  />
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt={form.name}
                      width={72}
                      height={72}
                      unoptimized
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Camera size={18} style={{ color: 'var(--blue-700)' }} />
                  )}
                </label>

                <div>
                  <div style={{ fontWeight: 'var(--fw-semibold)', marginBottom: '4px' }}>
                    {form.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                    {form.role}
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    className="input"
                    value={form.location}
                    onChange={(event) => updateField('location', event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    className="input"
                    value={form.department}
                    onChange={(event) => updateField('department', event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input
                    className="input"
                    value={form.role}
                    disabled
                    style={{ background: 'var(--neutral-100)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div
              style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--border-default)' }}
            >
              <h2
                style={{
                  fontSize: 'var(--fs-lg)',
                  fontWeight: 'var(--fw-bold)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                }}
              >
                <Bell size={18} />
                Notification Preferences
              </h2>
            </div>
            <div
              style={{
                padding: 'var(--sp-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-4)',
              }}
            >
              {[
                ['emailNotifications', 'Email Notifications', 'Receive notifications via email'],
                [
                  'projectUpdates',
                  'Project Updates',
                  'Get notified when projects are submitted or updated',
                ],
                ['weeklyReports', 'Weekly Reports', 'Receive weekly platform performance reports'],
              ].map(([key, label, description]) => (
                <div
                  key={key}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                      {description}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof typeof preferences]}
                    onChange={(event) =>
                      updatePreference(key as keyof typeof preferences, event.target.checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--blue-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--sp-3)',
                overflow: 'hidden',
              }}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={form.name}
                  width={80}
                  height={80}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Shield size={26} style={{ color: 'var(--blue-700)' }} />
              )}
            </div>
            <h3 style={{ fontWeight: 'var(--fw-bold)', marginBottom: '4px' }}>{form.name}</h3>
            <p
              style={{
                fontSize: 'var(--fs-sm)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--sp-3)',
              }}
            >
              {form.role}
            </p>
          </div>

          <div
            style={{
              marginTop: 'var(--sp-5)',
              borderTop: '1px solid var(--border-default)',
              paddingTop: 'var(--sp-4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                marginBottom: 'var(--sp-3)',
                fontSize: 'var(--fs-sm)',
                color: 'var(--text-secondary)',
              }}
            >
              <Mail size={14} />
              {form.email}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                fontSize: 'var(--fs-sm)',
                color: 'var(--text-secondary)',
              }}
            >
              <Phone size={14} />
              {form.phone || 'No phone number'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
