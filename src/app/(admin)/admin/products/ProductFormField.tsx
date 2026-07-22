import type { CSSProperties, ReactNode } from 'react'

export default function ProductFormField({
  children,
  label,
  style,
}: {
  children: ReactNode
  label: string
  style?: CSSProperties
}) {
  return (
    <label style={{ display: 'block', ...style }}>
      <span className="form-label">{label}</span>
      {children}
    </label>
  )
}
