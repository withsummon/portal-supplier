'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createElement } from 'react'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import type { ProductFormState } from '@/hooks/use-admin-products'
import { getProductIcon } from '@/lib/product-icons'

export default function AdminProductGridCard({
  product,
  removeProduct,
  setVisibility,
}: {
  product: ProductFormState & { id: string }
  removeProduct: (id: string) => void
  setVisibility: (id: string, visible: boolean) => void
}) {
  const bannerImage = product.images[0]

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <Link
        href={`/admin/products/${product.slug}`}
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <div style={{ background: 'var(--neutral-100)', height: 150, position: 'relative' }}>
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
                color: product.iconColor,
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              {createElement(getProductIcon(product.icon), { size: 30 })}
            </div>
          )}
        </div>
        <div style={{ padding: 'var(--sp-5) var(--sp-5) 0' }}>
          <div style={{ fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--sp-1)' }}>
            {product.name}
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: 'var(--fs-xs)',
              minHeight: 36,
            }}
          >
            {product.description}
          </div>
        </div>
      </Link>

      <div style={{ padding: 'var(--sp-4) var(--sp-5) var(--sp-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <span className="badge badge-submitted">
            {product.kind === 'PORTFOLIO' ? 'Portofolio' : 'Produk'}
          </span>
          <span className={`badge badge-${product.visible ? 'accepted' : 'rejected'}`}>
            {product.visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: 'var(--fs-xs)',
            marginTop: 'var(--sp-3)',
          }}
        >
          {product.category} · {product.images.length} images
          {product.pitchDeckPdf ? ' · PDF' : ''}
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-4)' }}>
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
            onClick={() => setVisibility(product.id, !product.visible)}
          >
            {product.visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => removeProduct(product.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
