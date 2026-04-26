"use server";

import { db } from "@/db";
import {
  projects,
  statusHistory,
  notes,
  quotes,
  comments,
  categories,
  sellers,
} from "@/db/schema";
import { eq, desc, and, like, or, count, sql } from "drizzle-orm";

// ============================================================
// PROJECT STATUS LABELS
// ============================================================

export const projectStatusLabels: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  NEED_CLARIFICATION: "Need Clarification",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const quoteStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

// ============================================================
// PROJECT ACTIONS
// ============================================================

export async function getProjects(filters?: {
  status?: string;
  search?: string;
  sellerId?: string;
}) {
  const conditions = [];

  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(projects.status, filters.status as typeof projects.$inferSelect.status));
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(projects.name, `%${filters.search}%`),
        like(projects.description, `%${filters.search}%`)
      )
    );
  }

  if (filters?.sellerId) {
    conditions.push(eq(projects.sellerId, filters.sellerId));
  }

  const result = await db.query.projects.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      seller: true,
      files: true,
      statusHistory: {
        orderBy: [desc(statusHistory.createdAt)],
      },
    },
    orderBy: [desc(projects.createdAt)],
  });

  return result;
}

export async function getProjectById(id: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      seller: {
        with: { user: true },
      },
      files: true,
      statusHistory: {
        orderBy: [desc(statusHistory.createdAt)],
      },
      notes: {
        orderBy: [desc(notes.createdAt)],
      },
      quotes: {
        with: { vendor: { with: { user: true } } },
      },
      comments: {
        with: { author: true },
        orderBy: [desc(comments.createdAt)],
      },
    },
  });

  return project;
}

export async function getProjectByProjectId(projectId: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.projectId, projectId),
    with: {
      seller: {
        with: { user: true },
      },
      files: true,
      statusHistory: {
        orderBy: [desc(statusHistory.createdAt)],
      },
      quotes: {
        with: { vendor: { with: { user: true } } },
      },
    },
  });

  return project;
}

export async function createProject(data: {
  name: string;
  description: string;
  requirements?: string;
  category: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency?: string;
  budgetRange?: string;
  startDate?: Date;
  endDate?: Date;
  sellerId: string;
}) {
  const countResult = await db
    .select({ count: count() })
    .from(projects);
  const nextNumber = (countResult[0]?.count ?? 0) + 1;
  const projectId = `PRJ-${String(nextNumber).padStart(3, "0")}`;

  const [project] = await db
    .insert(projects)
    .values({
      ...data,
      budgetMin: data.budgetMin?.toString(),
      budgetMax: data.budgetMax?.toString(),
      projectId,
      status: "SUBMITTED",
    })
    .returning();

  if (!project) {
    throw new Error("Failed to create project");
  }

  await db.insert(statusHistory).values({
    projectId: project.id,
    status: "SUBMITTED",
    note: "Project submitted successfully.",
    changedBy: data.sellerId,
  });

  return project;
}

export async function updateProjectStatus(
  projectId: string,
  status: typeof projects.$inferSelect.status,
  note?: string,
  changedBy?: string
) {
  const [updated] = await db
    .update(projects)
    .set({ status })
    .where(eq(projects.id, projectId))
    .returning();

  await db.insert(statusHistory).values({
    projectId,
    status,
    note,
    changedBy: changedBy ?? "system",
  });

  return updated;
}

export async function getProjectStats(sellerId?: string) {
  const conditions = sellerId ? eq(projects.sellerId, sellerId) : undefined;

  const all = await db.query.projects.findMany({
    where: conditions,
    columns: { status: true },
  });

  const stats = {
    total: all.length,
    submitted: all.filter((p) => p.status === "SUBMITTED").length,
    underReview: all.filter((p) => p.status === "UNDER_REVIEW").length,
    accepted: all.filter((p) => p.status === "ACCEPTED").length,
    inProgress: all.filter((p) => p.status === "IN_PROGRESS").length,
    completed: all.filter((p) => p.status === "COMPLETED").length,
    rejected: all.filter((p) => p.status === "REJECTED").length,
  };

  return stats;
}

// ============================================================
// QUOTE ACTIONS
// ============================================================

export async function getQuotes(vendorId?: string, projectId?: string) {
  const conditions = [];

  if (vendorId) {
    conditions.push(eq(quotes.vendorId, vendorId));
  }

  if (projectId) {
    conditions.push(eq(quotes.projectId, projectId));
  }

  return db.query.quotes.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      project: {
        with: { seller: { with: { user: true } } },
      },
      vendor: { with: { user: true } },
    },
    orderBy: [desc(quotes.createdAt)],
  });
}

export async function submitQuote(data: {
  projectId: string;
  vendorId: string;
  amount: number;
  currency?: string;
  duration?: number;
  proposal?: string;
}) {
  const [quote] = await db
    .insert(quotes)
    .values({
      ...data,
      amount: data.amount.toString(),
    })
    .returning();
  return quote;
}

export async function updateQuoteStatus(
  quoteId: string,
  status: typeof quotes.$inferSelect.status
) {
  const [updated] = await db
    .update(quotes)
    .set({ status })
    .where(eq(quotes.id, quoteId))
    .returning();

  return updated;
}

// ============================================================
// CATEGORY ACTIONS
// ============================================================

export async function getCategories() {
  return db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  });
}

export async function getOrCreateCategory(name: string, type: "PROJECT" | "PRODUCT") {
  const existing = await db.query.categories.findFirst({
    where: and(eq(categories.name, name), eq(categories.type, type)),
  });

  if (existing) return existing;

  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const [created] = await db
    .insert(categories)
    .values({ name, slug, type })
    .returning();

  return created;
}

// ============================================================
// INSIGHTS / ANALYTICS
// ============================================================

export async function getMonthlySubmissions(sellerId?: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const conditions = [sql`${projects.createdAt} >= ${sixMonthsAgo}`];
  if (sellerId) conditions.push(sql`${projects.sellerId} = ${sellerId}`);

  const projectList = await db.query.projects.findMany({
    where: and(...conditions),
    columns: {
      createdAt: true,
      status: true,
      budgetMin: true,
      budgetMax: true,
    },
  });

  // Group by month
  const monthlyMap: Record<string, { submissions: number; revenue: number }> = {};
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short" });
    monthlyMap[key] = { submissions: 0, revenue: 0 };
  }

  for (const p of projectList) {
    const key = p.createdAt.toLocaleString("en-US", { month: "short" });
    if (monthlyMap[key]) {
      monthlyMap[key].submissions++;
      if (p.status === "ACCEPTED" || p.status === "COMPLETED") {
        const revenue = p.budgetMax ?? p.budgetMin ?? 0;
        monthlyMap[key].revenue += Number(revenue);
      }
    }
  }

  return Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    ...data,
  }));
}

export async function getCategoryBreakdown(sellerId?: string) {
  const conditions = sellerId ? eq(projects.sellerId, sellerId) : undefined;

  const projectList = await db.query.projects.findMany({
    where: conditions,
    columns: { category: true, budgetMin: true, budgetMax: true },
  });

  const categoryMap: Record<string, { count: number; revenue: number }> = {};

  for (const p of projectList) {
    const entry = categoryMap[p.category] ?? { count: 0, revenue: 0 };
    entry.count++;
    entry.revenue += Number(p.budgetMax ?? p.budgetMin ?? 0);
    categoryMap[p.category] = entry;
  }

  const total = Object.values(categoryMap).reduce(
    (sum, c) => sum + c.revenue,
    0
  );

  return Object.entries(categoryMap).map(([category, data], i) => ({
    category,
    ...data,
    percent: total > 0 ? Math.round((data.revenue / total) * 1000) / 10 : 0,
  }));
}

export async function getRevenuePipeline(sellerId?: string) {
  const conditions = sellerId ? eq(projects.sellerId, sellerId) : undefined;

  const projectList = await db.query.projects.findMany({
    where: conditions,
    columns: {
      status: true,
      budgetMin: true,
      budgetMax: true,
    },
  });

  const revenueMap: Record<string, number> = {};
  for (const p of projectList) {
    const val = Number(p.budgetMax ?? p.budgetMin ?? 0);
    if (p.status === "ACCEPTED" || p.status === "IN_PROGRESS") {
      revenueMap[p.status] = (revenueMap[p.status] ?? 0) + val;
    }
  }

  return {
    accepted: {
      label: "Accepted",
      value: revenueMap["ACCEPTED"] ?? 0,
      color: "var(--color-success)",
    },
    inProgress: {
      label: "In Progress",
      value: revenueMap["IN_PROGRESS"] ?? 0,
      color: "var(--blue-500)",
    },
    total: (revenueMap["ACCEPTED"] ?? 0) + (revenueMap["IN_PROGRESS"] ?? 0),
  };
}
