import type { CSSProperties, ReactNode } from 'react'

export default function ProductFormField({
  children,
  error,
  hint,
  label,
  required,
  style,
}: {
  children: ReactNode
  error?: string | undefined
  hint?: string | undefined
  label: string
  required?: boolean | undefined
  style?: CSSProperties | undefined
}) {
  return (
    <label style={{ display: 'block', ...style }}>
      <span className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </span>
      {children}
      {hint && <span className="form-field-hint">{hint}</span>}
      {error && (
        <span
          style={{
            color: 'var(--color-danger)',
            display: 'block',
            fontSize: 'var(--fs-xs)',
            marginTop: 'var(--sp-1)',
          }}
        >
          {error}
        </span>
      )}
    </label>
  )
}
