export type ProjectStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'need_clarification'

export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical'

export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

export interface StatusHistory {
  id: string
  date: string
  status: ProjectStatus
  note?: string
  changedBy: string
}

export interface ProjectFile {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
}

export type ProjectSource = 'SUMMON'

export interface Project {
  id: string
  name: string
  clientName?: string
  category: string
  description: string
  requirements: string
  deliverables: string[]
  techStack: string[]
  startDate: string
  endDate: string
  budgetRange: string
  priority: ProjectPriority
  status: ProjectStatus
  submittedAt: string
  updatedAt: string
  files: ProjectFile[]
  statusHistory: StatusHistory[]
  source: ProjectSource
}

export interface Quote {
  id: string
  projectId: string
  projectName: string
  vendorId: string
  vendorName: string
  amount: number
  currency: string
  duration: number // in days
  proposal: string
  status: QuoteStatus
  submittedAt: string
}

export const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'E-Commerce Platform Revamp',
    clientName: 'PT Maju Bersama',
    category: 'Web Development',
    description:
      'Complete redesign and re-engineering of an existing e-commerce web platform serving 50,000+ monthly active users. The current platform is built on a legacy PHP stack and needs to be migrated to a modern microservices architecture.',
    requirements:
      'Need a full-stack team capable of designing, developing, and deploying a scalable e-commerce solution. Must support Indonesian payment gateways (Midtrans, DOKU), multi-language, and mobile-first experience.',
    deliverables: [
      'Responsive web application (React + Next.js)',
      'RESTful API backend (Node.js / FastAPI)',
      'Admin CMS for product management',
      'Integration with Midtrans & DOKU payment gateways',
      'Technical documentation and deployment guide',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    startDate: '2026-03-15',
    endDate: '2026-07-31',
    budgetRange: '$50K–$100K',
    priority: 'high',
    status: 'under_review',
    submittedAt: '2026-02-20T10:30:00Z',
    updatedAt: '2026-02-22T14:00:00Z',
    files: [
      {
        id: 'f1',
        name: 'project-brief.pdf',
        size: '2.4 MB',
        type: 'pdf',
        uploadedAt: '2026-02-20T10:30:00Z',
      },
      {
        id: 'f2',
        name: 'technical-requirements.docx',
        size: '1.1 MB',
        type: 'docx',
        uploadedAt: '2026-02-20T10:30:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sh1',
        date: '2026-02-20T10:30:00Z',
        status: 'submitted',
        changedBy: 'system',
        note: 'Project submitted successfully.',
      },
      {
        id: 'sh2',
        date: '2026-02-22T14:00:00Z',
        status: 'under_review',
        changedBy: 'Admin — Rina H.',
        note: 'Project is being evaluated by our technical team.',
      },
    ],
    source: 'SUMMON',
  },
  {
    id: 'PRJ-002',
    name: 'HR Management Mobile App',
    clientName: 'CV Sumber Jaya',
    category: 'Mobile App',
    description:
      'Build a mobile HR management application for a manufacturing company with 200+ employees. Includes attendance, payroll, leave management, and employee directory.',
    requirements:
      'Cross-platform mobile app (iOS & Android) with offline capability. Integration with existing biometric attendance hardware via API.',
    deliverables: [
      'React Native mobile application',
      'Backend API and database',
      'Biometric hardware integration module',
      'Dashboard web app for HR managers',
    ],
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Firebase'],
    startDate: '2026-04-01',
    endDate: '2026-08-30',
    budgetRange: '$10K–$50K',
    priority: 'medium',
    status: 'accepted',
    submittedAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-18T11:00:00Z',
    files: [
      {
        id: 'f3',
        name: 'hr-app-brief.pdf',
        size: '985 KB',
        type: 'pdf',
        uploadedAt: '2026-02-10T08:00:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sh3',
        date: '2026-02-10T08:00:00Z',
        status: 'submitted',
        changedBy: 'system',
        note: 'Project submitted successfully.',
      },
      {
        id: 'sh4',
        date: '2026-02-13T09:00:00Z',
        status: 'under_review',
        changedBy: 'Admin — Rina H.',
        note: 'Under technical evaluation.',
      },
      {
        id: 'sh5',
        date: '2026-02-18T11:00:00Z',
        status: 'accepted',
        changedBy: 'Admin — Rina H.',
        note: 'Project accepted. Vendor selection in progress.',
      },
    ],
    source: 'SUMMON',
  },
  {
    id: 'PRJ-003',
    name: 'Data Analytics Dashboard',
    clientName: 'PT Delta Sukses',
    category: 'Data & AI',
    description:
      'Build a real-time business intelligence dashboard that aggregates sales data from multiple sources and provides predictive insights using machine learning models.',
    requirements:
      'Must integrate with existing ERP (SAP), process data in near real-time, and provide exportable reports in Excel/PDF format.',
    deliverables: [
      'React-based BI dashboard',
      'Python data pipeline (ETL)',
      'ML model for sales forecasting',
      'SAP integration connector',
    ],
    techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Apache Kafka', 'TensorFlow'],
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    budgetRange: '$100K–$500K',
    priority: 'critical',
    status: 'need_clarification',
    submittedAt: '2026-02-15T13:00:00Z',
    updatedAt: '2026-02-24T10:00:00Z',
    files: [
      {
        id: 'f4',
        name: 'analytics-requirements.pdf',
        size: '3.2 MB',
        type: 'pdf',
        uploadedAt: '2026-02-15T13:00:00Z',
      },
      {
        id: 'f5',
        name: 'data-flow-diagram.png',
        size: '450 KB',
        type: 'png',
        uploadedAt: '2026-02-15T13:00:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sh6',
        date: '2026-02-15T13:00:00Z',
        status: 'submitted',
        changedBy: 'system',
        note: 'Project submitted successfully.',
      },
      {
        id: 'sh7',
        date: '2026-02-17T09:00:00Z',
        status: 'under_review',
        changedBy: 'Admin — Reza M.',
        note: 'Reviewing requirements.',
      },
      {
        id: 'sh8',
        date: '2026-02-24T10:00:00Z',
        status: 'need_clarification',
        changedBy: 'Admin — Reza M.',
        note: 'Please provide more detail on the SAP version being used and expected data volume per day.',
      },
    ],
    source: 'SUMMON',
  },
  {
    id: 'PRJ-004',
    name: 'Cloud Infrastructure Migration',
    clientName: 'PT Cipta Solusi',
    category: 'Cloud Infrastructure',
    description:
      'Migrate on-premise infrastructure (50+ VMs) to AWS cloud with zero-downtime deployment strategy and cost optimization.',
    requirements:
      'DevOps team experienced with AWS, Terraform, and Kubernetes. Must include security audit and compliance review.',
    deliverables: [
      'Cloud architecture and migration plan',
      'Terraform IaC scripts',
      'Kubernetes cluster setup',
      'Security and compliance documentation',
    ],
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Ansible'],
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    budgetRange: '$50K–$100K',
    priority: 'high',
    status: 'submitted',
    submittedAt: '2026-02-25T16:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z',
    files: [
      {
        id: 'f6',
        name: 'infrastructure-inventory.xlsx',
        size: '780 KB',
        type: 'xlsx',
        uploadedAt: '2026-02-25T16:00:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sh9',
        date: '2026-02-25T16:00:00Z',
        status: 'submitted',
        changedBy: 'system',
        note: 'Project submitted successfully.',
      },
    ],
    source: 'SUMMON',
  },
  {
    id: 'PRJ-005',
    name: 'Corporate Branding & Design System',
    clientName: 'Koperasi Mitra Sejahtera',
    category: 'Design',
    description:
      'Full corporate rebranding project including logo design, brand guidelines, design system creation, and website redesign for a growing cooperative.',
    requirements:
      'Creative design agency with B2B portfolio. Must deliver brand guidelines document, Figma design system, and fully responsive website.',
    deliverables: [
      'Brand strategy and identity guide',
      'Logo and visual assets (all formats)',
      'Figma design system library',
      'Corporate website redesign',
    ],
    techStack: ['Figma', 'React', 'Next.js'],
    startDate: '2026-03-20',
    endDate: '2026-05-31',
    budgetRange: '<$10K',
    priority: 'low',
    status: 'rejected',
    submittedAt: '2026-02-05T14:00:00Z',
    updatedAt: '2026-02-12T09:00:00Z',
    files: [],
    statusHistory: [
      {
        id: 'sh10',
        date: '2026-02-05T14:00:00Z',
        status: 'submitted',
        changedBy: 'system',
        note: 'Project submitted successfully.',
      },
      {
        id: 'sh11',
        date: '2026-02-08T10:00:00Z',
        status: 'under_review',
        changedBy: 'Admin — Rina H.',
        note: 'Under review.',
      },
      {
        id: 'sh12',
        date: '2026-02-12T09:00:00Z',
        status: 'rejected',
        changedBy: 'Admin — Rina H.',
        note: 'Budget is outside the minimum threshold for our vendor network. We suggest increasing the budget or contacting local freelancers.',
      },
    ],
    source: 'SUMMON',
  },
]

export const mockSeller = {
  name: 'Budi Santoso',
  email: 'budi@aryateknologi.co.id',
  company: 'PT Arya Teknologi',
  industry: 'Technology',
  companySize: '50–200 employees',
  website: 'https://aryateknologi.co.id',
  joinedAt: '2026-01-15',
}

export const mockVendor = {
  id: 'VND-001',
  name: 'Indo AI Solutions',
  email: 'contact@indoai.com',
  company: 'Indo AI Solutions',
  industry: 'Software Development & AI',
  companySize: '20-50 employees',
  website: 'https://indoai.com',
  joinedAt: '2025-11-20',
  tier: 'Gold',
}

export const mockQuotes: Quote[] = [
  {
    id: 'QT-001',
    projectId: 'PRJ-002',
    projectName: 'HR Management Mobile App',
    vendorId: 'VND-001',
    vendorName: 'Indo AI Solutions',
    amount: 35000,
    currency: 'USD',
    duration: 120,
    proposal:
      'We propose building the HR Management app using React Native for a cross-platform experience. Our team has extensive experience in biometric integrations and manufacturing sector workflows.',
    status: 'pending',
    submittedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'QT-002',
    projectId: 'PRJ-004',
    projectName: 'Cloud Infrastructure Migration',
    vendorId: 'VND-001',
    vendorName: 'Indo AI Solutions',
    amount: 65000,
    currency: 'USD',
    duration: 90,
    proposal:
      'Our cloud migration strategy focuses on zero-downtime using Blue-Green deployments. We will use Terraform for Infrastructure as Code and set up a robust EKS cluster.',
    status: 'accepted',
    submittedAt: '2026-02-26T14:30:00Z',
  },
]

export const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  need_clarification: 'Need Clarification',
}

export const quoteStatusLabels: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ============================================================
   BUSINESS INSIGHTS DATA
   ============================================================ */

export const monthlySubmissions = [
  { month: 'Sep', submissions: 1, revenue: 15000 },
  { month: 'Oct', submissions: 2, revenue: 45000 },
  { month: 'Nov', submissions: 3, revenue: 78000 },
  { month: 'Dec', submissions: 1, revenue: 22000 },
  { month: 'Jan', submissions: 3, revenue: 95000 },
  { month: 'Feb', submissions: 5, revenue: 160000 },
]

export const revenuePipeline = {
  accepted: { label: 'Accepted', value: 85000, color: 'var(--color-success)' },
  inProgress: { label: 'In Progress', value: 210000, color: 'var(--blue-500)' },
  total: 295000,
}

export const categoryBreakdown = [
  {
    category: 'Web Development',
    count: 1,
    revenue: 75000,
    color: 'var(--blue-500)',
    percent: 25.4,
  },
  {
    category: 'Mobile App',
    count: 1,
    revenue: 35000,
    color: 'var(--color-success)',
    percent: 11.9,
  },
  { category: 'Data & AI', count: 1, revenue: 120000, color: 'var(--color-purple)', percent: 40.7 },
  {
    category: 'Cloud Infra',
    count: 1,
    revenue: 55000,
    color: 'var(--color-warning)',
    percent: 18.6,
  },
  { category: 'Design', count: 1, revenue: 10000, color: 'var(--color-danger)', percent: 3.4 },
]
