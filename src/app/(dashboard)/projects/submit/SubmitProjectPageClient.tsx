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
import {
  useSubmitProject,
  type SubmitProjectFieldErrors,
  type SubmitProjectFormState,
} from '@/hooks/use-submit-project'

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

const BUDGET_RANGES = [
  { label: 'Rp 5.000.000 - Rp 15.000.000', value: 'Rp 5.000.000 - Rp 15.000.000' },
  { label: 'Rp 15.000.000 - Rp 50.000.000', value: 'Rp 15.000.000 - Rp 50.000.000' },
  { label: 'Rp 50.000.000 - Rp 150.000.000', value: 'Rp 50.000.000 - Rp 150.000.000' },
  { label: 'Rp 150.000.000 - Rp 500.000.000', value: 'Rp 150.000.000 - Rp 500.000.000' },
  { label: 'Rp 500.000.000 - Rp 1.000.000.000', value: 'Rp 500.000.000 - Rp 1.000.000.000' },
  { label: 'Rp 1.000.000.000+', value: 'Rp 1.000.000.000+' },
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
  { label: 'Attachments', desc: 'Optional files' },
  { label: 'Review', desc: 'Confirm and submit' },
]

const STEP_TIPS = [
  [
    'Use a client-facing project name.',
    'Pick the closest category so the review team can route it quickly.',
  ],
  [
    'Start with outcomes, then list constraints.',
    'Add deliverables only when they are agreed or expected.',
  ],
  [
    'Use dates that reflect the real target window.',
    'Budget and priority help admin decide review urgency.',
  ],
  [
    'Attach specs, references, or existing proposals when available.',
    'Files are optional, but they reduce back-and-forth.',
  ],
  ['Check required fields before submitting.', 'After submission, the project detail page opens.'],
]

function FieldError({ message }: { message?: string | undefined }) {
  return message ? (
    <div
      style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-1)' }}
    >
      {message}
    </div>
  ) : null
}

function Step1({
  data,
  errors,
  categories,
  onChange,
}: {
  data: SubmitProjectFormState
  errors: SubmitProjectFieldErrors
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
        <FieldError message={errors.projectName} />
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
        <FieldError message={errors.clientName} />
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
        <FieldError message={errors.category} />
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
        <FieldError message={errors.description} />
      </div>
    </div>
  )
}

function Step2({
  data,
  errors,
  onChange,
}: {
  data: SubmitProjectFormState
  errors: SubmitProjectFieldErrors
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
        <FieldError message={errors.requirements} />
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addDeliverable}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                addDeliverable()
              }
            }}
          >
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChange(
                      'deliverables',
                      data.deliverables.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                }}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleTech(tech)
                }
              }}
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
  errors,
  onChange,
}: {
  data: SubmitProjectFormState
  errors: SubmitProjectFieldErrors
  onChange: <K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) => void
}) {
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
          <FieldError message={errors.startDate} />
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
          <FieldError message={errors.endDate} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Budget Range <span className="form-required">*</span>
        </label>
        <select
          className="select"
          value={data.budgetRange}
          onChange={(event) => onChange('budgetRange', event.target.value)}
        >
          <option value="">Select budget range...</option>
          {BUDGET_RANGES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.budgetRange} />
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
        <FieldError message={errors.priority} />
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
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([])

  function addFiles(fileList: FileList | null) {
    if (!fileList) {
      return
    }

    const files = Array.from(fileList)
    const nextFiles = files.filter((file) => file.size <= 20 * 1024 * 1024)
    setRejectedFiles(files.filter((file) => file.size > 20 * 1024 * 1024).map((file) => file.name))
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
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

      {rejectedFiles.length > 0 && (
        <div style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-sm)' }}>
          File exceeds 20MB: {rejectedFiles.join(', ')}
        </div>
      )}

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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onChange(
                        'files',
                        data.files.filter((_, fileIndex) => fileIndex !== index),
                      )
                    }
                  }}
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
          value: data.budgetRange || '-',
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
  const {
    error,
    fieldErrors,
    formData,
    isPending,
    nextStep,
    previousStep,
    step,
    submit,
    updateField,
  } = useSubmitProject()
  const currentStep = STEPS[step] ?? STEPS[0] ?? { label: 'Project Basics', desc: '' }
  const currentTips = STEP_TIPS[step] ?? []
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
            className={`stepper-item${step === index ? ' active' : index < step ? ' completed' : ''}`}
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

      <div className="form-aside-layout">
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
          {error && <div className="form-error-summary">{error}</div>}
          <div className="card-body">
            {step === 0 && (
              <Step1
                data={formData}
                errors={fieldErrors}
                categories={projectCategories}
                onChange={updateField}
              />
            )}
            {step === 1 && <Step2 data={formData} errors={fieldErrors} onChange={updateField} />}
            {step === 2 && <Step3 data={formData} errors={fieldErrors} onChange={updateField} />}
            {step === 3 && <Step4 data={formData} onChange={updateField} />}
            {step === 4 && <Step5 data={formData} />}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  previousStep()
                }
              }}
              disabled={step === 0 || isPending}
            >
              <ArrowLeft size={14} />
              Previous
            </button>
            {step < 4 ? (
              <button
                className="btn btn-primary"
                onClick={nextStep}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    nextStep()
                  }
                }}
                disabled={isPending}
              >
                Next Step
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={submit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    submit()
                  }
                }}
                disabled={isPending}
              >
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
            {currentTips.map((tip) => (
              <div key={tip} style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
