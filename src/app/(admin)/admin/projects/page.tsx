'use client'

import { useState } from 'react'
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  MessageSquare,
  Send,
  FileText,
  Calendar,
  DollarSign,
  User,
} from 'lucide-react'
import { formatUSDtoIDR, parseCurrency } from '@/lib/currency'

interface Project {
  id: string
  name: string
  supplier: string
  supplierEmail: string
  category: string
  description: string
  requirements: string
  deliverables: string[]
  techStack: string[]
  startDate: string
  endDate: string
  budget: string
  budgetCurrency: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'need_clarification'
  submittedAt: string
  files: { name: string; size: string }[]
  notes: { text: string; by: string; at: string; type: 'clarification' | 'status_change' }[]
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Cloud Infrastructure Migration',
    supplier: 'PT Arya Teknologi',
    supplierEmail: 'budi@aryateknologi.co.id',
    category: 'Cloud Infrastructure',
    budget: '$50,000',
    budgetCurrency: 'USD',
    status: 'accepted',
    submittedAt: '2024-03-15',
    description: 'Migrate on-premise infrastructure to AWS with zero-downtime deployment.',
    requirements: 'Need experienced DevOps team with AWS and Kubernetes expertise.',
    deliverables: ['AWS Architecture', 'Terraform Scripts', 'K8s Cluster', 'Documentation'],
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'Docker'],
    startDate: '2024-04-01',
    endDate: '2024-07-30',
    priority: 'high',
    files: [{ name: 'project-brief.pdf', size: '2.4 MB' }],
    notes: [
      {
        text: 'Project approved for Q2 execution',
        by: 'Admin',
        at: '2024-03-16',
        type: 'status_change',
      },
    ],
  },
  {
    id: 'PRJ-002',
    name: 'AI Chatbot Implementation',
    supplier: 'Digital Solusi Indonesia',
    supplierEmail: 'contact@digitalsolusi.id',
    category: 'Conversational AI',
    budget: '$35,000',
    budgetCurrency: 'USD',
    status: 'under_review',
    submittedAt: '2024-03-18',
    description: 'Build an AI-powered chatbot for customer service automation.',
    requirements: 'Must support Indonesian language and integrate with existing CRM.',
    deliverables: ['Chatbot Web App', 'Admin Dashboard', 'Integration API'],
    techStack: ['Python', 'LangChain', 'React', 'PostgreSQL'],
    startDate: '2024-05-01',
    endDate: '2024-08-30',
    priority: 'medium',
    files: [
      { name: 'proposal.pdf', size: '1.8 MB' },
      { name: 'requirements.docx', size: '500 KB' },
    ],
    notes: [],
  },
  {
    id: 'PRJ-003',
    name: 'Data Analytics Dashboard',
    supplier: 'Tech Nusantara',
    supplierEmail: 'info@technusantara.co.id',
    category: 'Analytics',
    budget: '$25,000',
    budgetCurrency: 'USD',
    status: 'need_clarification',
    submittedAt: '2024-03-20',
    description: 'Real-time business intelligence dashboard with predictive analytics.',
    requirements: 'Need clarification on data sources and expected data volume.',
    deliverables: ['BI Dashboard', 'ML Models', 'API Connectors'],
    techStack: ['Python', 'FastAPI', 'React', 'TensorFlow'],
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    priority: 'high',
    files: [{ name: 'specs.pdf', size: '3.2 MB' }],
    notes: [
      {
        text: 'Please provide more details about your existing data sources and expected daily data volume.',
        by: 'Admin',
        at: '2024-03-21',
        type: 'clarification',
      },
    ],
  },
  {
    id: 'PRJ-004',
    name: 'Computer Vision System',
    supplier: 'Cahaya Digital Makmur',
    supplierEmail: 'hello@cdm.tech',
    category: 'Computer Vision',
    budget: '$80,000',
    budgetCurrency: 'USD',
    status: 'submitted',
    submittedAt: '2024-03-22',
    description: 'Build computer vision system for quality control in manufacturing.',
    requirements: 'Must detect defects with 99% accuracy and process 1000+ images per minute.',
    deliverables: ['CV Models', 'Real-time Dashboard', 'API'],
    techStack: ['Python', 'OpenCV', 'PyTorch', 'AWS'],
    startDate: '2024-04-15',
    endDate: '2024-10-15',
    priority: 'critical',
    files: [
      { name: 'technical-spec.pdf', size: '5.1 MB' },
      { name: 'demo-video.mp4', size: '45 MB' },
    ],
    notes: [],
  },
  {
    id: 'PRJ-005',
    name: 'Security Audit',
    supplier: 'Indo AI Solutions',
    supplierEmail: 'security@indoai.id',
    category: 'Security',
    budget: '$15,000',
    budgetCurrency: 'USD',
    status: 'rejected',
    submittedAt: '2024-03-10',
    description: 'Comprehensive security audit for web applications.',
    requirements: 'Budget too low for our standard security audit scope.',
    deliverables: ['Audit Report', 'Remediation Plan'],
    techStack: ['Nmap', 'Burp Suite', 'OWASP'],
    startDate: '2024-04-01',
    endDate: '2024-05-15',
    priority: 'medium',
    files: [],
    notes: [
      {
        text: 'Budget is below minimum threshold. Please increase budget or contact local consultants.',
        by: 'Admin',
        at: '2024-03-11',
        type: 'status_change',
      },
    ],
  },
]

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'var(--blue-600)', bg: 'var(--blue-50)', icon: Clock },
  under_review: {
    label: 'Under Review',
    color: 'var(--color-purple)',
    bg: 'var(--color-purple-bg)',
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--color-danger)',
    bg: 'var(--color-danger-bg)',
    icon: XCircle,
  },
  need_clarification: {
    label: 'Need Clarification',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
    icon: AlertCircle,
  },
}

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'var(--text-muted)' },
  medium: { label: 'Medium', color: 'var(--blue-600)' },
  high: { label: 'High', color: 'var(--color-warning)' },
  critical: { label: 'Critical', color: 'var(--color-danger)' },
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionModal, setActionModal] = useState<{
    project: Project
    action: 'accept' | 'reject' | 'clarify'
  } | null>(null)
  const [actionNote, setActionNote] = useState('')

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAction = (project: Project, action: 'accept' | 'reject' | 'clarify') => {
    setActionModal({ project, action })
    setActionNote('')
  }

  const submitAction = () => {
    if (!actionModal || (!actionNote.trim() && actionModal.action !== 'accept')) return

    const { project, action } = actionModal
    const newStatus =
      action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'need_clarification'

    const note = {
      text:
        actionNote ||
        (action === 'accept'
          ? 'Project accepted'
          : action === 'reject'
            ? 'Project rejected'
            : 'Clarification requested'),
      by: 'Admin',
      at: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
      type: action === 'clarify' ? ('clarification' as const) : ('status_change' as const),
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, status: newStatus, notes: [...p.notes, note] } : p,
      ),
    )

    setActionModal(null)
    setActionNote('')
    setShowModal(false)
  }

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project)
    setShowModal(true)
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Review and manage supplier project submissions.</p>
        </div>
      </div>

      {/* Status Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = projects.filter((p) => p.status === key).length
          const Icon = config.icon
          return (
            <div
              key={key}
              className="card"
              style={{
                padding: 'var(--sp-4)',
                cursor: 'pointer',
                border:
                  statusFilter === key
                    ? '2px solid var(--blue-600)'
                    : '1px solid var(--border-default)',
              }}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                <Icon size={16} style={{ color: config.color }} />
                <span
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: config.color,
                    fontWeight: 'var(--fw-semibold)',
                  }}
                >
                  {config.label}
                </span>
              </div>
              <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '10px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const statusConfig = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.submitted
                const priorityConfig = PRIORITY_CONFIG[project.priority] ?? PRIORITY_CONFIG.medium
                const StatusIcon = statusConfig.icon
                return (
                  <tr key={project.id}>
                    <td
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {project.id}
                    </td>
                    <td style={{ fontWeight: 'var(--fw-semibold)' }}>{project.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{project.supplier}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{project.category}</td>
                    <td style={{ fontWeight: 'var(--fw-medium)' }}>
                      {formatUSDtoIDR(parseCurrency(project.budget))}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                          color: priorityConfig.color,
                        }}
                      >
                        {priorityConfig.label}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                          background: statusConfig.bg,
                          color: statusConfig.color,
                        }}
                      >
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="View Details"
                          onClick={() => openProjectDetail(project)}
                        >
                          <Eye size={14} />
                        </button>
                        {project.status === 'submitted' || project.status === 'under_review' ? (
                          <>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Accept"
                              style={{ color: 'var(--color-success)' }}
                              onClick={() => handleAction(project, 'accept')}
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Reject"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleAction(project, 'reject')}
                            >
                              <XCircle size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Request Clarification"
                              style={{ color: 'var(--color-warning)' }}
                              onClick={() => handleAction(project, 'clarify')}
                            >
                              <MessageSquare size={14} />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Detail Modal */}
      {showModal && selectedProject && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>

            <div
              style={{
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: 'var(--sp-4)',
                marginBottom: 'var(--sp-4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--text-muted)',
                      marginRight: 'var(--sp-2)',
                    }}
                  >
                    {selectedProject.id}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-semibold)',
                      background: STATUS_CONFIG[selectedProject.status].bg,
                      color: STATUS_CONFIG[selectedProject.status].color,
                    }}
                  >
                    {STATUS_CONFIG[selectedProject.status].label}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  Submitted: {selectedProject.submittedAt}
                </div>
              </div>
              <h2 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)' }}>
                {selectedProject.name}
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--sp-4)',
                marginBottom: 'var(--sp-4)',
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    fontWeight: 'var(--fw-semibold)',
                    textTransform: 'uppercase',
                  }}
                >
                  Supplier
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    marginTop: 'var(--sp-1)',
                  }}
                >
                  <User size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>{selectedProject.supplier}</span>
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--text-muted)',
                    marginLeft: '22px',
                  }}
                >
                  {selectedProject.supplierEmail}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    fontWeight: 'var(--fw-semibold)',
                    textTransform: 'uppercase',
                  }}
                >
                  Category
                </label>
                <div style={{ marginTop: 'var(--sp-1)' }}>{selectedProject.category}</div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    fontWeight: 'var(--fw-semibold)',
                    textTransform: 'uppercase',
                  }}
                >
                  Budget
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    marginTop: 'var(--sp-1)',
                  }}
                >
                  <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 'var(--fw-semibold)' }}>
                    {formatUSDtoIDR(parseCurrency(selectedProject.budget))}
                  </span>
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    fontWeight: 'var(--fw-semibold)',
                    textTransform: 'uppercase',
                  }}
                >
                  Timeline
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    marginTop: 'var(--sp-1)',
                  }}
                >
                  <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>
                    {selectedProject.startDate} - {selectedProject.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-muted)',
                  fontWeight: 'var(--fw-semibold)',
                  textTransform: 'uppercase',
                }}
              >
                Description
              </label>
              <p style={{ marginTop: 'var(--sp-1)', color: 'var(--text-secondary)' }}>
                {selectedProject.description}
              </p>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-muted)',
                  fontWeight: 'var(--fw-semibold)',
                  textTransform: 'uppercase',
                }}
              >
                Requirements
              </label>
              <p style={{ marginTop: 'var(--sp-1)', color: 'var(--text-secondary)' }}>
                {selectedProject.requirements}
              </p>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-muted)',
                  fontWeight: 'var(--fw-semibold)',
                  textTransform: 'uppercase',
                }}
              >
                Deliverables
              </label>
              <ul
                style={{
                  marginTop: 'var(--sp-1)',
                  paddingLeft: 'var(--sp-4)',
                  color: 'var(--text-secondary)',
                }}
              >
                {selectedProject.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-muted)',
                  fontWeight: 'var(--fw-semibold)',
                  textTransform: 'uppercase',
                }}
              >
                Tech Stack
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-2)',
                  marginTop: 'var(--sp-2)',
                }}
              >
                {selectedProject.techStack.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '2px 8px',
                      background: 'var(--blue-50)',
                      color: 'var(--blue-700)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-medium)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.files.length > 0 && (
              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <label
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    fontWeight: 'var(--fw-semibold)',
                    textTransform: 'uppercase',
                  }}
                >
                  Attachments
                </label>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sp-2)',
                    marginTop: 'var(--sp-2)',
                  }}
                >
                  {selectedProject.files.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        padding: 'var(--sp-2)',
                        background: 'var(--neutral-50)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <FileText size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ flex: 1, fontSize: 'var(--fs-sm)' }}>{file.name}</span>
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {file.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div>
              <label
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-muted)',
                  fontWeight: 'var(--fw-semibold)',
                  textTransform: 'uppercase',
                }}
              >
                Activity & Notes
              </label>
              <div
                style={{
                  marginTop: 'var(--sp-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-2)',
                }}
              >
                {selectedProject.notes.length === 0 ? (
                  <div
                    style={{
                      padding: 'var(--sp-4)',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: 'var(--fs-sm)',
                    }}
                  >
                    No notes yet
                  </div>
                ) : (
                  selectedProject.notes.map((note, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 'var(--sp-3)',
                        background:
                          note.type === 'clarification'
                            ? 'var(--color-warning-bg)'
                            : 'var(--neutral-50)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 'var(--sp-1)',
                        }}
                      >
                        <span
                          style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)' }}
                        >
                          {note.type === 'clarification' ? 'Clarification' : 'Status Change'}
                        </span>
                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {note.by} • {note.at}
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                        {note.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {(selectedProject.status === 'submitted' ||
              selectedProject.status === 'under_review') && (
              <div
                style={{
                  marginTop: 'var(--sp-6)',
                  paddingTop: 'var(--sp-4)',
                  borderTop: '1px solid var(--border-default)',
                  display: 'flex',
                  gap: 'var(--sp-3)',
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: 'var(--color-success)' }}
                  onClick={() => {
                    setShowModal(false)
                    handleAction(selectedProject, 'accept')
                  }}
                >
                  <CheckCircle size={16} /> Accept Project
                </button>
                <button
                  className="btn btn-ghost"
                  style={{
                    flex: 1,
                    color: 'var(--color-danger)',
                    border: '1px solid var(--color-danger)',
                  }}
                  onClick={() => {
                    setShowModal(false)
                    handleAction(selectedProject, 'reject')
                  }}
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  className="btn btn-ghost"
                  style={{
                    flex: 1,
                    color: 'var(--color-warning)',
                    border: '1px solid var(--color-warning)',
                  }}
                  onClick={() => {
                    setShowModal(false)
                    handleAction(selectedProject, 'clarify')
                  }}
                >
                  <MessageSquare size={16} /> Request Clarification
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="modal-backdrop" onClick={() => setActionModal(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setActionModal(null)}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--sp-2)' }}>
              {actionModal.action === 'accept' && 'Accept Project'}
              {actionModal.action === 'reject' && 'Reject Project'}
              {actionModal.action === 'clarify' && 'Request Clarification'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
              {actionModal.action === 'accept' &&
                `Are you sure you want to accept "${actionModal.project.name}"?`}
              {actionModal.action === 'reject' &&
                `Are you sure you want to reject "${actionModal.project.name}"?`}
              {actionModal.action === 'clarify' &&
                `Send a clarification request to ${actionModal.project.supplier}.`}
            </p>

            <div className="form-group">
              <label className="form-label">
                {actionModal.action === 'accept'
                  ? 'Note (optional)'
                  : actionModal.action === 'reject'
                    ? 'Reason for rejection *'
                    : 'Question for seller *'}
              </label>
              <textarea
                className="input input-textarea"
                placeholder={
                  actionModal.action === 'accept'
                    ? 'Add a note about the acceptance...'
                    : actionModal.action === 'reject'
                      ? 'Explain why the project was rejected...'
                      : 'Ask a question or request more information...'
                }
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={4}
                required={actionModal.action !== 'accept'}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setActionModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{
                  flex: 1,
                  background:
                    actionModal.action === 'accept'
                      ? 'var(--color-success)'
                      : actionModal.action === 'reject'
                        ? 'var(--color-danger)'
                        : 'var(--color-warning)',
                }}
                onClick={submitAction}
                disabled={actionModal.action !== 'accept' && !actionNote.trim()}
              >
                <Send size={16} />
                {actionModal.action === 'accept' && 'Accept'}
                {actionModal.action === 'reject' && 'Reject'}
                {actionModal.action === 'clarify' && 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
