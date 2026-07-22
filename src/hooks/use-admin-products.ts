'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  createProduct,
  deleteProduct,
  toggleProductVisibility,
  updateProduct,
} from '@/lib/actions/products'

export interface ProductFormState {
  id?: string
  name: string
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
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductFormState | null>(null)
  const [isPending, startTransition] = useTransition()

  const emptyForm = {
    name: '',
    category: 'conversational-ai',
    description: '',
    longDescription: '',
    basePrice: 0,
    currency: 'USD',
    features: [''],
    useCases: [''],
    clients: [''],
    icon: 'Cpu',
    iconBg: 'var(--blue-50)',
    iconColor: 'var(--blue-600)',
    badge: '',
    visible: true,
    images: [],
    pitchDeckPdf: null,
  }

  const [formData, setFormData] = useState<ProductFormState>(emptyForm)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null)
  const [replacePitchDeck, setReplacePitchDeck] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, products, searchQuery])

  function openModal(product?: ProductFormState) {
    if (product) {
      setEditingProduct(product)
      setFormData({
        ...product,
        features: product.features.length ? [...product.features] : [''],
        useCases: product.useCases.length ? [...product.useCases] : [''],
        clients: product.clients.length ? [...product.clients] : [''],
      })
    } else {
      setEditingProduct(null)
      setFormData(emptyForm)
    }
    setNewImageFiles([])
    setPitchDeckFile(null)
    setReplacePitchDeck(false)
    setShowModal(true)
  }

  function saveProduct() {
    const cleanData = {
      ...formData,
      features: formData.features.filter((item) => item.trim()),
      useCases: formData.useCases.filter((item) => item.trim()),
      clients: formData.clients.filter((item) => item.trim()),
    }

    const productToEdit = editingProduct?.id ? { ...editingProduct, id: editingProduct.id } : null
    if (editingProduct && !productToEdit) {
      return
    }

    startTransition(() => {
      const action = productToEdit
        ? updateProduct({
            id: productToEdit.id,
            ...cleanData,
            existingImages: productToEdit.images.filter((image) =>
              cleanData.images.includes(image),
            ),
            imageFiles: newImageFiles,
            replacePitchDeck,
            pitchDeckPdf: pitchDeckFile,
          })
        : createProduct({
            ...cleanData,
            imageFiles: newImageFiles,
            pitchDeckPdf: pitchDeckFile,
          })

      void action.then((product) => {
        if (!product) return

        const normalizedProduct: ProductFormState = {
          id: product.id,
          name: product.name,
          category: product.category,
          description: product.description ?? '',
          longDescription: product.longDescription ?? '',
          basePrice: Number(product.basePrice),
          currency: product.currency,
          features: product.features ?? [],
          useCases: product.useCases ?? [],
          clients: product.clients ?? [],
          icon: product.icon ?? 'Cpu',
          iconBg: product.iconBg ?? 'var(--blue-50)',
          iconColor: product.iconColor ?? 'var(--blue-600)',
          badge: product.badge ?? '',
          visible: product.isActive,
          images: product.images ?? [],
          pitchDeckPdf: product.pitchDeckPdf,
        }

        setProducts((current) =>
          productToEdit
            ? current.map((item) => (item.id === productToEdit.id ? normalizedProduct : item))
            : [normalizedProduct, ...current],
        )
        setShowModal(false)
      })
    })
  }

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
    editingProduct,
    filteredProducts,
    formData,
    isPending,
    newImageFiles,
    openModal,
    pitchDeckFile,
    products,
    removeProduct,
    replacePitchDeck,
    saveProduct,
    searchQuery,
    setCategoryFilter,
    setFormData,
    setNewImageFiles,
    setPitchDeckFile,
    setReplacePitchDeck,
    setSearchQuery,
    setShowModal,
    setVisibility,
    showModal,
  }
}
