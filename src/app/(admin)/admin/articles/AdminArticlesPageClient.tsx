'use client'

import { useMemo, useState, useTransition } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { createArticle, deleteArticle, updateArticle } from '@/lib/actions/articles'
import type { ArticleData } from '@/lib/data/articles'

type ArticleFormState = {
  id?: string
  title: string
  excerpt: string
  content: string
  coverImage: string | null
  published: boolean
}

const emptyForm: ArticleFormState = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: null,
  published: false,
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })
type SavedArticle = NonNullable<Awaited<ReturnType<typeof createArticle>>>

function toForm(article: ArticleData): ArticleFormState {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    published: article.published,
  }
}

function normalizeArticle(article: SavedArticle): ArticleData {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? '',
    content: article.content,
    coverImage: article.coverImage,
    status: article.status,
    published: article.status === 'PUBLISHED',
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }
}

export default function AdminArticlesPageClient({
  initialArticles,
}: {
  initialArticles: ArticleData[]
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<ArticleFormState | null>(null)
  const [formData, setFormData] = useState<ArticleFormState>(emptyForm)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredArticles = useMemo(() => {
    const lowerQuery = query.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery),
    )
  }, [articles, query])

  function openModal(article?: ArticleData) {
    const nextForm = article ? toForm(article) : emptyForm
    setEditingArticle(nextForm.id ? nextForm : null)
    setFormData(nextForm)
    setCoverImageFile(null)
    setShowModal(true)
  }

  function saveArticle() {
    startTransition(() => {
      const action =
        editingArticle?.id && formData.id
          ? updateArticle({
              id: formData.id,
              title: formData.title,
              excerpt: formData.excerpt,
              content: formData.content,
              published: formData.published,
              existingCoverImage: formData.coverImage,
              coverImage: coverImageFile,
            })
          : createArticle({
              title: formData.title,
              excerpt: formData.excerpt,
              content: formData.content,
              published: formData.published,
              coverImage: coverImageFile,
            })

      void action.then((article) => {
        if (!article) return
        const normalized = normalizeArticle(article)
        setArticles((current) =>
          editingArticle?.id
            ? current.map((item) => (item.id === normalized.id ? normalized : item))
            : [normalized, ...current],
        )
        setShowModal(false)
      })
    })
  }

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
        <button className="btn btn-primary" type="button" onClick={() => openModal()}>
          <Plus size={15} />
          Add Article
        </button>
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
                    <button
                      type="button"
                      onClick={() => openModal(article)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{article.title}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {article.excerpt || 'No excerpt'}
                      </div>
                    </button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} maxWidth="760px">
        <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--sp-5)' }}>Article Details</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          <input
            className="input"
            placeholder="Title"
            value={formData.title}
            onChange={(event) =>
              setFormData((current) => ({ ...current, title: event.target.value }))
            }
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--fs-sm)',
            }}
          >
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(event) =>
                setFormData((current) => ({ ...current, published: event.target.checked }))
              }
            />
            Published
          </label>
          <input
            className="input"
            placeholder="Excerpt"
            value={formData.excerpt}
            onChange={(event) =>
              setFormData((current) => ({ ...current, excerpt: event.target.value }))
            }
            style={{ gridColumn: 'span 2' }}
          />
          <textarea
            className="input input-textarea"
            rows={8}
            placeholder="Article content"
            value={formData.content}
            onChange={(event) =>
              setFormData((current) => ({ ...current, content: event.target.value }))
            }
            style={{ gridColumn: 'span 2' }}
          />
        </div>

        <div style={{ marginTop: 'var(--sp-5)' }}>
          <div className="form-label">Cover Image</div>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setCoverImageFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--sp-3)',
            marginTop: 'var(--sp-6)',
          }}
        >
          <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={isPending}
            onClick={saveArticle}
          >
            {isPending ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
