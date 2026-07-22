import type { ReactNode } from 'react'

export default function ProductFormSection({
  children,
  title,
}: {
  children: ReactNode
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
      {children}
    </section>
  )
}
