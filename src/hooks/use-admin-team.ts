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
    startTransition(() => {
      void createAdminTeamMember(draft).then(({ createdUser, member }) => {
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
    })
  }

  function updateMember(id: string, updates: Partial<AdminTeamMemberDto>) {
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, ...updates } : member)),
    )
    startTransition(() => {
      void updateAdminTeamMember({
        id,
        role: updates.role,
        department: updates.department,
        status: updates.status,
        verified: updates.verified,
      })
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
