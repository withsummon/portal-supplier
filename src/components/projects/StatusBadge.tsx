import { projectStatusLabels, type ProjectStatusKey } from '@/lib/utils/data'

type Props = {
  status: ProjectStatusKey
  showDot?: boolean
}

export default function StatusBadge({ status, showDot = true }: Props) {
  const label = projectStatusLabels[status] ?? status

  return (
    <span className={`badge badge-${status}`}>
      {showDot && <span className="badge-dot" />}
      {label}
    </span>
  )
}
