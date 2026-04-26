// Utility functions for date formatting and status mapping

export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================
// STATUS MAPPING (mock data uses lowercase, DB uses uppercase)
// ============================================================

export type MockProjectStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "need_clarification"
  | "in_progress"
  | "completed"
  | "cancelled";

export type MockQuoteStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type MockPriority = "low" | "medium" | "high" | "critical";

export const mockToDbStatus: Record<MockProjectStatus, string> = {
  submitted: "SUBMITTED",
  under_review: "UNDER_REVIEW",
  accepted: "ACCEPTED",
  rejected: "REJECTED",
  need_clarification: "NEED_CLARIFICATION",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

export const dbToMockStatus: Record<string, MockProjectStatus> = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  NEED_CLARIFICATION: "need_clarification",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const mockToDbQuoteStatus: Record<MockQuoteStatus, string> = {
  pending: "PENDING",
  accepted: "ACCEPTED",
  rejected: "REJECTED",
  withdrawn: "WITHDRAWN",
};

export const dbToMockQuoteStatus: Record<string, MockQuoteStatus> = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

export const mockToDbPriority: Record<MockPriority, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  critical: "CRITICAL",
};

export const dbToMockPriority: Record<string, MockPriority> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

// UI labels
export const projectStatusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  need_clarification: "Need Clarification",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  NEED_CLARIFICATION: "Need Clarification",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const statusLabels = projectStatusLabels;

export const quoteStatusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const priorityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const priorityColors: Record<string, string> = {
  low: "var(--text-muted)",
  medium: "var(--color-info)",
  high: "var(--color-warning)",
  critical: "var(--color-danger)",
  LOW: "var(--text-muted)",
  MEDIUM: "var(--color-info)",
  HIGH: "var(--color-warning)",
  CRITICAL: "var(--color-danger)",
};
