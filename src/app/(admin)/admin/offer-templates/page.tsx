import { getCachedOfferTemplates } from '@/lib/data/offer-templates'
import { getCachedProjectCategories } from '@/lib/data/project-workflows'
import OfferTemplatesPageClient from './OfferTemplatesPageClient'

export default async function OfferTemplatesPage() {
  const [templates, categories] = await Promise.all([
    getCachedOfferTemplates(),
    getCachedProjectCategories(),
  ])

  return <OfferTemplatesPageClient initialTemplates={templates} categories={categories} />
}
