import { getCachedAllProjects } from '@/lib/data/projects'
import ProjectsList from './ProjectsList'
import { requireRole } from '@/lib/auth/session'

export default async function Page() {
  const user = await requireRole('SELLER')
  const projectsList = await getCachedAllProjects(user.seller?.id)
  return <ProjectsList projects={projectsList} />
}
