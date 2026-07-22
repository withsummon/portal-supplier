import AdminArticlesPageClient from './AdminArticlesPageClient'
import { getCachedAdminArticles } from '@/lib/data/articles'

export default async function AdminArticlesPage() {
  const articles = await getCachedAdminArticles()

  return <AdminArticlesPageClient initialArticles={articles} />
}
