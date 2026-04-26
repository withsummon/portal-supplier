'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  createSellerTeamMember,
  deleteSellerTeamMember,
  updateSellerTeamMember,
} from '@/lib/actions/teams'
import type { SellerTeamMemberDto } from '@/lib/data/teams'

export function useSellerTeam(initialMembers: SellerTeamMemberDto[]) {
  const [members, setMembers] = useState(initialMembers)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Developer',
  })
  const [isPending, startTransition] = useTransition()

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return members

    return members.filter((member) =>
      [member.name, member.email, member.role, member.phone]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [members, searchQuery])

  function submitNewMember() {
    startTransition(() => {
      void createSellerTeamMember(draft).then((member) => {
        if (!member) {
          return
        }

        setMembers((current) => [
          {
            id: member.id,
            name: member.name,
            email: member.email,
            phone: member.phone ?? '',
            role: member.role,
            status: member.status,
            joinedAt: member.createdAt.toISOString(),
          },
          ...current,
        ])
        setDraft({ name: '', email: '', phone: '', role: 'Developer' })
        setShowAddModal(false)
      })
    })
  }

  function changeRole(id: string, role: string) {
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, role } : member)),
    )
    startTransition(() => {
      void updateSellerTeamMember({ id, role })
    })
  }

  function removeMember(id: string) {
    setMembers((current) => current.filter((member) => member.id !== id))
    startTransition(() => {
      void deleteSellerTeamMember(id)
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
    changeRole,
    removeMember,
  }
}
