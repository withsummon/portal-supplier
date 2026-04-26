import React from "react";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { projects, quotes, vendors } from "@/db/schema";
import { serializeQuote, serializeVendorProject } from "@/lib/serializers";

export const getCachedVendorProfile = React.cache(async (userId: string) => {
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, userId),
    with: { user: true },
  });

  if (!vendor?.user) {
    return null;
  }

  return {
    id: vendor.id,
    companyName: vendor.companyName,
    industry: vendor.industry,
    companySize: vendor.companySize,
    website: vendor.website,
    tier: vendor.tier,
    createdAt: vendor.createdAt.toISOString(),
    updatedAt: vendor.updatedAt.toISOString(),
    user: {
      name: vendor.user.name,
      email: vendor.user.email,
      createdAt: vendor.user.createdAt.toISOString(),
      updatedAt: vendor.user.updatedAt.toISOString(),
    },
  };
});

export const getCachedVendorDashboard = React.cache(async (userId: string) => {
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, userId),
    with: { user: true },
  });

  if (!vendor) {
    return null;
  }

  const [openProjects, allQuotes] = await Promise.all([
    db.query.projects.findMany({
      where: inArray(projects.status, [
        "SUBMITTED",
        "UNDER_REVIEW",
        "ACCEPTED",
        "NEED_CLARIFICATION",
      ]),
      orderBy: [desc(projects.createdAt)],
    }),
    db.query.quotes.findMany({
      where: eq(quotes.vendorId, vendor.id),
      with: {
        project: true,
        vendor: { with: { user: true } },
      },
      orderBy: [desc(quotes.createdAt)],
    }),
  ]);

  return {
    projects: openProjects.map(serializeVendorProject),
    quotes: allQuotes.map(serializeQuote),
    vendor: {
      id: vendor.id,
      companyName: vendor.companyName,
      user: vendor.user
        ? {
            name: vendor.user.name,
            email: vendor.user.email,
          }
        : null,
      joinedAt: vendor.createdAt.toISOString(),
    },
  };
});

export const getCachedVendorProjectsMarketplace = React.cache(async () => {
  const allProjects = await db.query.projects.findMany({
    orderBy: [desc(projects.createdAt)],
  });

  return allProjects.map(serializeVendorProject);
});

export const getCachedVendorProjectDetail = React.cache(async (projectId: string) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      files: true,
      seller: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return serializeVendorProject(project);
});

export const getCachedVendorQuotes = React.cache(async (userId: string) => {
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, userId),
  });

  if (!vendor) {
    return [];
  }

  const allQuotes = await db.query.quotes.findMany({
    where: eq(quotes.vendorId, vendor.id),
    with: { project: true, vendor: { with: { user: true } } },
    orderBy: [desc(quotes.createdAt)],
  });

  return allQuotes.map(serializeQuote);
});
