import { type Page, type Locator, type FrameLocator } from '@playwright/test'

// Centralized CSS selectors for all pages
export const S = {
  // Auth pages
  login: {
    email: 'input[name="email"]',
    password: 'input[name="password"]',
    submit: 'button[type="submit"]',
    roleButton: (role: string) => `button:has-text("${role}")`,
    error: '[class*="danger"], [class*="error"], [role="alert"]',
  },

  register: {
    firstName: 'input[name="firstName"]',
    lastName: 'input[name="lastName"]',
    email: 'input[name="email"]',
    password: 'input[name="password"]',
    confirmPassword: 'input[name="confirmPassword"]',
    companyName: 'input[name="companyName"]',
    industry: 'select[name="industry"]',
    companySize: 'select[name="companySize"]',
    termsCheckbox: 'input[type="checkbox"]',
    submit: 'button[type="submit"]',
    error: '[class*="danger"], [class*="error"]',
  },

  pendingApproval: {
    heading: 'h1:has-text("Pending")',
  },

  // Seller pages
  seller: {
    sidebar: {
      projects: 'a[href="/projects"], a[href="/dashboard/projects"]',
      newProject: 'a[href="/projects/submit"], button:has-text("New Project")',
    },
    projects: {
      list: '[class*="table"], [class*="project-list"]',
      submitButton: 'button:has-text("Submit Project")',
    },
    projectDetail: {
      statusBadge: '[class*="badge"], [class*="status"]',
      backButton: 'a:has-text("Back"), button:has-text("Back")',
    },
  },

  // Admin pages
  admin: {
    sidebar: {
      projects: 'a[href*="/admin/projects"]',
      sellers: 'a[href*="/admin/sellers"]',
      vendors: 'a[href*="/admin/vendors"]',
      team: 'a[href*="/admin/team"]',
      suppliers: 'a[href*="/admin/suppliers"]',
    },
    projects: {
      list: '[class*="table"], [class*="project-list"]',
      acceptButton: 'button:has-text("Accept"), button:has-text("approve")',
      rejectButton: 'button:has-text("Reject"), button:has-text("reject")',
      clarifyButton: 'button:has-text("Clarification"), button:has-text("clarify")',
      startButton: 'button:has-text("Start Project"), button:has-text("start")',
      completeButton: 'button:has-text("Mark Complete"), button:has-text("complete")',
      lunasButton: 'button:has-text("Mark Lunas"), button:has-text("Mark Paid"), button:has-text("Lunas")',
      acceptQuote: 'button:has-text("Accept Quote")',
      rejectQuote: 'button:has-text("Reject Quote")',
      newProject: 'a[href*="/admin/projects/new"], button:has-text("New Project")',
    },
    sellers: {
      list: '[class*="table"]',
      approveButton: 'button:has-text("Approve")',
      rejectButton: 'button:has-text("Reject")',
    },
    vendors: {
      list: '[class*="table"]',
      approveButton: 'button:has-text("Approve")',
      rejectButton: 'button:has-text("Reject")',
    },
  },

  // Vendor pages
  vendor: {
    sidebar: {
      projects: 'a[href*="/vendor/projects"]',
      quotes: 'a[href*="/vendor/quotes"]',
    },
    marketplace: {
      projectCard: '[class*="card"], [class*="project"]',
      submitQuote: 'button:has-text("Submit Quote")',
    },
    quoteForm: {
      amount: 'input[type="number"]',
      duration: 'input[type="number"]:near(:text("days"))',
      proposal: 'textarea',
      submit: 'button:has-text("Submit"), button:has-text("Send")',
    },
  },

  // Common
  common: {
    toast: '[class*="toast"], [role="status"], [role="alert"]',
    loading: '[class*="spinner"], [class*="loading"]',
    modal: '[role="dialog"], [class*="modal"]',
    modalClose: '[class*="modal"] button:has-text("Close"), [class*="modal"] button:has-text("Cancel")',
    confirmation: 'button:has-text("Confirm"), button:has-text("Yes")',
  },
} as const

// Helper functions for selectors
export function projectStatusSelector(status: string): string {
  return `button:has-text("${status}"), [class*="badge"]:has-text("${status}"), [class*="status"]:has-text("${status}")`
}
