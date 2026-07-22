'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createElement } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { getProductIcon } from '@/lib/product-icons'
import { useFactoryProducts } from '@/hooks/use-factory-products'

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

export default function FactoryPageClient({ products }: { products: FactoryProduct[] }) {
  const {
    activeCategory,
    categories,
    filteredProducts,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
  } = useFactoryProducts(products)

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Summon Factory</h1>
          <p className="page-subtitle">
            Browse Summon products and completed portfolio work for your clients.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="header-search" style={{ maxWidth: '400px', background: 'white' }}>
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--sp-6)' }}>
        <div
          className="card"
          style={{
            alignSelf: 'flex-start',
            position: 'sticky',
            top: 'calc(var(--header-height) + var(--sp-6))',
          }}
        >
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
                  fontWeight:
                    activeCategory === category.id ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                  color:
                    activeCategory === category.id ? 'var(--blue-700)' : 'var(--text-secondary)',
                  background: activeCategory === category.id ? 'var(--blue-50)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                }}
              >
                <span>{category.label}</span>
                <span
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: activeCategory === category.id ? 'var(--blue-600)' : 'var(--text-muted)',
                    background:
                      activeCategory === category.id ? 'var(--blue-100)' : 'var(--neutral-100)',
                    padding: '1px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 'var(--fw-semibold)',
                  }}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-4)',
            }}
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}
          >
            {filteredProducts.map((product) => {
              const bannerImage = product.images[0]
              return (
                <Link
                  key={product.id}
                  className="card"
                  href={`/factory/${product.slug}`}
                  style={{
                    display: 'block',
                    overflow: 'hidden',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid var(--border-default)',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--neutral-100)',
                      height: 160,
                      position: 'relative',
                    }}
                  >
                    {bannerImage ? (
                      <Image
                        src={bannerImage}
                        alt={product.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        {createElement(getProductIcon(product.icon), {
                          size: 32,
                          style: { color: product.iconColor },
                        })}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 'var(--sp-5)' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-lg)',
                        background: product.iconBg,
                        color: product.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--sp-4)',
                      }}
                    >
                      {createElement(getProductIcon(product.icon), { size: 20 })}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 'var(--sp-3)',
                        marginBottom: 'var(--sp-2)',
                      }}
                    >
                      <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
                        {product.name}
                      </div>
                      <span className="badge badge-submitted">
                        {product.kind === 'PORTFOLIO' ? 'Portofolio' : 'Produk'}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--sp-4)',
                      }}
                    >
                      {product.description}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--blue-600)',
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                        }}
                      >
                        View Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
