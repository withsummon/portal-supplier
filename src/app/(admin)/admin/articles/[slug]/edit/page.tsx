import { notFound } from 'next/navigation'
import ArticleFormClient from '../../ArticleFormClient'
import { getCachedAdminArticleBySlug } from '@/lib/data/articles'

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getCachedAdminArticleBySlug(slug)

  if (!article) notFound()

  return <ArticleFormClient article={article} />
}
