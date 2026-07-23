import type { ReactNode } from 'react'

export default function ProductFormSection({
  children,
  description,
  title,
}: {
  children: ReactNode
  description?: string | undefined
  title: string
}) {
  return (
    <section className="card" style={{ padding: 'var(--sp-6)' }}>
      <h2
        style={{
          fontSize: 'var(--fs-lg)',
          fontWeight: 'var(--fw-semibold)',
          marginBottom: 'var(--sp-4)',
        }}
      >
        {title}
      </h2>
      {description && <p className="form-section-desc">{description}</p>}
      {children}
    </section>
  )
}
