// Utility functions for date formatting and status mapping

export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ============================================================
// STATUS MAPPING (UI uses lowercase, DB uses uppercase)
// ============================================================

export type ProjectStatusKey =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'need_clarification'
  | 'in_progress'
  | 'completed'
  | 'paid'
  | 'cancelled'

export type PriorityKey = 'low' | 'medium' | 'high' | 'critical'

export const uiToDbStatus: Record<ProjectStatusKey, string> = {
  submitted: 'SUBMITTED',
  under_review: 'UNDER_REVIEW',
  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
  need_clarification: 'NEED_CLARIFICATION',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  paid: 'PAID',
  cancelled: 'CANCELLED',
}

export const dbToUiStatus: Record<string, ProjectStatusKey> = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NEED_CLARIFICATION: 'need_clarification',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
}

export const uiToDbPriority: Record<PriorityKey, string> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
}

export const dbToUiPriority: Record<string, PriorityKey> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

// UI labels
export const projectStatusLabels: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  need_clarification: 'Need Clarification',
  in_progress: 'In Progress',
  completed: 'Completed',
  paid: 'Paid',
  cancelled: 'Cancelled',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  NEED_CLARIFICATION: 'Need Clarification',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
}

export const statusLabels = projectStatusLabels

export const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export const priorityColors: Record<string, string> = {
  low: 'var(--text-muted)',
  medium: 'var(--color-info)',
  high: 'var(--color-warning)',
  critical: 'var(--color-danger)',
  LOW: 'var(--text-muted)',
  MEDIUM: 'var(--color-info)',
  HIGH: 'var(--color-warning)',
  CRITICAL: 'var(--color-danger)',
}
