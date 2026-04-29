'use client'

import { useState } from 'react'
import type { OfferTemplateDto } from '@/lib/data/offer-templates'
import {
  createOfferTemplate,
  updateOfferTemplate,
  deleteOfferTemplate,
} from '@/lib/actions/offer-templates'

export default function OfferTemplatesPageClient({
  initialTemplates,
  categories,
}: {
  initialTemplates: OfferTemplateDto[]
  categories: string[]
}) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    defaultPricingType: 'RANGE' as 'FIXED' | 'RANGE' | 'CUSTOM',
    defaultMinAmount: '',
    defaultMaxAmount: '',
    defaultCurrency: 'USD',
    defaultDuration: '30',
    defaultTerms: '',
    isActive: true,
  })

  function resetForm() {
    setForm({
      name: '',
      categoryId: '',
      description: '',
      defaultPricingType: 'RANGE',
      defaultMinAmount: '',
      defaultMaxAmount: '',
      defaultCurrency: 'USD',
      defaultDuration: '30',
      defaultTerms: '',
      isActive: true,
    })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  function openEdit(template: OfferTemplateDto) {
    setForm({
      name: template.name,
      categoryId: template.categoryId ?? '',
      description: template.description ?? '',
      defaultPricingType: template.defaultPricingType,
      defaultMinAmount: template.defaultMinAmount?.toString() ?? '',
      defaultMaxAmount: template.defaultMaxAmount?.toString() ?? '',
      defaultCurrency: template.defaultCurrency,
      defaultDuration: template.defaultDuration.toString(),
      defaultTerms: template.defaultTerms ?? '',
      isActive: template.isActive,
    })
    setEditingId(template.id)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Template name is required.')
      return
    }

    setIsPending(true)
    try {
      let result:
        | { success: true; data: unknown }
        | { success?: never; error: string }

      if (editingId) {
        const updateData: Parameters<typeof updateOfferTemplate>[1] = {
          name: form.name,
          categoryId: form.categoryId || null,
          defaultPricingType: form.defaultPricingType,
          defaultCurrency: form.defaultCurrency,
          isActive: form.isActive,
        }
        if (form.description) updateData.description = form.description
        if (form.defaultMinAmount) updateData.defaultMinAmount = Number(form.defaultMinAmount)
        if (form.defaultMaxAmount) updateData.defaultMaxAmount = Number(form.defaultMaxAmount)
        if (form.defaultDuration) updateData.defaultDuration = Number(form.defaultDuration)
        if (form.defaultTerms) updateData.defaultTerms = form.defaultTerms
        const r = await updateOfferTemplate(editingId, updateData)
        result = r as typeof result
      } else {
        const createData: Parameters<typeof createOfferTemplate>[0] = {
          name: form.name,
          categoryId: form.categoryId || null,
          defaultPricingType: form.defaultPricingType,
          defaultCurrency: form.defaultCurrency,
          isActive: form.isActive,
        }
        if (form.description) createData.description = form.description
        if (form.defaultMinAmount) createData.defaultMinAmount = Number(form.defaultMinAmount)
        if (form.defaultMaxAmount) createData.defaultMaxAmount = Number(form.defaultMaxAmount)
        if (form.defaultDuration) createData.defaultDuration = Number(form.defaultDuration)
        if (form.defaultTerms) createData.defaultTerms = form.defaultTerms
        const r = await createOfferTemplate(createData)
        result = r as typeof result
      }

      if ('error' in result) {
        setError(result.error)
      } else {
        // Refresh page to get updated data
        window.location.reload()
      }
    } finally {
      setIsPending(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this offer template?')) return
    await deleteOfferTemplate(id)
    setTemplates((current) => current.filter((t) => t.id !== id))
  }

  function formatPricing(t: OfferTemplateDto) {
    if (t.defaultPricingType === 'FIXED') {
      return `${t.defaultCurrency} ${t.defaultMinAmount?.toLocaleString()}`
    }
    if (t.defaultPricingType === 'RANGE') {
      return `${t.defaultCurrency} ${t.defaultMinAmount?.toLocaleString()} – ${t.defaultMaxAmount?.toLocaleString()}`
    }
    return 'Custom pricing'
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Offer Templates</h1>
          <p className="page-subtitle">
            Configure default offer/quote templates per product category for Summon Factory.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + New Template
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth: '640px', marginBottom: 'var(--sp-6)' }}>
          <div className="card-header">
            <div className="card-title">
              {editingId ? 'Edit Template' : 'New Offer Template'}
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    padding: 'var(--sp-3)',
                    marginBottom: 'var(--sp-4)',
                    background: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--fs-sm)',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ot-name">
                    Template Name <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="ot-name"
                    className="input"
                    placeholder="e.g. Enterprise AI Deal"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ot-description">Description</label>
                  <textarea
                    id="ot-description"
                    className="input input-textarea"
                    rows={2}
                    placeholder="Brief description of this offer template..."
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="ot-pricing-type">
                      Pricing Type
                    </label>
                    <select
                      id="ot-pricing-type"
                      className="select"
                      value={form.defaultPricingType}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          defaultPricingType: e.target.value as 'FIXED' | 'RANGE' | 'CUSTOM',
                        }))
                      }
                    >
                      <option value="RANGE">Range (Min – Max)</option>
                      <option value="FIXED">Fixed Price</option>
                      <option value="CUSTOM">Custom</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ot-currency">Currency</label>
                    <select
                      id="ot-currency"
                      className="select"
                      value={form.defaultCurrency}
                      onChange={(e) => setForm((f) => ({ ...f, defaultCurrency: e.target.value }))}
                    >
                      <option value="USD">USD</option>
                      <option value="IDR">IDR</option>
                      <option value="EUR">EUR</option>
                      <option value="SGD">SGD</option>
                    </select>
                  </div>
                </div>

                {form.defaultPricingType !== 'CUSTOM' && (
                  <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}
                  >
                    <div className="form-group">
                      <label className="form-label" htmlFor="ot-min">
                        {form.defaultPricingType === 'FIXED' ? 'Price' : 'Min Amount'}
                      </label>
                      <input
                        id="ot-min"
                        type="number"
                        className="input"
                        placeholder="0"
                        value={form.defaultMinAmount}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, defaultMinAmount: e.target.value }))
                        }
                      />
                    </div>
                    {form.defaultPricingType === 'RANGE' && (
                      <div className="form-group">
                        <label className="form-label" htmlFor="ot-max">
                          Max Amount
                        </label>
                        <input
                          id="ot-max"
                          type="number"
                          className="input"
                          placeholder="0"
                          value={form.defaultMaxAmount}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, defaultMaxAmount: e.target.value }))
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="ot-duration">
                      Default Duration (days)
                    </label>
                    <input
                      id="ot-duration"
                      type="number"
                      className="input"
                      placeholder="30"
                      value={form.defaultDuration}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, defaultDuration: e.target.value }))
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ot-active">Status</label>
                    <select
                      id="ot-active"
                      className="select"
                      value={form.isActive ? 'true' : 'false'}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isActive: e.target.value === 'true' }))
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ot-terms">Default Terms</label>
                  <textarea
                    id="ot-terms"
                    className="input input-textarea"
                    rows={3}
                    placeholder="Standard terms and conditions for this offer..."
                    value={form.defaultTerms}
                    onChange={(e) => setForm((f) => ({ ...f, defaultTerms: e.target.value }))}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--sp-3)',
                  justifyContent: 'flex-end',
                  marginTop: 'var(--sp-5)',
                  paddingTop: 'var(--sp-4)',
                  borderTop: '1px solid var(--border-default)',
                }}
              >
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? 'Saving...' : editingId ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Duration</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
                      No offer templates yet. Create one to get started.
                    </div>
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id}>
                    <td>
                      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{template.name}</div>
                      {template.description && (
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {template.description}
                        </div>
                      )}
                    </td>
                    <td>{template.categoryName ?? 'All Categories'}</td>
                    <td>{formatPricing(template)}</td>
                    <td>{template.defaultDuration} days</td>
                    <td>
                      <span
                        className={`badge ${template.isActive ? 'badge-accepted' : 'badge-rejected'}`}
                      >
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(template)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => handleDelete(template.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
