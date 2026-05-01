'use client'

import { useMemo, useState, useTransition } from 'react'
import { reviewProjectSubmission, updateProjectStatus, markProjectPaid, updateQuoteStatus } from '@/lib/actions/projects'
import type { AdminProjectDto, ProjectReviewNoteDto } from '@/lib/data/project-workflows'

type ActionType = 'accept' | 'reject' | 'clarify' | 'start' | 'complete' | 'lunas' | 'acceptQuote' | 'rejectQuote'

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
    action: ActionType
    quoteId?: string
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

  function queueAction(projectId: string, action: ActionType, quoteId?: string) {
    setActionModal(quoteId !== undefined ? { projectId, action, quoteId } : { projectId, action })
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

    const requiresNote = actionModal.action !== 'accept' && actionModal.action !== 'start'
    if (requiresNote && !actionNote.trim()) {
      return
    }

    startTransition(() => {
      void (async () => {
        const { projectId, action, quoteId } = actionModal

        if (action === 'acceptQuote' && quoteId) {
          const result = await updateQuoteStatus(quoteId, 'ACCEPTED')
          setProjects((current) =>
            current.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    quotes: project.quotes.map((q) =>
                      q.id === quoteId ? { ...q, status: 'accepted' as const } : q,
                    ),
                  }
                : project,
            ),
          )
        } else if (action === 'rejectQuote' && quoteId) {
          const result = await updateQuoteStatus(quoteId, 'REJECTED')
          setProjects((current) =>
            current.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    quotes: project.quotes.map((q) =>
                      q.id === quoteId ? { ...q, status: 'rejected' as const } : q,
                    ),
                  }
                : project,
            ),
          )
        } else if (action === 'start') {
          const result = await updateProjectStatus(projectId, 'IN_PROGRESS', actionNote || undefined)
          setProjects((current) =>
            current.map((project) =>
              project.id === projectId
                ? { ...project, status: result.status as AdminProjectDto['status'] }
                : project,
            ),
          )
        } else if (action === 'complete') {
          const result = await updateProjectStatus(projectId, 'COMPLETED', actionNote || undefined)
          setProjects((current) =>
            current.map((project) =>
              project.id === projectId
                ? { ...project, status: result.status as AdminProjectDto['status'] }
                : project,
            ),
          )
        } else if (action === 'lunas') {
          const result = await markProjectPaid(projectId)
          setProjects((current) =>
            current.map((project) =>
              project.id === projectId
                ? { ...project, status: result.status as AdminProjectDto['status'] }
                : project,
            ),
          )
        } else {
          const result = await reviewProjectSubmission({
            projectId,
            action: action as 'accept' | 'reject' | 'clarify',
            note: actionNote,
          })
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
        }

        setActionModal(null)
        setActionNote('')
        setSelectedProjectId(null)
      })()
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
