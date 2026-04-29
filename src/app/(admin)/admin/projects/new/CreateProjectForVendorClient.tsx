'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { VendorDirectoryDto } from '@/lib/data/admin'
import { createProjectAsAdmin } from '@/lib/actions/projects'

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as const

const CATEGORIES = [
  'Cloud Infrastructure',
  'Conversational AI',
  'Computer Vision',
  'Analytics',
  'Security',
  'Web Development',
  'Mobile App',
  'Data & AI',
  'Design',
  'Marketing',
  'Consulting',
  'Other',
]

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $50,000',
  '$50,000 - $150,000',
  '$150,000 - $500,000',
  '$500,000+',
]

export default function CreateProjectForVendorClient({
  vendors,
}: {
  vendors: VendorDirectoryDto[]
}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [form, setForm] = useState({
    name: '',
    clientName: '',
    category: '',
    description: '',
    requirements: '',
    vendorId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    budgetRange: '',
    budgetCurrency: 'USD',
    startDate: '',
    endDate: '',
  })
  const [error, setError] = useState('')

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.vendorId || !form.category) {
      setError('Project name, vendor, and category are required.')
      return
    }

    setIsPending(true)
    try {
      const result = await createProjectAsAdmin({
        name: form.name,
        clientName: form.clientName,
        category: form.category,
        description: form.description,
        requirements: form.requirements,
        vendorId: form.vendorId,
        priority: form.priority,
        budgetRange: form.budgetRange,
        budgetCurrency: form.budgetCurrency,
        startDate: form.startDate,
        endDate: form.endDate,
      })

      if ('error' in result) {
        setError(result.error)
      } else {
        router.push('/admin/projects')
      }
    } finally {
      setIsPending(false)
    }
  }

  const activeVendors = vendors.filter((v) => v.status === 'active')

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Project for Vendor</h1>
          <p className="page-subtitle">
            Create a project on behalf of a vendor. This project will be marked as accepted.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ maxWidth: '720px' }}>
          <div className="card-header">
            <div className="card-title">Project Details</div>
          </div>
          <div className="card-body">
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vendor">
                  Assign to Vendor <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <select
                  id="vendor"
                  className="select"
                  value={form.vendorId}
                  onChange={(e) => setField('vendorId', e.target.value)}
                  required
                >
                  <option value="">Select a vendor...</option>
                  {activeVendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} — {vendor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Project Name <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="name"
                  className="input"
                  placeholder="e.g. Enterprise AI Integration"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="clientName">Client Name</label>
                <input
                  id="clientName"
                  className="input"
                  placeholder="e.g. PT XYZ Corp"
                  value={form.clientName}
                  onChange={(e) => setField('clientName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <select
                  id="category"
                  className="select"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  required
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="input input-textarea"
                  rows={4}
                  placeholder="Describe the project scope and objectives..."
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="requirements">Requirements</label>
                <textarea
                  id="requirements"
                  className="input input-textarea"
                  rows={3}
                  placeholder="Key requirements and deliverables..."
                  value={form.requirements}
                  onChange={(e) => setField('requirements', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    className="select"
                    value={form.priority}
                    onChange={(e) => setField('priority', e.target.value)}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="budgetCurrency">Currency</label>
                  <select
                    id="budgetCurrency"
                    className="select"
                    value={form.budgetCurrency}
                    onChange={(e) => setField('budgetCurrency', e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="IDR">IDR</option>
                    <option value="EUR">EUR</option>
                    <option value="SGD">SGD</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budgetRange">Budget Range</label>
                <select
                  id="budgetRange"
                  className="select"
                  value={form.budgetRange}
                  onChange={(e) => setField('budgetRange', e.target.value)}
                >
                  <option value="">Select budget range...</option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    className="input"
                    value={form.startDate}
                    onChange={(e) => setField('startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="endDate">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    className="input"
                    value={form.endDate}
                    onChange={(e) => setField('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 'var(--sp-5)',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              gap: 'var(--sp-3)',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push('/admin/projects')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
