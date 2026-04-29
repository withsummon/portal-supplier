import AdminProjectsPageClient from './AdminProjectsPageClient'
import { getCachedAdminProjects } from '@/lib/data/project-workflows'

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ highlight?: string; status?: string }>
}) {
  const [projects, params] = await Promise.all([getCachedAdminProjects(), searchParams])

  return (
    <AdminProjectsPageClient
      initialProjects={projects}
      {...(params.highlight && { initialHighlight: params.highlight })}
      {...(params.status && { initialStatus: params.status })}
    />
  )
}
