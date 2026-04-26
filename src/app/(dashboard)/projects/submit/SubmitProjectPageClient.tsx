'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronLeft,
  FileText,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useSubmitProject, type SubmitProjectFormState } from '@/hooks/use-submit-project'

const DEFAULT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'Data & AI',
  'Cloud Infrastructure',
  'Design',
  'Marketing',
  'Consulting',
  'Other',
]

const BUDGET_RANGES: Record<string, { label: string; value: string }[]> = {
  USD: [
    { label: '$10K - $50K', value: '10K-50K' },
    { label: '$50K - $100K', value: '50K-100K' },
    { label: '$100K - $500K', value: '100K-500K' },
    { label: '$500K - $1M', value: '500K-1M' },
    { label: '$1M+', value: '1M+' },
  ],
  IDR: [
    { label: 'Rp 150 Jt - Rp 500 Jt', value: '150Jt-500Jt' },
    { label: 'Rp 500 Jt - Rp 1 M', value: '500Jt-1M' },
    { label: 'Rp 1 M - Rp 5 M', value: '1M-5M' },
    { label: 'Rp 5 M - Rp 15 M', value: '5M-15M' },
    { label: 'Rp 15 M+', value: '15M+' },
  ],
  EUR: [
    { label: 'EUR 10K - EUR 50K', value: '10K-50K' },
    { label: 'EUR 50K - EUR 100K', value: '50K-100K' },
    { label: 'EUR 100K - EUR 500K', value: '100K-500K' },
    { label: 'EUR 500K - EUR 1M', value: '500K-1M' },
    { label: 'EUR 1M+', value: '1M+' },
  ],
  SGD: [
    { label: 'SGD 15K - SGD 75K', value: '15K-75K' },
    { label: 'SGD 75K - SGD 150K', value: '75K-150K' },
    { label: 'SGD 150K - SGD 750K', value: '150K-750K' },
    { label: 'SGD 750K - SGD 1.5M', value: '750K-1.5M' },
    { label: 'SGD 1.5M+', value: '1.5M+' },
  ],
}

const CURRENCIES = [
  { code: 'IDR', symbol: 'Rp' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: 'EUR' },
  { code: 'SGD', symbol: 'SGD' },
]

const PRIORITIES = [
  { value: 'low', label: 'Low', desc: 'Non-urgent, flexible timeline' },
  { value: 'medium', label: 'Medium', desc: 'Normal business requirement' },
  { value: 'high', label: 'High', desc: 'Important, affects operations' },
  { value: 'critical', label: 'Critical', desc: 'Urgent, immediate attention needed' },
] as const

const TECH_OPTIONS = [
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'FastAPI',
  'Django',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Figma',
]

const STEPS = [
  { label: 'Project Basics', desc: 'Name and category' },
  { label: 'Requirements', desc: 'Scope and deliverables' },
  { label: 'Timeline', desc: 'Dates and budget' },
  { label: 'Attachments', desc: 'Upload files' },
  { label: 'Review', desc: 'Confirm and submit' },
]

function Step1({
  data,
  categories,
  onChange,
}: {
  data: SubmitProjectFormState
  categories: string[]
  onChange: <K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div className="form-group">
        <label className="form-label">
          Project Name <span className="form-required">*</span>
        </label>
        <input
          className="input"
          placeholder="e.g. E-Commerce Platform Revamp"
          value={data.projectName}
          onChange={(event) => onChange('projectName', event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Client Name <span className="form-required">*</span>
        </label>
        <input
          className="input"
          placeholder="e.g. PT Maju Bersama"
          value={data.clientName}
          onChange={(event) => onChange('clientName', event.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">
          Project Category <span className="form-required">*</span>
        </label>
        <select
          className="select"
          value={data.category}
          onChange={(event) => onChange('category', event.target.value)}
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">
          Brief Description <span className="form-required">*</span>
        </label>
        <textarea
          className="input input-textarea"
          rows={4}
          placeholder="Provide a brief overview of the project, its goals, and the problem it solves..."
          value={data.description}
          onChange={(event) => onChange('description', event.target.value)}
        />
      </div>
    </div>
  )
}

function Step2({
  data,
  onChange,
}: {
  data: SubmitProjectFormState
  onChange: <K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) => void
}) {
  const [newDeliverable, setNewDeliverable] = useState('')

  function addDeliverable() {
    const deliverable = newDeliverable.trim()
    if (!deliverable) {
      return
    }

    onChange('deliverables', [...data.deliverables, deliverable])
    setNewDeliverable('')
  }

  function toggleTech(tech: string) {
    const next = data.techStack.includes(tech)
      ? data.techStack.filter((item) => item !== tech)
      : [...data.techStack, tech]
    onChange('techStack', next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <div className="form-group">
        <label className="form-label">
          Detailed Requirements <span className="form-required">*</span>
        </label>
        <textarea
          className="input input-textarea"
          rows={5}
          placeholder="Describe the technical and functional requirements in detail."
          value={data.requirements}
          onChange={(event) => onChange('requirements', event.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Key Deliverables</label>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
          <input
            className="input"
            placeholder="Add a deliverable..."
            value={newDeliverable}
            onChange={(event) => setNewDeliverable(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addDeliverable()
              }
            }}
          />
          <button type="button" className="btn btn-secondary" onClick={addDeliverable}>
            <Plus size={14} />
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {data.deliverables.map((deliverable, index) => (
            <div
              key={`${deliverable}-${index}`}
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
              <span style={{ flex: 1, fontSize: 'var(--fs-sm)' }}>{deliverable}</span>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    'deliverables',
                    data.deliverables.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                style={{
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Tech Stack</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {TECH_OPTIONS.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`chip${data.techStack.includes(tech) ? ' selected' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              {data.techStack.includes(tech) && <Check size={11} />}
              {tech}
            </button>
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
  data: SubmitProjectFormState
  onChange: <K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) => void
}) {
  const budgetOptions = BUDGET_RANGES[data.currency] ?? BUDGET_RANGES.USD ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            Expected Start Date <span className="form-required">*</span>
          </label>
          <input
            className="input"
            type="date"
            value={data.startDate}
            onChange={(event) => onChange('startDate', event.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Expected End Date <span className="form-required">*</span>
          </label>
          <input
            className="input"
            type="date"
            value={data.endDate}
            onChange={(event) => onChange('endDate', event.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Budget and Currency <span className="form-required">*</span>
        </label>
        <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
          <div style={{ width: '140px' }}>
            <select
              className="select"
              value={data.currency}
              onChange={(event) => {
                onChange('currency', event.target.value)
                onChange('budgetRange', '')
              }}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <select
              className="select"
              value={data.budgetRange}
              onChange={(event) => onChange('budgetRange', event.target.value)}
            >
              <option value="">Select budget range...</option>
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Priority Level <span className="form-required">*</span>
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--sp-3)',
            marginTop: 'var(--sp-1)',
          }}
        >
          {PRIORITIES.map((priority) => (
            <label
              key={priority.value}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--sp-3)',
                padding: 'var(--sp-4)',
                border: `2px solid ${
                  data.priority === priority.value ? 'var(--blue-500)' : 'var(--border-default)'
                }`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                background: data.priority === priority.value ? 'var(--blue-50)' : 'white',
              }}
            >
              <input
                type="radio"
                name="priority"
                value={priority.value}
                checked={data.priority === priority.value}
                onChange={() => onChange('priority', priority.value)}
                style={{ accentColor: 'var(--blue-600)', marginTop: '1px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                  {priority.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}
                >
                  {priority.desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step4({
  data,
  onChange,
}: {
  data: SubmitProjectFormState
  onChange: <K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(fileList: FileList | null) {
    if (!fileList) {
      return
    }

    const nextFiles = Array.from(fileList).filter((file) => file.size <= 20 * 1024 * 1024)
    onChange('files', [...data.files, ...nextFiles])
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
      >
        <div className="dropzone-icon">
          <Upload size={24} />
        </div>
        <div className="dropzone-title">Drop files here or click to upload</div>
        <div className="dropzone-hint">PDF, DOCX, XLSX, PNG, JPG - max 20MB per file</div>
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.pptx"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {data.files.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-3)',
            }}
          >
            Attached Files ({data.files.length})
          </div>
          <div className="file-list" style={{ marginTop: 0 }}>
            {data.files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="file-item">
                <div className="file-item-icon">
                  <FileText size={16} />
                </div>
                <span className="file-item-name">{file.name}</span>
                <span className="file-item-size">{formatSize(file.size)}</span>
                <button
                  type="button"
                  className="file-remove"
                  onClick={() =>
                    onChange(
                      'files',
                      data.files.filter((_, fileIndex) => fileIndex !== index),
                    )
                  }
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Step5({ data }: { data: SubmitProjectFormState }) {
  const sections = [
    {
      title: 'Project Basics',
      items: [
        { label: 'Project Name', value: data.projectName || '-' },
        { label: 'Client Name', value: data.clientName || '-' },
        { label: 'Category', value: data.category || '-' },
      ],
    },
    {
      title: 'Requirements',
      items: [
        { label: 'Requirements', value: data.requirements || '-' },
        {
          label: 'Deliverables',
          value: data.deliverables.length > 0 ? `${data.deliverables.length} items` : '-',
        },
        {
          label: 'Tech Stack',
          value: data.techStack.length > 0 ? data.techStack.join(', ') : 'Not specified',
        },
      ],
    },
    {
      title: 'Timeline and Budget',
      items: [
        { label: 'Start Date', value: data.startDate || '-' },
        { label: 'End Date', value: data.endDate || '-' },
        {
          label: 'Budget Range',
          value: data.budgetRange ? `${data.currency} ${data.budgetRange}` : '-',
        },
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
          Review your project details before submitting.
        </span>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="card">
          <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
            <div className="card-title" style={{ fontSize: 'var(--fs-sm)' }}>
              {section.title}
            </div>
          </div>
          <div style={{ padding: '0 var(--sp-5)' }}>
            {section.items.map(({ label, value }) => (
              <div key={label} className="info-row" style={{ padding: 'var(--sp-3) 0' }}>
                <div className="info-label" style={{ width: '130px' }}>
                  {label}
                </div>
                <div className="info-value" style={{ fontSize: 'var(--fs-sm)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SubmitProjectPageClient({ categories }: { categories: string[] }) {
  const { error, formData, isPending, nextStep, previousStep, step, submit, updateField } =
    useSubmitProject()
  const currentStep = STEPS[step] ?? STEPS[0] ?? { label: 'Project Basics', desc: '' }
  const projectCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <Link href="/projects">
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 'var(--sp-4)', paddingLeft: '4px' }}
          >
            <ChevronLeft size={14} />
            Back
          </button>
        </Link>
        <h1 className="page-title">Submit New Project</h1>
        <p className="page-subtitle">Complete all steps to submit your project to Summon.</p>
      </div>

      <div className="stepper" style={{ marginBottom: 'var(--sp-8)' }}>
        {STEPS.map((stepItem, index) => (
          <div
            key={stepItem.label}
            className="stepper-item"
            style={{ flex: index < STEPS.length - 1 ? 1 : 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div
                className={`stepper-circle${step === index ? ' active' : index < step ? ' completed' : ''}`}
              >
                {index < step ? <Check size={14} /> : index + 1}
              </div>
              <div className="stepper-info">
                <div className="stepper-label">{stepItem.label}</div>
                <div className="stepper-desc">{stepItem.desc}</div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`stepper-line${index < step ? ' completed' : ''}`}
                style={{ margin: '0 var(--sp-4)' }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--sp-6)' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                Step {step + 1}: {currentStep.label}
              </div>
              <div className="card-subtitle">{currentStep.desc}</div>
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
            {step === 0 && (
              <Step1 data={formData} categories={projectCategories} onChange={updateField} />
            )}
            {step === 1 && <Step2 data={formData} onChange={updateField} />}
            {step === 2 && <Step3 data={formData} onChange={updateField} />}
            {step === 3 && <Step4 data={formData} onChange={updateField} />}
            {step === 4 && <Step5 data={formData} />}
            {error && (
              <div
                style={{
                  marginTop: 'var(--sp-4)',
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--color-danger)',
                }}
              >
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
            {step < 4 ? (
              <button className="btn btn-primary" onClick={nextStep} disabled={isPending}>
                Next Step
                <ArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={submit} disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Project'}
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'flex-start' }}>
          <div className="card-header">
            <div className="card-title">Submission Tips</div>
          </div>
          <div
            className="card-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}
          >
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Be specific on scope, constraints, and delivery timeline.
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Add supporting documents so admin and vendors can review faster.
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Clarify budget and priority early to reduce back-and-forth.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
