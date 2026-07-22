'use client'

import { useMemo, useState, useTransition } from 'react'
import { deleteProduct, toggleProductVisibility } from '@/lib/actions/products'

export interface ProductFormState {
  id?: string
  slug: string
  name: string
  kind: string
  category: string
  description: string
  longDescription: string
  basePrice: number
  currency: string
  features: string[]
  useCases: string[]
  clients: string[]
  icon: string
  iconBg: string
  iconColor: string
  badge: string
  visible: boolean
  images: string[]
  pitchDeckPdf: string | null
}

export function useAdminProducts(initialProducts: ProductFormState[]) {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isPending, startTransition] = useTransition()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.kind === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, products, searchQuery])

  function removeProduct(id: string) {
    setProducts((current) => current.filter((product) => product.id !== id))
    startTransition(() => {
      void deleteProduct(id)
    })
  }

  function setVisibility(id: string, visible: boolean) {
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, visible } : product)),
    )
    startTransition(() => {
      void toggleProductVisibility(id, visible)
    })
  }

  return {
    categoryFilter,
    filteredProducts,
    isPending,
    products,
    removeProduct,
    searchQuery,
    setCategoryFilter,
    setSearchQuery,
    setVisibility,
  }
}
