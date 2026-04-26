import { dbToMockPriority, dbToMockQuoteStatus, dbToMockStatus } from "@/lib/utils/data";

export function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export function serializeProjectFile(file: {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: Date;
  url: string | null;
}) {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.url,
    uploadedAt: file.uploadedAt.toISOString(),
  };
}

export function serializeVendorProject(project: {
  id: string;
  projectId: string;
  name: string;
  description: string;
  requirements: string | null;
  category: string;
  budgetRange: string | null;
  startDate: Date | null;
  endDate: Date | null;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  techStack?: string[] | null;
  files?: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: Date;
    url: string | null;
  }>;
  seller?: {
    companyName: string;
    user?: {
      name: string | null;
      email: string;
    } | null;
  } | null;
}) {
  return {
    id: project.id,
    projectId: project.projectId,
    name: project.name,
    description: project.description,
    requirements: project.requirements,
    category: project.category,
    budgetRange: project.budgetRange,
    startDate: toIsoString(project.startDate) ?? "",
    endDate: toIsoString(project.endDate) ?? "",
    techStack: project.techStack ?? [],
    priority: (dbToMockPriority[project.priority] ?? project.priority) as
      | "low"
      | "medium"
      | "high"
      | "critical",
    status: (dbToMockStatus[project.status] ?? project.status) as
      | "submitted"
      | "under_review"
      | "accepted"
      | "rejected"
      | "need_clarification"
      | "in_progress"
      | "completed"
      | "cancelled",
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    files: project.files?.map(serializeProjectFile) ?? [],
    seller: {
      companyName: project.seller?.companyName ?? "",
      user: {
        name: project.seller?.user?.name ?? null,
        email: project.seller?.user?.email ?? "",
      },
    },
  };
}

export function serializeQuote(quote: {
  id: string;
  projectId: string;
  amount: string | number;
  currency: string;
  duration: number | null;
  proposal: string | null;
  status: string;
  createdAt: Date;
  project?: { name: string } | null;
  vendor?: {
    user?: {
      name: string | null;
    } | null;
  } | null;
}) {
  return {
    id: quote.id,
    projectId: quote.projectId,
    projectName: quote.project?.name ?? "",
    vendorName: quote.vendor?.user?.name ?? "",
    amount: Number(quote.amount),
    currency: quote.currency,
    duration: quote.duration ?? 0,
    proposal: quote.proposal ?? "",
    status: dbToMockQuoteStatus[quote.status] ?? quote.status,
    submittedAt: quote.createdAt.toISOString(),
    project: quote.project ?? { name: "" },
  };
}

export function serializeProduct(product: {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  longDescription: string | null;
  basePrice: string | number;
  currency: string;
  features: string[] | null;
  useCases: string[] | null;
  clients: string[] | null;
  images: string[] | null;
  icon: string | null;
  iconBg: string | null;
  iconColor: string | null;
  badge: string | null;
  pitchDeckPdf: string | null;
  isActive: boolean;
}) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description ?? "",
    longDescription: product.longDescription ?? "",
    basePrice: Number(product.basePrice),
    currency: product.currency,
    features: product.features ?? [],
    useCases: product.useCases ?? [],
    clients: product.clients ?? [],
    images: product.images ?? [],
    icon: product.icon ?? "Cpu",
    iconBg: product.iconBg ?? "var(--blue-50)",
    iconColor: product.iconColor ?? "var(--blue-600)",
    badge: product.badge ?? "",
    pitchDeckPdf: product.pitchDeckPdf,
    visible: product.isActive,
  };
}
