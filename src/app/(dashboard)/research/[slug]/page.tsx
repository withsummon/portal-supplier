import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark } from 'lucide-react'
import { getCachedPublishedArticleBySlug } from '@/lib/data/articles'

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getCachedPublishedArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <Link href="/research" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>
            <ArrowLeft size={14} />
            Back to Articles
          </Link>
          <h1 className="page-title">{article.title}</h1>
          <p className="page-subtitle">
            {article.publishedAt
              ? dateFormatter.format(new Date(article.publishedAt))
              : 'Published'}
          </p>
        </div>
      </div>

      <article className="card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            height: 360,
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
              size={48}
              style={{
                color: 'var(--text-muted)',
                position: 'absolute',
                left: 'calc(50% - 24px)',
                top: 'calc(50% - 24px)',
              }}
            />
          )}
        </div>

        <div style={{ padding: 'var(--sp-7)', maxWidth: 820 }}>
          {article.excerpt && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--fs-lg)',
                lineHeight: 'var(--lh-relaxed)',
                marginBottom: 'var(--sp-5)',
              }}
            >
              {article.excerpt}
            </p>
          )}
          <div
            style={{
              color: 'var(--text-primary)',
              lineHeight: 'var(--lh-relaxed)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {article.content}
          </div>
        </div>
      </article>
    </div>
  )
}
