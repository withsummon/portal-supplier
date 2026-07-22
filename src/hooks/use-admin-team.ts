'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  createAdminTeamMember,
  deleteAdminTeamMember,
  updateAdminTeamMember,
} from '@/lib/actions/teams'
import type { AdminTeamMemberDto } from '@/lib/data/teams'

export function useAdminTeam(initialMembers: AdminTeamMemberDto[]) {
  const [members, setMembers] = useState(initialMembers)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    department: 'Operations',
    role: 'Support Staff',
  })
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return members

    return members.filter((member) =>
      [member.name, member.email, member.role, member.department]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [members, searchQuery])

  function submitNewMember() {
    if (!draft.name.trim()) return setError('Full name is required.')
    if (!draft.email.trim() || !draft.email.includes('@'))
      return setError('Valid email is required.')

    setError('')
    startTransition(() => {
      void createAdminTeamMember(draft)
        .then(({ createdUser, member }) => {
          if (!createdUser || !member) {
            return
          }

          setMembers((current) => [
            {
              id: member.id,
              userId: createdUser.id,
              name: createdUser.name ?? '',
              email: createdUser.email,
              role: member.role,
              department: member.department,
              status: member.status,
              verified: member.verified,
              joinedAt: member.createdAt.toISOString(),
            },
            ...current,
          ])
          setDraft({
            name: '',
            email: '',
            department: 'Operations',
            role: 'Support Staff',
          })
          setShowAddModal(false)
        })
        .catch((submitError: unknown) =>
          setError(submitError instanceof Error ? submitError.message : 'Failed to add member.'),
        )
    })
  }

  function updateMember(id: string, updates: Partial<AdminTeamMemberDto>) {
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, ...updates } : member)),
    )
    startTransition(() => {
      const payload: Parameters<typeof updateAdminTeamMember>[0] = { id }

      if (updates.role !== undefined) payload.role = updates.role
      if (updates.department !== undefined) payload.department = updates.department
      if (updates.status !== undefined) payload.status = updates.status
      if (updates.verified !== undefined) payload.verified = updates.verified

      void updateAdminTeamMember(payload)
    })
  }

  function removeMember(id: string) {
    setMembers((current) => current.filter((member) => member.id !== id))
    startTransition(() => {
      void deleteAdminTeamMember(id)
    })
  }

  return {
    draft,
    error,
    filteredMembers,
    isPending,
    members,
    searchQuery,
    setDraft,
    setSearchQuery,
    setShowAddModal,
    showAddModal,
    submitNewMember,
    updateMember,
    removeMember,
  }
}
