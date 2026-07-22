'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, Grid3X3, Pencil, Plus, Search, Table2, Trash2 } from 'lucide-react'
import { getProductIcon } from '@/lib/product-icons'
import { FACTORY_KINDS } from '@/lib/factory-catalog-options'
import { useAdminProducts, type ProductFormState } from '@/hooks/use-admin-products'
import AdminProductGridCard from './AdminProductGridCard'

export default function AdminProductsPageClient({
  initialProducts,
}: {
  initialProducts: ProductFormState[]
}) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const {
    categoryFilter,
    filteredProducts,
    removeProduct,
    searchQuery,
    setCategoryFilter,
    setSearchQuery,
    setVisibility,
  } = useAdminProducts(initialProducts)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Factory Catalog</h1>
          <p className="page-subtitle">
            Manage Summon products and portfolio items published to sellers.
          </p>
        </div>
        <Link className="btn btn-primary" href="/admin/products/new">
          <Plus size={15} />
          Add Item
        </Link>
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
            {FACTORY_KINDS.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              type="button"
              onClick={() => setViewMode('table')}
            >
              <Table2 size={14} />
              Table
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              type="button"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={14} />
              Grid
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
          {filteredProducts.map((product) =>
            product.id ? (
              <AdminProductGridCard
                key={product.id}
                product={{ ...product, id: product.id }}
                removeProduct={removeProduct}
                setVisibility={setVisibility}
              />
            ) : null,
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Assets</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  if (!product.id) return null

                  const productId = product.id
                  const Icon = getProductIcon(product.icon)
                  return (
                    <tr key={product.id}>
                      <td>
                        <Link
                          href={`/admin/products/${product.slug}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sp-3)',
                            color: 'inherit',
                            textDecoration: 'none',
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
                        </Link>
                      </td>
                      <td>{product.kind === 'PORTFOLIO' ? 'Portofolio' : 'Produk'}</td>
                      <td>{product.category}</td>
                      <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {product.images.length} images{product.pitchDeckPdf ? ' · PDF' : ''}
                      </td>
                      <td>
                        <button
                          className={`badge badge-${product.visible ? 'accepted' : 'rejected'}`}
                          type="button"
                          onClick={() => setVisibility(productId, !product.visible)}
                        >
                          {product.visible ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                          <Link
                            className="btn btn-ghost btn-sm"
                            href={`/admin/products/${product.slug}/edit`}
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm"
                            type="button"
                            onClick={() => setVisibility(productId, !product.visible)}
                          >
                            {product.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            type="button"
                            onClick={() => removeProduct(productId)}
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
      )}
    </div>
  )
}
