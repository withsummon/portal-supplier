import SubmitProjectPageClient from './SubmitProjectPageClient'
import { getCachedProjectCategories } from '@/lib/data/project-workflows'

export default async function SubmitProjectPage() {
  const categories = await getCachedProjectCategories()

  return <SubmitProjectPageClient categories={categories} />
}
