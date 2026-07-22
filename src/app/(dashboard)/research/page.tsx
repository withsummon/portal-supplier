import { Bookmark } from 'lucide-react'

export default function ResearchBlog() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Research & Insights</h1>
          <p className="page-subtitle">
            Research content will appear here after it is published from a real data source.
          </p>
        </div>
      </div>

      <div className="empty-state" style={{ padding: 'var(--sp-16)' }}>
        <div className="empty-state-icon">
          <Bookmark size={24} />
        </div>
        <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>
          No research articles yet
        </h3>
        <p className="text-sm text-secondary" style={{ marginTop: 'var(--sp-2)' }}>
          This page no longer shows static article data.
        </p>
      </div>
    </div>
  )
}
