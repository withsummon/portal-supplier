'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { createArticle, updateArticle } from '@/lib/actions/articles'
import type { ArticleData } from '@/lib/data/articles'
import ProductFormField from '../products/ProductFormField'
import ProductFormSection from '../products/ProductFormSection'

type ArticleFormState = {
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

export default function ArticleFormClient({ article }: { article?: ArticleData }) {
  const router = useRouter()
  const [formData, setFormData] = useState<ArticleFormState>(article ?? emptyForm)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const coverPreview = useMemo(
    () => (coverImageFile ? URL.createObjectURL(coverImageFile) : (formData.coverImage ?? '')),
    [coverImageFile, formData.coverImage],
  )

  useEffect(() => {
    if (!coverImageFile) return
    return () => URL.revokeObjectURL(coverPreview)
  }, [coverImageFile, coverPreview])

  function updateField<K extends keyof ArticleFormState>(key: K, value: ArticleFormState[K]) {
    setErrors((current) => ({ ...current, [key]: '' }))
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function saveArticle(published: boolean) {
    const nextErrors = {
      title: formData.title.trim() ? '' : 'Title is required.',
      content: formData.content.trim() ? '' : 'Article content is required.',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setError('')
    startTransition(() => {
      const action = article?.id
        ? updateArticle({
            id: article.id,
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            published,
            existingCoverImage: formData.coverImage,
            coverImage: coverImageFile,
          })
        : createArticle({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            published,
            coverImage: coverImageFile,
          })

      void action
        .then((savedArticle) => {
          if (savedArticle?.slug) router.push(`/admin/articles/${savedArticle.slug}/edit`)
        })
        .catch((saveError: unknown) =>
          setError(saveError instanceof Error ? saveError.message : 'Failed to save article.'),
        )
    })
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <Link
            href="/admin/articles"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 12 }}
          >
            <ArrowLeft size={14} />
            Back to Articles
          </Link>
          <h1 className="page-title">{article ? 'Edit Article' : 'Add Article'}</h1>
          <p className="page-subtitle">Write and publish news for sellers.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <button
            className="btn btn-secondary"
            type="button"
            disabled={isPending}
            onClick={() => saveArticle(false)}
          >
            <Save size={15} />
            Save Draft
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={isPending}
            onClick={() => saveArticle(true)}
          >
            <Send size={15} />
            {isPending ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--color-danger)',
            color: 'var(--color-danger)',
            marginBottom: 'var(--sp-5)',
            padding: 'var(--sp-4)',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--sp-5)' }}>
        <ProductFormSection title="Content">
          <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
            <ProductFormField label="Title" required error={errors.title}>
              <input
                className="input"
                placeholder="Quarterly platform update"
                value={formData.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
            </ProductFormField>
            <ProductFormField label="Excerpt">
              <textarea
                className="input input-textarea"
                rows={3}
                placeholder="Short summary shown on article cards"
                value={formData.excerpt}
                onChange={(event) => updateField('excerpt', event.target.value)}
              />
            </ProductFormField>
            <ProductFormField label="Article Content" required error={errors.content}>
              <textarea
                className="input input-textarea"
                rows={12}
                placeholder="Write the full article here"
                value={formData.content}
                onChange={(event) => updateField('content', event.target.value)}
              />
            </ProductFormField>
          </div>
        </ProductFormSection>

        <ProductFormSection title="Cover & Preview">
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--sp-5)' }}>
            <div
              style={{
                aspectRatio: '16 / 10',
                background: 'var(--neutral-100)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt={formData.title || 'Cover'}
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    alignItems: 'center',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                  }}
                >
                  No cover image
                </div>
              )}
            </div>
            <div>
              <ProductFormField label="Cover Image">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setCoverImageFile(event.target.files?.[0] ?? null)}
                />
              </ProductFormField>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 'var(--fs-sm)',
                  marginTop: 'var(--sp-4)',
                }}
              >
                Current status: {formData.published ? 'Published' : 'Draft'}
              </div>
            </div>
          </div>
        </ProductFormSection>
      </div>
    </div>
  )
}
