'use client'

import { useMemo, useState } from 'react'

export function useAdminDirectory<T extends object>(
  items: T[],
  fields: (keyof T)[],
  statusKey: keyof T,
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        fields.some((field) =>
          String(item[field] ?? '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      const matchesStatus =
        statusFilter === 'all' || String(item[statusKey] ?? '').toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [fields, items, searchQuery, statusFilter, statusKey])

  return {
    filteredItems,
    searchQuery,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
  }
}
