'use client'

import { Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react'
import { PRODUCT_ICON_OPTIONS, getProductIcon } from '@/lib/product-icons'
import { useAdminProducts, type ProductFormState } from '@/hooks/use-admin-products'
import Modal from '@/components/ui/Modal'

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'conversational-ai', label: 'Conversational AI' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'computer-vision', label: 'Computer Vision' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'security', label: 'Security' },
]

function updateArrayItem(items: string[], index: number, value: string) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item))
}

export default function AdminProductsPageClient({
  initialProducts,
}: {
  initialProducts: ProductFormState[]
}) {
  const {
    categoryFilter,
    filteredProducts,
    formData,
    isPending,
    newImageFiles,
    openModal,
    pitchDeckFile,
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
  } = useAdminProducts(initialProducts)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle">
            Manage Summon Factory products and publish them to sellers.
          </p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => openModal()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openModal()
            }
          }}
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '10px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              className="input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <select
            className="select"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Assets</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                if (!product.id) {
                  return null
                }
                const productId = product.id
                const Icon = getProductIcon(product.icon)
                return (
                  <tr key={productId}>
                    <td>
                      <button
                        type="button"
                        onClick={() => openModal(product)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            openModal(product)
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sp-3)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-lg)',
                            background: product.iconBg,
                            color: product.iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 'var(--fw-semibold)' }}>{product.name}</div>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                            {product.description}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td>{product.category}</td>
                    <td>Rp {product.basePrice.toLocaleString()}</td>
                    <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                      {product.images.length} images{product.pitchDeckPdf ? ' · PDF' : ''}
                    </td>
                    <td>
                      <button
                        className={`badge badge-${product.visible ? 'accepted' : 'rejected'}`}
                        type="button"
                        onClick={() => setVisibility(productId, !product.visible)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setVisibility(productId, !product.visible)
                          }
                        }}
                      >
                        {product.visible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          type="button"
                          onClick={() => setVisibility(productId, !product.visible)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setVisibility(productId, !product.visible)
                            }
                          }}
                        >
                          {product.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          type="button"
                          onClick={() => removeProduct(productId)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              removeProduct(productId)
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} maxWidth="760px">
        <h2
          id="product-modal-title"
          style={{
            fontSize: 'var(--fs-xl)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--sp-5)',
          }}
        >
          Product Details
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          <input
            className="input"
            placeholder="Product name"
            value={formData.name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, name: event.target.value }))
            }
          />
          <select
            className="select"
            value={formData.category}
            onChange={(event) =>
              setFormData((current) => ({ ...current, category: event.target.value }))
            }
          >
            {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Short description"
            value={formData.description}
            onChange={(event) =>
              setFormData((current) => ({ ...current, description: event.target.value }))
            }
          />
          <input
            className="input"
            type="number"
            placeholder="Base price"
            value={formData.basePrice}
            onChange={(event) =>
              setFormData((current) => ({ ...current, basePrice: Number(event.target.value) }))
            }
          />
          <input
            className="input"
            placeholder="Currency"
            value={formData.currency}
            onChange={(event) =>
              setFormData((current) => ({ ...current, currency: event.target.value }))
            }
          />
          <input
            className="input"
            placeholder="Badge"
            value={formData.badge}
            onChange={(event) =>
              setFormData((current) => ({ ...current, badge: event.target.value }))
            }
          />
          <textarea
            className="input input-textarea"
            rows={4}
            style={{ gridColumn: 'span 2' }}
            placeholder="Long description"
            value={formData.longDescription}
            onChange={(event) =>
              setFormData((current) => ({ ...current, longDescription: event.target.value }))
            }
          />
        </div>

        <div
          style={{
            marginTop: 'var(--sp-5)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'var(--sp-4)',
          }}
        >
          <div>
            <div className="form-label">Features</div>
            {formData.features.map((feature, index) => (
              <input
                key={`feature-${index}`}
                className="input"
                style={{ marginBottom: 'var(--sp-2)' }}
                value={feature}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    features: updateArrayItem(current.features, index, event.target.value),
                  }))
                }
              />
            ))}
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() =>
                setFormData((current) => ({ ...current, features: [...current.features, ''] }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setFormData((current) => ({
                    ...current,
                    features: [...current.features, ''],
                  }))
                }
              }}
            >
              Add feature
            </button>
          </div>
          <div>
            <div className="form-label">Use Cases</div>
            {formData.useCases.map((useCase, index) => (
              <input
                key={`use-case-${index}`}
                className="input"
                style={{ marginBottom: 'var(--sp-2)' }}
                value={useCase}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    useCases: updateArrayItem(current.useCases, index, event.target.value),
                  }))
                }
              />
            ))}
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() =>
                setFormData((current) => ({ ...current, useCases: [...current.useCases, ''] }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setFormData((current) => ({
                    ...current,
                    useCases: [...current.useCases, ''],
                  }))
                }
              }}
            >
              Add use case
            </button>
          </div>
          <div>
            <div className="form-label">Clients</div>
            {formData.clients.map((client, index) => (
              <input
                key={`client-${index}`}
                className="input"
                style={{ marginBottom: 'var(--sp-2)' }}
                value={client}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    clients: updateArrayItem(current.clients, index, event.target.value),
                  }))
                }
              />
            ))}
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() =>
                setFormData((current) => ({ ...current, clients: [...current.clients, ''] }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setFormData((current) => ({ ...current, clients: [...current.clients, ''] }))
                }
              }}
            >
              Add client
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 'var(--sp-5)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--sp-4)',
          }}
        >
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
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--fs-sm)',
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
          <input
            className="input"
            placeholder="Icon background color"
            value={formData.iconBg}
            onChange={(event) =>
              setFormData((current) => ({ ...current, iconBg: event.target.value }))
            }
          />
          <input
            className="input"
            placeholder="Icon color"
            value={formData.iconColor}
            onChange={(event) =>
              setFormData((current) => ({ ...current, iconColor: event.target.value }))
            }
          />
        </div>

        <div style={{ marginTop: 'var(--sp-5)' }}>
          <div className="form-label">Existing Images</div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--sp-2)',
              marginBottom: 'var(--sp-3)',
            }}
          >
            {formData.images.map((image) => (
              <button
                key={image}
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    images: current.images.filter((item) => item !== image),
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setFormData((current) => ({
                      ...current,
                      images: current.images.filter((item) => item !== image),
                    }))
                  }
                }}
              >
                Remove image
              </button>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setNewImageFiles(Array.from(event.target.files ?? []))}
          />
          {newImageFiles.length > 0 && (
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-muted)',
                marginTop: 'var(--sp-2)',
              }}
            >
              {newImageFiles.length} new image(s) selected
            </div>
          )}
        </div>

        <div style={{ marginTop: 'var(--sp-5)' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--fs-sm)',
              marginBottom: 'var(--sp-2)',
            }}
          >
            <input
              type="checkbox"
              checked={replacePitchDeck}
              onChange={(event) => setReplacePitchDeck(event.target.checked)}
            />
            Replace pitch deck PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setPitchDeckFile(event.target.files?.[0] ?? null)}
          />
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              marginTop: 'var(--sp-2)',
            }}
          >
            {pitchDeckFile
              ? pitchDeckFile.name
              : (formData.pitchDeckPdf ?? 'No pitch deck uploaded')}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--sp-3)',
            marginTop: 'var(--sp-6)',
          }}
        >
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setShowModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowModal(false)
              }
            }}
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={isPending}
            onClick={saveProduct}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                saveProduct()
              }
            }}
          >
            {isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
