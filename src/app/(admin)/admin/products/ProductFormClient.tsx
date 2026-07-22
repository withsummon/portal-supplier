'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { FACTORY_CATEGORIES, FACTORY_KINDS } from '@/lib/factory-catalog-options'
import { PRODUCT_ICON_OPTIONS } from '@/lib/product-icons'
import type { ProductFormState } from '@/hooks/use-admin-products'
import ProductFormField from './ProductFormField'
import ProductMediaFields from './ProductMediaFields'
import ProductFormSection from './ProductFormSection'
import ProductTextListEditor from './ProductTextListEditor'
import ProductVisualStylePicker from './ProductVisualStylePicker'

const emptyForm: ProductFormState = {
  slug: '',
  name: '',
  kind: 'PRODUCT',
  category: 'conversational-ai',
  description: '',
  longDescription: '',
  basePrice: 0,
  currency: 'IDR',
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

export default function ProductFormClient({
  initialProduct,
}: {
  initialProduct?: ProductFormState
}) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormState>(initialProduct ?? emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null)
  const [replacePitchDeck, setReplacePitchDeck] = useState(false)
  const [isPending, startTransition] = useTransition()

  function saveProduct() {
    const cleanData = {
      ...formData,
      kind: formData.kind === 'PORTFOLIO' ? 'PORTFOLIO' : 'PRODUCT',
      currency: 'IDR',
      features: formData.features.filter((item) => item.trim()),
      useCases: formData.useCases.filter((item) => item.trim()),
      clients: formData.clients.filter((item) => item.trim()),
    }

    startTransition(() => {
      const action = formData.id
        ? updateProduct({
            id: formData.id,
            ...cleanData,
            existingImages: formData.images,
            imageFiles,
            replacePitchDeck,
            pitchDeckPdf: pitchDeckFile,
          })
        : createProduct({
            ...cleanData,
            imageFiles,
            pitchDeckPdf: pitchDeckFile,
          })

      void action.then((product) => {
        if (product?.slug) {
          router.push(`/admin/products/${product.slug}`)
        }
      })
    })
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <Link
            href="/admin/products"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 12 }}
          >
            <ArrowLeft size={14} />
            Back to Catalog
          </Link>
          <h1 className="page-title">{formData.id ? 'Edit Factory Item' : 'Add Factory Item'}</h1>
          <p className="page-subtitle">Create and maintain Summon products and portfolio items.</p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          disabled={isPending}
          onClick={saveProduct}
        >
          <Save size={15} />
          {isPending ? 'Saving...' : 'Save Item'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
        <ProductFormSection title="Basic Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <ProductFormField label="Item Name">
              <input
                className="input"
                placeholder="Summon Analytics Copilot"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, name: event.target.value }))
                }
              />
            </ProductFormField>
            <ProductFormField label="Type">
              <select
                className="select"
                value={formData.kind}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, kind: event.target.value }))
                }
              >
                {FACTORY_KINDS.filter((kind) => kind.id !== 'all').map((kind) => (
                  <option key={kind.id} value={kind.id}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductFormField label="Category">
              <select
                className="select"
                value={formData.category}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, category: event.target.value }))
                }
              >
                {FACTORY_CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductFormField label="Short Description">
              <input
                className="input"
                placeholder="One-line summary for catalog cards"
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, description: event.target.value }))
                }
              />
            </ProductFormField>
            <ProductFormField label="Long Description" style={{ gridColumn: 'span 2' }}>
              <textarea
                className="input input-textarea"
                rows={5}
                placeholder="Describe the product or portfolio project in detail"
                value={formData.longDescription}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, longDescription: event.target.value }))
                }
              />
            </ProductFormField>
          </div>
        </ProductFormSection>

        <ProductFormSection title="Catalog Presentation">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <ProductFormField label="Badge">
              <input
                className="input"
                placeholder="Popular, New, Enterprise"
                value={formData.badge}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, badge: event.target.value }))
                }
              />
            </ProductFormField>
            <ProductFormField label="Icon">
              <select
                className="select"
                value={formData.icon}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, icon: event.target.value }))
                }
              >
                {PRODUCT_ICON_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductVisualStylePicker
              iconBg={formData.iconBg}
              iconColor={formData.iconColor}
              onChange={(style) => setFormData((current) => ({ ...current, ...style }))}
            />
            <label
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: 'var(--sp-2)',
                paddingTop: '24px',
              }}
            >
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, visible: event.target.checked }))
                }
              />
              Visible in factory
            </label>
          </div>
        </ProductFormSection>

        <ProductFormSection title="Selling Details">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--sp-4)',
            }}
          >
            <ProductTextListEditor
              label="Features"
              items={formData.features}
              onChange={(features) => setFormData((current) => ({ ...current, features }))}
            />
            <ProductTextListEditor
              label="Use Cases"
              items={formData.useCases}
              onChange={(useCases) => setFormData((current) => ({ ...current, useCases }))}
            />
            <ProductTextListEditor
              label="Clients"
              items={formData.clients}
              onChange={(clients) => setFormData((current) => ({ ...current, clients }))}
            />
          </div>
        </ProductFormSection>

        <ProductFormSection title="Media & Documents">
          <ProductMediaFields
            formData={formData}
            replacePitchDeck={replacePitchDeck}
            setFormData={setFormData}
            setImageFiles={setImageFiles}
            setPitchDeckFile={setPitchDeckFile}
            setReplacePitchDeck={setReplacePitchDeck}
          />
        </ProductFormSection>
      </div>
    </div>
  )
}
