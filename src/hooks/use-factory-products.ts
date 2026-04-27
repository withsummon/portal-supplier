'use client'

import { useMemo, useState } from 'react'

interface FactoryProduct {
  id: string
  slug: string
  name: string
  category: string
  description: string
  longDescription: string
  basePrice: number
  currency: string
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
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, initialProducts, searchQuery])

  const categories = useMemo(() => {
    const productCategories = Array.from(
      new Set(initialProducts.map((product) => product.category)),
    )
    return [
      { id: 'all', label: 'All Products', count: initialProducts.length },
      ...productCategories.map((category) => ({
        id: category,
        label: category,
        count: initialProducts.filter((product) => product.category === category).length,
      })),
    ]
  }, [initialProducts])

  const selectedProduct =
    initialProducts.find((product) => product.id === selectedProductId) ?? null

  return {
    activeCategory,
    categories,
    currentImageIndex,
    filteredProducts,
    searchQuery,
    selectedProduct,
    setActiveCategory,
    setCurrentImageIndex,
    setSearchQuery,
    setSelectedProductId,
  }
}
