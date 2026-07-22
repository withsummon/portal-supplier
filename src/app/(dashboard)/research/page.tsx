import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bookmark } from 'lucide-react'
import { getCachedPublishedArticles } from '@/lib/data/articles'

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export default async function ResearchBlog() {
  const articles = await getCachedPublishedArticles()

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">News and insights published by Summon.</p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--sp-16)' }}>
          <div className="empty-state-icon">
            <Bookmark size={24} />
          </div>
          <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>
            No articles yet
          </h3>
          <p className="text-sm text-secondary" style={{ marginTop: 'var(--sp-2)' }}>
            Published articles from admin will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
          {articles.map((article) => (
            <Link
              key={article.id}
              className="card"
              href={`/research/${article.slug}`}
              style={{ color: 'inherit', overflow: 'hidden', textDecoration: 'none' }}
            >
              <div
                style={{
                  height: 180,
                  position: 'relative',
                  background: 'var(--neutral-100)',
                }}
              >
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Bookmark
                    size={36}
                    style={{
                      color: 'var(--text-muted)',
                      position: 'absolute',
                      left: 'calc(50% - 18px)',
                      top: 'calc(50% - 18px)',
                    }}
                  />
                )}
              </div>
              <div style={{ padding: 'var(--sp-5)' }}>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'var(--fs-xs)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  {article.publishedAt
                    ? dateFormatter.format(new Date(article.publishedAt))
                    : 'Published'}
                </div>
                <h2 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--sp-2)' }}>
                  {article.title}
                </h2>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--fs-sm)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  {article.excerpt}
                </p>
                <span
                  style={{
                    alignItems: 'center',
                    color: 'var(--blue-600)',
                    display: 'inline-flex',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-semibold)',
                    gap: 4,
                  }}
                >
                  Read Article <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
