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
import ProductFactoryPreview from './ProductFactoryPreview'
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()

  function updateField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setErrors((current) => ({ ...current, [key]: '' }))
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function saveProduct() {
    const nextErrors = {
      name: formData.name.trim() ? '' : 'Item name is required.',
      description: formData.description.trim() ? '' : 'Short description is required.',
      longDescription: formData.longDescription.trim() ? '' : 'Long description is required.',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setFormError('')
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

      void action
        .then((product) => {
          if (product?.slug) {
            router.push(`/admin/products/${product.slug}`)
          }
        })
        .catch((error: unknown) =>
          setFormError(error instanceof Error ? error.message : 'Failed to save item.'),
        )
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

      {formError && (
        <div
          className="card"
          style={{
            borderColor: 'var(--color-danger)',
            color: 'var(--color-danger)',
            marginBottom: 'var(--sp-5)',
            padding: 'var(--sp-4)',
          }}
        >
          {formError}
        </div>
      )}

      <div className="form-stack">
        <ProductFormSection
          title="Publishing Preview"
          description="Check what sellers will see before editing supporting details."
        >
          <div className="form-grid-2">
            <label
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: 'var(--sp-2)',
              }}
            >
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(event) => updateField('visible', event.target.checked)}
              />
              Visible in factory
            </label>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
              Hidden items stay in the admin catalog but are not shown to sellers.
            </div>
          </div>
          <div style={{ marginTop: 'var(--sp-5)' }}>
            <div className="form-label">Seller Grid Preview</div>
            <ProductFactoryPreview imageFiles={imageFiles} product={formData} />
          </div>
        </ProductFormSection>

        <ProductFormSection
          title="Catalog Basics"
          description="Name, type, and copy shown in the factory catalog."
        >
          <div className="form-grid-2">
            <ProductFormField label="Item Name" required error={errors.name}>
              <input
                className="input"
                placeholder="Summon Analytics Copilot"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
            </ProductFormField>
            <ProductFormField label="Type" required hint="Use Portofolio only for completed work.">
              <select
                className="select"
                value={formData.kind}
                onChange={(event) => updateField('kind', event.target.value)}
              >
                {FACTORY_KINDS.filter((kind) => kind.id !== 'all').map((kind) => (
                  <option key={kind.id} value={kind.id}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductFormField label="Category" required hint="Controls seller filtering.">
              <select
                className="select"
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
              >
                {FACTORY_CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </ProductFormField>
            <ProductFormField label="Short Description" required error={errors.description}>
              <input
                className="input"
                placeholder="One-line summary for catalog cards"
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
            </ProductFormField>
            <ProductFormField
              label="Long Description"
              required
              error={errors.longDescription}
              style={{ gridColumn: '1 / -1' }}
              hint="Shown on the detail page."
            >
              <textarea
                className="input input-textarea"
                rows={5}
                placeholder="Describe the product or portfolio project in detail"
                value={formData.longDescription}
                onChange={(event) => updateField('longDescription', event.target.value)}
              />
            </ProductFormField>
          </div>
        </ProductFormSection>

        <ProductFormSection
          title="Media & Documents"
          description="Upload catalog banners and optional pitch material."
        >
          <ProductMediaFields
            formData={formData}
            replacePitchDeck={replacePitchDeck}
            setFormData={setFormData}
            setImageFiles={setImageFiles}
            setPitchDeckFile={setPitchDeckFile}
            setReplacePitchDeck={setReplacePitchDeck}
          />
        </ProductFormSection>

        <ProductFormSection
          title="Selling Details"
          description="Use short, scan-friendly bullets for the detail page."
        >
          <div className="form-grid-3">
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

        <ProductFormSection
          title="Visual Style"
          description="Optional catalog styling. Leave defaults unless the item needs distinction."
        >
          <div className="form-grid-2">
            <ProductFormField label="Badge">
              <input
                className="input"
                placeholder="Popular, New, Enterprise"
                value={formData.badge}
                onChange={(event) => updateField('badge', event.target.value)}
              />
            </ProductFormField>
            <ProductFormField label="Icon">
              <select
                className="select"
                value={formData.icon}
                onChange={(event) => updateField('icon', event.target.value)}
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
          </div>
        </ProductFormSection>
      </div>
    </div>
  )
}
