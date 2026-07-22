'use client'

import Image from 'next/image'
import { createElement, useEffect, useMemo } from 'react'
import type { ProductFormState } from '@/hooks/use-admin-products'
import { getProductIcon } from '@/lib/product-icons'

export default function ProductFactoryPreview({
  imageFiles,
  product,
}: {
  imageFiles: File[]
  product: ProductFormState
}) {
  const localImage = useMemo(
    () => (imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : ''),
    [imageFiles],
  )
  const bannerImage = localImage || product.images[0]

  useEffect(() => {
    if (!localImage) return
    return () => URL.revokeObjectURL(localImage)
  }, [localImage])

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ background: 'var(--neutral-100)', height: 180, position: 'relative' }}>
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt={product.name || 'Factory item banner'}
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
            {createElement(getProductIcon(product.icon), { size: 32 })}
          </div>
        )}
      </div>
      <div style={{ padding: 'var(--sp-5)' }}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--sp-2)',
          }}
        >
          <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
            {product.name || 'Factory item name'}
          </div>
          <span className="badge badge-submitted">
            {product.kind === 'PORTFOLIO' ? 'Portofolio' : 'Produk'}
          </span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
          {product.description || 'Short description will appear here.'}
        </div>
      </div>
    </div>
  )
}
