'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Cpu } from 'lucide-react'

export default function FactoryProductBanner({
  images,
  productName,
}: {
  images: string[]
  productName: string
}) {
  const [index, setIndex] = useState(0)
  const activeImage = images[index]
  const canNavigate = images.length > 1

  function previous() {
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  function next() {
    setIndex((current) => (current + 1) % images.length)
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div
        style={{
          height: '420px',
          background: 'var(--neutral-100)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            unoptimized
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Cpu size={48} style={{ color: 'var(--text-muted)' }} />
        )}

        {canNavigate && (
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={previous}
              aria-label="Previous banner"
              style={{
                position: 'absolute',
                left: 'var(--sp-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 38,
                height: 38,
                padding: 0,
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={next}
              aria-label="Next banner"
              style={{
                position: 'absolute',
                right: 'var(--sp-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 38,
                height: 38,
                padding: 0,
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {canNavigate && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--sp-3)',
            padding: 'var(--sp-4)',
          }}
        >
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show banner ${imageIndex + 1}`}
              style={{
                aspectRatio: '16 / 10',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                background: 'var(--neutral-100)',
                border:
                  imageIndex === index
                    ? '2px solid var(--blue-500)'
                    : '1px solid var(--border-default)',
                cursor: 'pointer',
              }}
            >
              <Image
                src={image}
                alt={productName}
                fill
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
