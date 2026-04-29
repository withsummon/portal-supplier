'use client'

import { useMemo, useState, useTransition } from 'react'
import { reviewProjectSubmission } from '@/lib/actions/projects'
import type { AdminProjectDto, ProjectReviewNoteDto } from '@/lib/data/project-workflows'

export function useAdminProjects(
  initialProjects: AdminProjectDto[],
  initialHighlight?: string,
  initialStatus?: string,
) {
  const [projects, setProjects] = useState(initialProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus ?? 'all')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialHighlight ?? null,
  )
  const [actionModal, setActionModal] = useState<{
    projectId: string
    action: 'accept' | 'reject' | 'clarify'
  } | null>(null)
  const [actionNote, setActionNote] = useState('')
  const [isPending, startTransition] = useTransition()

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedQuery ||
        [project.name, project.supplier, project.supplierEmail, project.projectId]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [projects, searchQuery, statusFilter])

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null

  function openProject(projectId: string) {
    setSelectedProjectId(projectId)
  }

  function closeProject() {
    setSelectedProjectId(null)
  }

  function queueAction(projectId: string, action: 'accept' | 'reject' | 'clarify') {
    setActionModal({ projectId, action })
    setActionNote('')
  }

  function closeActionModal() {
    setActionModal(null)
    setActionNote('')
  }

  function submitAction() {
    if (!actionModal) {
      return
    }

    const requiresNote = actionModal.action !== 'accept'
    if (requiresNote && !actionNote.trim()) {
      return
    }

    startTransition(() => {
      void reviewProjectSubmission({
        projectId: actionModal.projectId,
        action: actionModal.action,
        note: actionNote,
      }).then((result) => {
        setProjects((current) =>
          current.map((project) =>
            project.id === result.id
              ? {
                  ...project,
                  status: result.status as AdminProjectDto['status'],
                  notes: [result.note as ProjectReviewNoteDto, ...project.notes],
                }
              : project,
          ),
        )
        setActionModal(null)
        setActionNote('')
        setSelectedProjectId(null)
      })
    })
  }

  return {
    actionModal,
    actionNote,
    closeActionModal,
    closeProject,
    filteredProjects,
    isPending,
    openProject,
    projects,
    queueAction,
    searchQuery,
    selectedProject,
    setActionNote,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    submitAction,
  }
}
