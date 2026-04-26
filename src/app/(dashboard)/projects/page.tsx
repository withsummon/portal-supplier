import { getCachedAllProjects } from '@/lib/data/projects'
import ProjectsList from './ProjectsList'

export default async function Page() {
  const projectsList = await getCachedAllProjects()
  return <ProjectsList projects={projectsList} />
}
