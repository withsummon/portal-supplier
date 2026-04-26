import type { ProjectStatus, QuoteStatus } from '@/lib/mock-data';
import { statusLabels, quoteStatusLabels } from '@/lib/mock-data';

interface Props {
    status: ProjectStatus | QuoteStatus;
    type?: 'project' | 'quote';
    showDot?: boolean;
}

export default function StatusBadge({ status, type = 'project', showDot = true }: Props) {
    const label = type === 'project' 
        ? statusLabels[status as ProjectStatus] 
        : quoteStatusLabels[status as QuoteStatus];

    return (
        <span className={`badge badge-${status}`}>
            {showDot && <span className="badge-dot" />}
            {label}
        </span>
    );
}
