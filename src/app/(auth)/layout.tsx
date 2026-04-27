import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: '100vh', background: 'var(--surface-page)' }}>{children}</div>
}
