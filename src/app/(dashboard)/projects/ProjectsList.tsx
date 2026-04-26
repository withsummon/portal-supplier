"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, ChevronRight, Filter } from "lucide-react";
import StatusBadge from "@/components/projects/StatusBadge";
import { formatDate, dbToMockStatus, projectStatusLabels, type MockProjectStatus } from "@/lib/utils/data";

interface Project {
  id: string;
  projectId: string;
  name: string;
  description: string;
  category: string;
  clientName: string | null;
  priority: string;
  status: string;
  budgetRange: string | null;
  createdAt: Date;
}

interface Props {
  projects: Project[];
}

const statusTabs: { label: string; value: "all" | MockProjectStatus }[] = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under_review" },
  { label: "Need Clarification", value: "need_clarification" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const priorityColors: Record<string, string> = {
  low: "var(--text-muted)",
  medium: "var(--color-info)",
  high: "var(--color-warning)",
  critical: "var(--color-danger)",
  LOW: "var(--text-muted)",
  MEDIUM: "var(--color-info)",
  HIGH: "var(--color-warning)",
  CRITICAL: "var(--color-danger)",
};

export default function ProjectsPage({ projects }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | MockProjectStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const dbStatus = dbToMockStatus[p.status] ?? p.status;
    const matchesStatus = activeTab === "all" || dbStatus === activeTab;
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase())) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countByStatus = (status: MockProjectStatus) =>
    projects.filter((p) => dbToMockStatus[p.status] === status).length;

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Projects</h1>
          <p className="page-subtitle">
            {projects.length} project{projects.length !== 1 ? "s" : ""} submitted in total
          </p>
        </div>
        <Link href="/projects/submit">
          <button className="btn btn-primary">
            <Plus size={15} />
            Submit Project
          </button>
        </Link>
      </div>

      {/* Card */}
      <div className="card">
        {/* Tabs + Search */}
        <div
          style={{ padding: "0 var(--sp-6)", borderBottom: "1px solid var(--border-default)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "var(--sp-2)",
            }}
          >
            <div style={{ display: "flex", gap: "0" }}>
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`tab${activeTab === tab.value ? " active" : ""}`}
                >
                  {tab.label}
                  {tab.value !== "all" && (
                    <span
                      style={{
                        marginLeft: "6px",
                        background: activeTab === tab.value ? "var(--blue-100)" : "var(--neutral-200)",
                        color: activeTab === tab.value ? "var(--blue-700)" : "var(--text-muted)",
                        fontSize: "10px",
                        fontWeight: "var(--fw-semibold)",
                        padding: "1px 5px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      {countByStatus(tab.value)}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-3)",
                paddingBottom: "var(--sp-2)",
              }}
            >
              <div className="header-search" style={{ width: "220px" }}>
                <Search size={13} style={{ color: "var(--text-muted)" }} />
                <input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <button className="btn btn-secondary btn-sm">
                <Filter size={13} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={24} />
            </div>
            <h3
              style={{
                fontSize: "var(--fs-md)",
                fontWeight: "var(--fw-semibold)",
                marginBottom: "var(--sp-2)",
              }}
            >
              No projects found
            </h3>
            <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-secondary)" }}>
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => {
                  const mockStatus = dbToMockStatus[project.status] ?? project.status;
                  return (
                    <tr key={project.id}>
                      <td
                        style={{
                          color: "var(--text-muted)",
                          fontFamily: "monospace",
                          fontSize: "var(--fs-xs)",
                        }}
                      >
                        {project.projectId}
                      </td>
                      <td>
                        <div style={{ fontWeight: "var(--fw-semibold)" }}>{project.name}</div>
                        <div
                          style={{
                            fontSize: "var(--fs-xs)",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                          }}
                        >
                          {project.description.slice(0, 60)}...
                        </div>
                      </td>
                      <td
                        style={{
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.clientName ?? "—"}
                      </td>
                      <td
                        style={{
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.category}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--fs-xs)",
                            fontWeight: "var(--fw-semibold)",
                            color: priorityColors[project.priority] ?? "var(--text-muted)",
                            textTransform: "capitalize",
                          }}
                        >
                          ● {project.priority.toLowerCase()}
                        </span>
                      </td>
                      <td
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "var(--fs-xs)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.budgetRange ?? "—"}
                      </td>
                      <td>
                        <StatusBadge status={mockStatus as MockProjectStatus} />
                      </td>
                      <td
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "var(--fs-xs)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(project.createdAt)}
                      </td>
                      <td>
                        <Link href={`/projects/${project.id}`}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: "0 8px" }}>
                            <ChevronRight size={14} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
