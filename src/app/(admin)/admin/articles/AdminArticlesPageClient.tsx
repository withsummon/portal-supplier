'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { deleteArticle } from '@/lib/actions/articles'
import type { ArticleData } from '@/lib/data/articles'

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export default function AdminArticlesPageClient({
  initialArticles,
}: {
  initialArticles: ArticleData[]
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [query, setQuery] = useState('')
  const [, startTransition] = useTransition()

  const filteredArticles = useMemo(() => {
    const lowerQuery = query.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery),
    )
  }, [articles, query])

  function removeArticle(id: string) {
    setArticles((current) => current.filter((article) => article.id !== id))
    startTransition(() => {
      void deleteArticle(id)
    })
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">Publish news and insights for sellers.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/articles/new">
          <Plus size={15} />
          Add Article
        </Link>
      </div>

      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <div style={{ position: 'relative', maxWidth: '420px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '10px',
              color: 'var(--text-muted)',
            }}
          />
          <input
            className="input"
            placeholder="Search articles..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Status</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      style={{
                        color: 'inherit',
                        display: 'block',
                        textDecoration: 'none',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{article.title}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {article.excerpt || 'No excerpt'}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <span className={`badge badge-${article.published ? 'accepted' : 'pending'}`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                    {article.publishedAt
                      ? dateFormatter.format(new Date(article.publishedAt))
                      : '-'}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => removeArticle(article.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
