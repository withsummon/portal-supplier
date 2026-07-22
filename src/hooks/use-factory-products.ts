'use client'

import { useMemo, useState } from 'react'

interface FactoryProduct {
  id: string
  slug: string
  name: string
  kind: string
  category: string
  description: string
  longDescription: string
  features: string[]
  useCases: string[]
  clients: string[]
  images: string[]
  icon: string
  iconBg: string
  iconColor: string
  badge: string
  pitchDeckPdf: string | null
  visible: boolean
}

export function useFactoryProducts(initialProducts: FactoryProduct[]) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.kind === activeCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, initialProducts, searchQuery])

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All', count: initialProducts.length },
      {
        id: 'PRODUCT',
        label: 'Produk',
        count: initialProducts.filter((product) => product.kind !== 'PORTFOLIO').length,
      },
      {
        id: 'PORTFOLIO',
        label: 'Portofolio',
        count: initialProducts.filter((product) => product.kind === 'PORTFOLIO').length,
      },
    ]
  }, [initialProducts])

  return {
    activeCategory,
    categories,
    filteredProducts,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
  }
}
