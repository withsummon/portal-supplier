import AdminProjectsPageClient from './AdminProjectsPageClient'
import { getCachedAdminProjects } from '@/lib/data/project-workflows'

export default async function AdminProjectsPage() {
  const projects = await getCachedAdminProjects()

  return <AdminProjectsPageClient initialProjects={projects} />
}
