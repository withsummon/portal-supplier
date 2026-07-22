import { Book } from 'lucide-react'

export default function WikiPage() {
  return (
    <div className="animate-in">
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--sp-2)' }}>Summon Wiki</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Wiki content will appear here after it is connected to a real data source.
        </p>
      </div>

      <div className="empty-state" style={{ padding: 'var(--sp-16)' }}>
        <div className="empty-state-icon">
          <Book size={24} />
        </div>
        <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>
          No wiki articles yet
        </h3>
        <p className="text-sm text-secondary" style={{ marginTop: 'var(--sp-2)' }}>
          This page no longer shows static article data.
        </p>
      </div>
    </div>
  )
}
