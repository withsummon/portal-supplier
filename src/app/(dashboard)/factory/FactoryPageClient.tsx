'use client'

import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Cpu, Download, Search } from 'lucide-react'
import { getProductIcon } from '@/lib/product-icons'
import { useFactoryProducts } from '@/hooks/use-factory-products'

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

export default function FactoryPageClient({ products }: { products: FactoryProduct[] }) {
  const {
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
  } = useFactoryProducts(products)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Summon Factory</h1>
          <p className="page-subtitle">Browse and resell Summon's enterprise AI solutions to your clients.</p>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="header-search" style={{ maxWidth: '400px', background: 'white' }}>
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input type="text" placeholder="Search products by name or description..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--sp-6)' }}>
        <div className="card" style={{ alignSelf: 'flex-start', position: 'sticky', top: 'calc(var(--header-height) + var(--sp-6))' }}>
          <div className="card-header">
            <div className="card-title">Categories</div>
          </div>
          <div className="card-body" style={{ padding: 'var(--sp-3)' }}>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: 'var(--sp-2) var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: activeCategory === category.id ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                  color: activeCategory === category.id ? 'var(--blue-700)' : 'var(--text-secondary)',
                  background: activeCategory === category.id ? 'var(--blue-50)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                }}
              >
                <span>{category.label}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: activeCategory === category.id ? 'var(--blue-600)' : 'var(--text-muted)', background: activeCategory === category.id ? 'var(--blue-100)' : 'var(--neutral-100)', padding: '1px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--fw-semibold)' }}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
            {filteredProducts.map((product) => {
              const Icon = getProductIcon(product.icon)
              return (
                <button
                  key={product.id}
                  type="button"
                  className="card"
                  onClick={() => {
                    setSelectedProductId(product.id)
                    setCurrentImageIndex(0)
                  }}
                  style={{ padding: 'var(--sp-6)', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-default)' }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: product.iconBg, color: product.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
                    <Icon size={24} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
                    <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>{product.name}</div>
                    {product.badge && <span className="badge badge-submitted">{product.badge}</span>}
                  </div>
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)' }}>
                    {product.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
                      {product.currency} {product.basePrice.toLocaleString()}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--blue-600)', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)' }}>
                      View Details <ArrowRight size={12} />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProductId(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '960px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'var(--sp-6)' }}>
              <div>
                <div style={{ height: '320px', borderRadius: 'var(--radius-xl)', background: 'var(--neutral-100)', overflow: 'hidden', marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedProduct.images[currentImageIndex] ? (
                    <img src={selectedProduct.images[currentImageIndex]!} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Cpu size={40} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                {selectedProduct.images.length > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => setCurrentImageIndex((currentImageIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length)}>
                      <ChevronLeft size={14} />
                    </button>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => setCurrentImageIndex((currentImageIndex + 1) % selectedProduct.images.length)}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h2 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)' }}>{selectedProduct.name}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)' }}>{selectedProduct.longDescription}</p>
                <div style={{ fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-4)' }}>
                  {selectedProduct.currency} {selectedProduct.basePrice.toLocaleString()}
                </div>

                <div style={{ marginBottom: 'var(--sp-5)' }}>
                  <div className="form-label">Features</div>
                  <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)' }}>
                    {selectedProduct.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: 'var(--sp-5)' }}>
                  <div className="form-label">Use Cases</div>
                  <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)' }}>
                    {selectedProduct.useCases.map((useCase) => (
                      <li key={useCase}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                {selectedProduct.clients.length > 0 && (
                  <div style={{ marginBottom: 'var(--sp-5)' }}>
                    <div className="form-label">Clients</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                      {selectedProduct.clients.map((client) => (
                        <span key={client} className="chip selected">
                          {client}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                  {selectedProduct.pitchDeckPdf && (
                    <Link href={selectedProduct.pitchDeckPdf} target="_blank" className="btn btn-secondary">
                      <Download size={14} />
                      Pitch Deck
                    </Link>
                  )}
                  <Link href="/projects/submit" className="btn btn-primary">
                    Submit Client Opportunity
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
