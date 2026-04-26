import {
  projectStatusLabels,
  quoteStatusLabels,
  type MockProjectStatus,
  type MockQuoteStatus,
} from '@/lib/utils/data'

type Props = {
  status: MockProjectStatus | MockQuoteStatus
  type?: 'project' | 'quote'
  showDot?: boolean
}

export default function StatusBadge({ status, type = 'project', showDot = true }: Props) {
  const label =
    type === 'project'
      ? (projectStatusLabels[status] ?? status)
      : (quoteStatusLabels[status] ?? status)

  return (
    <span className={`badge badge-${status}`}>
      {showDot && <span className="badge-dot" />}
      {label}
    </span>
  )
}
