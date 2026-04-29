'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { VendorDirectoryDto } from '@/lib/data/admin'
import { createProjectAsAdmin } from '@/lib/actions/projects'

const PRIORITIES = [
  { value: 'low', label: 'Low', desc: 'Non-urgent, flexible timeline' },
  { value: 'medium', label: 'Medium', desc: 'Normal business requirement' },
  { value: 'high', label: 'High', desc: 'Important, affects operations' },
  { value: 'critical', label: 'Critical', desc: 'Urgent, immediate attention needed' },
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
  { label: 'Rp 5.000.000 - Rp 15.000.000', value: 'Rp 5.000.000 - Rp 15.000.000' },
  { label: 'Rp 15.000.000 - Rp 50.000.000', value: 'Rp 15.000.000 - Rp 50.000.000' },
  { label: 'Rp 50.000.000 - Rp 150.000.000', value: 'Rp 50.000.000 - Rp 150.000.000' },
  { label: 'Rp 150.000.000 - Rp 500.000.000', value: 'Rp 150.000.000 - Rp 500.000.000' },
  { label: 'Rp 500.000.000 - Rp 1.000.000.000', value: 'Rp 500.000.000 - Rp 1.000.000.000' },
  { label: 'Rp 1.000.000.000+', value: 'Rp 1.000.000.000+' },
]

type AdminProjectFormChange = <K extends keyof AdminProjectFormState>(key: K, value: AdminProjectFormState[K]) => void

const STEPS = [
  { label: 'Project Basics', desc: 'Name, category, and vendor' },
  { label: 'Requirements', desc: 'Scope and deliverables' },
  { label: 'Timeline & Budget', desc: 'Dates and budget' },
  { label: 'Review', desc: 'Confirm and create' },
] as const

interface AdminProjectFormState {
  name: string
  clientName: string
  category: string
  description: string
  requirements: string
  deliverables: string[]
  priority: 'low' | 'medium' | 'high' | 'critical' | ''
  budgetRange: string
  startDate: string
  endDate: string
  vendorId: string
  mode: 'assign' | 'bidding'
}

function Step1({
  data,
  vendors,
  onChange,
}: {
  data: AdminProjectFormState
  vendors: VendorDirectoryDto[]
  onChange: AdminProjectFormChange
}) {
  const activeVendors = vendors.filter((v) => v.status === 'active')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      {/* Mode selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        <button
          type="button"
          onClick={() => onChange('mode', 'bidding')}
          style={{
            padding: 'var(--sp-4)',
            borderRadius: 'var(--radius-lg)',
            border: `2px solid ${data.mode === 'bidding' ? 'var(--blue-500)' : 'var(--border-default)'}`,
            background: data.mode === 'bidding' ? 'var(--blue-50)' : 'white',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 'var(--fw-bold)', marginBottom: '2px', fontSize: 'var(--fs-sm)' }}>
            Open for Bidding
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
            Visible to all vendors
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange('mode', 'assign')}
          style={{
            padding: 'var(--sp-4)',
            borderRadius: 'var(--radius-lg)',
            border: `2px solid ${data.mode === 'assign' ? 'var(--blue-500)' : 'var(--border-default)'}`,
            background: data.mode === 'assign' ? 'var(--blue-50)' : 'white',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 'var(--fw-bold)', marginBottom: '2px', fontSize: 'var(--fs-sm)' }}>
            Assign to Vendor
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
            Direct assignment
          </div>
        </button>
      </div>

      {data.mode === 'assign' && (
        <div className="form-group">
          <label className="form-label">
            Assign to Vendor <span className="form-required">*</span>
          </label>
          <select
            className="select"
            value={data.vendorId}
            onChange={(e) => onChange('vendorId', e.target.value)}
          >
            <option value="">Select a vendor...</option>
            {activeVendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name} — {vendor.specialty}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          Project Name <span className="form-required">*</span>
        </label>
        <input
          className="input"
          placeholder="e.g. Enterprise AI Integration"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Client Name</label>
        <input
          className="input"
          placeholder="e.g. PT Maju Bersama"
          value={data.clientName}
          onChange={(e) => onChange('clientName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Project Category <span className="form-required">*</span>
        </label>
        <select
          className="select"
          value={data.category}
          onChange={(e) => onChange('category', e.target.value)}
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
        <label className="form-label">Brief Description</label>
        <textarea
          className="input input-textarea"
          rows={3}
          placeholder="Describe the project scope and objectives..."
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>
    </div>
  )
}

function Step2({
  data,
  onChange,
}: {
  data: AdminProjectFormState
  onChange: AdminProjectFormChange
}) {
  const [newDeliverable, setNewDeliverable] = useState('')

  function addDeliverable() {
    const d = newDeliverable.trim()
    if (!d) return
    onChange('deliverables', [...data.deliverables, d])
    setNewDeliverable('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div className="form-group">
        <label className="form-label">Detailed Requirements</label>
        <textarea
          className="input input-textarea"
          rows={5}
          placeholder="Describe the technical and functional requirements in detail..."
          value={data.requirements}
          onChange={(e) => onChange('requirements', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Key Deliverables</label>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
          <input
            className="input"
            placeholder="Add a deliverable..."
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addDeliverable() }
            }}
          />
          <button type="button" className="btn btn-secondary" onClick={addDeliverable}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {data.deliverables.map((d, i) => (
            <div
              key={`${d}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                padding: 'var(--sp-2) var(--sp-3)',
                background: 'var(--neutral-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
              }}
            >
              <Check size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 'var(--fs-sm)' }}>{d}</span>
              <button
                type="button"
                onClick={() => onChange('deliverables', data.deliverables.filter((_, idx) => idx !== i))}
                style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', padding: '4px' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step3({
  data,
  onChange,
}: {
  data: AdminProjectFormState
  onChange: AdminProjectFormChange
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            className="input"
            type="date"
            value={data.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            className="input"
            type="date"
            value={data.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Budget Range</label>
        <select
          className="select"
          value={data.budgetRange}
          onChange={(e) => onChange('budgetRange', e.target.value)}
        >
          <option value="">Select budget range...</option>
          {BUDGET_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Priority Level</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          {PRIORITIES.map((p) => (
            <label
              key={p.value}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--sp-3)',
                padding: 'var(--sp-4)',
                border: `2px solid ${data.priority === p.value ? 'var(--blue-500)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                background: data.priority === p.value ? 'var(--blue-50)' : 'white',
              }}
            >
              <input
                type="radio"
                name="priority"
                value={p.value}
                checked={data.priority === p.value}
                onChange={() => onChange('priority', p.value)}
                style={{ accentColor: 'var(--blue-600)', marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{p.label}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step4({ data }: { data: AdminProjectFormState }) {
  const sections = [
    {
      title: 'Project Basics',
      items: [
        { label: 'Project Name', value: data.name || '-' },
        { label: 'Client Name', value: data.clientName || '-' },
        { label: 'Category', value: data.category || '-' },
        { label: 'Mode', value: data.mode === 'assign' ? 'Assign to Vendor' : 'Open for Bidding' },
        ...(data.mode === 'assign' && data.vendorId ? [{ label: 'Assigned Vendor', value: data.vendorId }] : []),
      ],
    },
    {
      title: 'Requirements',
      items: [
        { label: 'Description', value: data.description || '-' },
        { label: 'Requirements', value: data.requirements || '-' },
        { label: 'Deliverables', value: data.deliverables.length > 0 ? `${data.deliverables.length} items` : '-' },
      ],
    },
    {
      title: 'Timeline and Budget',
      items: [
        { label: 'Start Date', value: data.startDate || '-' },
        { label: 'End Date', value: data.endDate || '-' },
        { label: 'Budget Range', value: data.budgetRange || '-' },
        { label: 'Priority', value: data.priority || '-' },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div
        style={{
          padding: 'var(--sp-4) var(--sp-5)',
          background: 'var(--blue-50)',
          border: '1px solid var(--blue-200)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
        }}
      >
        <CheckCircle size={18} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--blue-800)' }}>
          Review the project details before creating.
        </span>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="card">
          <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
            <div className="card-title" style={{ fontSize: 'var(--fs-sm)' }}>{section.title}</div>
          </div>
          <div style={{ padding: '0 var(--sp-5)' }}>
            {section.items.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', padding: 'var(--sp-3) 0', borderBottom: '1px solid var(--border-default)' }}>
                <div style={{ width: '140px', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CreateProjectForVendorClient({
  vendors,
}: {
  vendors: VendorDirectoryDto[]
}) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<AdminProjectFormState>({
    name: '',
    clientName: '',
    category: '',
    description: '',
    requirements: '',
    deliverables: [],
    priority: '',
    budgetRange: '',
    startDate: '',
    endDate: '',
    vendorId: '',
    mode: 'bidding',
  })

  function updateField<K extends keyof AdminProjectFormState>(key: K, value: AdminProjectFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function nextStep() {
    if (step === 0) {
      if (!form.name || !form.category) {
        setError('Project name and category are required.')
        return
      }
      if (form.mode === 'assign' && !form.vendorId) {
        setError('Please select a vendor to assign.')
        return
      }
    }
    setError('')
    setStep((s) => Math.min(s + 1, 3))
  }

  function previousStep() {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit() {
    setError('')
    setIsPending(true)
    try {
      const result = await createProjectAsAdmin({
        name: form.name,
        clientName: form.clientName,
        category: form.category,
        description: form.description,
        requirements: form.requirements,
        deliverables: form.deliverables,
        ...(form.mode === 'assign' && form.vendorId ? { vendorId: form.vendorId } : {}),
        priority: form.priority || 'medium',
        budgetRange: form.budgetRange,
        budgetCurrency: 'IDR',
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

  const currentStepLabel = (() => {
    switch (step) {
      case 0: return STEPS[0].label
      case 1: return STEPS[1].label
      case 2: return STEPS[2].label
      case 3: return STEPS[3].label
      default: return STEPS[0].label
    }
  })()
  const currentStepDesc = (() => {
    switch (step) {
      case 0: return STEPS[0].desc
      case 1: return STEPS[1].desc
      case 2: return STEPS[2].desc
      case 3: return STEPS[3].desc
      default: return STEPS[0].desc
    }
  })()

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <Link href="/admin/projects">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--sp-4)', paddingLeft: '4px' }}>
            <ArrowLeft size={14} />
            Back
          </button>
        </Link>
        <h1 className="page-title">Create Project</h1>
        <p className="page-subtitle">
          Create a new project for vendors.
        </p>
      </div>

      {/* Stepper */}
      <div className="stepper" style={{ marginBottom: 'var(--sp-8)' }}>
        {STEPS.map((stepItem, index) => (
          <div
            key={stepItem.label}
            className="stepper-item"
            style={{ flex: index < STEPS.length - 1 ? 1 : 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div className={`stepper-circle${step === index ? ' active' : index < step ? ' completed' : ''}`}>
                {index < step ? <Check size={14} /> : index + 1}
              </div>
              <div className="stepper-info">
                <div className="stepper-label">{stepItem.label}</div>
                <div className="stepper-desc">{stepItem.desc}</div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`stepper-line${index < step ? ' completed' : ''}`} style={{ margin: '0 var(--sp-4)' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--sp-6)' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Step {step + 1}: {currentStepLabel}</div>
              <div className="card-subtitle">{currentStepDesc}</div>
            </div>
            <span
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-muted)',
                background: 'var(--neutral-100)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <div className="card-body">
            {step === 0 && <Step1 data={form} vendors={vendors} onChange={updateField} />}
            {step === 1 && <Step2 data={form} onChange={updateField} />}
            {step === 2 && <Step3 data={form} onChange={updateField} />}
            {step === 3 && <Step4 data={form} />}
            {error && (
              <div style={{ marginTop: 'var(--sp-4)', fontSize: 'var(--fs-sm)', color: 'var(--color-danger)' }}>
                {error}
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--sp-4) var(--sp-6)',
              borderTop: '1px solid var(--border-default)',
              background: 'var(--neutral-50)',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={previousStep}
              disabled={step === 0 || isPending}
            >
              <ArrowLeft size={14} />
              Previous
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={nextStep} disabled={isPending}>
                Next Step <ArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isPending}>
                {isPending ? 'Creating...' : form.mode === 'assign' ? 'Assign Project' : 'Open for Bidding'}
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'flex-start' }}>
          <div className="card-header">
            <div className="card-title">Tips</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Be specific on scope, constraints, and delivery timeline.
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Assign directly to a vendor or open for bidding — vendors will compete.
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Set budget and priority early to attract the right vendors.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
