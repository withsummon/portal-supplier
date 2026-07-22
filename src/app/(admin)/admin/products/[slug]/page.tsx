import { createElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, Pencil } from 'lucide-react'
import { getCachedAdminProductBySlug } from '@/lib/data/products'
import { getProductIcon } from '@/lib/product-icons'
import FactoryProductBanner from '@/app/(dashboard)/factory/[slug]/FactoryProductBanner'

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getCachedAdminProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const kindLabel = product.kind === 'PORTFOLIO' ? 'Portofolio Summon' : 'Produk Summon'

  return (
    <div className="animate-in">
      <div className="page-header" style={{ alignItems: 'flex-end' }}>
        <div>
          <Link
            href="/admin/products"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '12px' }}
          >
            <ArrowLeft size={14} />
            Back to Catalog
          </Link>
          <h1 className="page-title">{product.name}</h1>
          <p className="page-subtitle">{product.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <Link href={`/admin/products/${product.slug}/edit`} className="btn btn-primary">
            <Pencil size={14} />
            Edit Item
          </Link>
          {product.pitchDeckPdf && (
            <Link href={product.pitchDeckPdf} target="_blank" className="btn btn-secondary">
              <Download size={14} />
              Pitch Deck
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--sp-6)' }}>
        <FactoryProductBanner images={product.images} productName={product.name} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: product.iconBg,
                color: product.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--sp-4)',
              }}
            >
              {createElement(getProductIcon(product.icon), { size: 24 })}
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              <span className="badge badge-submitted">{kindLabel}</span>
              <span className="badge">{product.category}</span>
              <span className={`badge badge-${product.visible ? 'accepted' : 'rejected'}`}>
                {product.visible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
              {product.longDescription || product.description}
            </p>
          </div>

          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            <div className="card-title" style={{ marginBottom: 'var(--sp-3)' }}>
              Features
            </div>
            <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)' }}>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            <div className="card-title" style={{ marginBottom: 'var(--sp-3)' }}>
              Use Cases
            </div>
            <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)' }}>
              {product.useCases.map((useCase) => (
                <li key={useCase}>{useCase}</li>
              ))}
            </ul>
          </div>

          {product.clients.length > 0 && (
            <div className="card" style={{ padding: 'var(--sp-6)' }}>
              <div className="card-title" style={{ marginBottom: 'var(--sp-3)' }}>
                Clients
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                {product.clients.map((client) => (
                  <span key={client} className="chip selected">
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
