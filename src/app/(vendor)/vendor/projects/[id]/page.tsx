import { notFound } from 'next/navigation'
import VendorProjectDetailClient from './VendorProjectDetailClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedVendorProjectDetailForUser } from '@/lib/data/project-workflows'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VendorProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const user = await requireRole('VENDOR')
  const project = await getCachedVendorProjectDetailForUser(id, user.id)

  if (!project) {
    notFound()
  }

  return <VendorProjectDetailClient project={project} />
}
