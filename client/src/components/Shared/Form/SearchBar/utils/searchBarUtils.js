let _idCounter = 0;
export const makeId = () => `h-${Date.now()}-${++_idCounter}`;

/**
 * Format a timestamp into a human-readable relative or absolute string.
 */
export function formatHistoryTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Create seed search history with realistic past timestamps.
 */
export function makeSeedHistory() {
    const now = Date.now();
    const HOUR = 3_600_000;
    const DAY = 86_400_000;
    return [
        { id: makeId(), term: 'EdgeTech', timestamp: now - 8 * HOUR },
        { id: makeId(), term: 'INV-2024-001', timestamp: now - 1 * DAY },
        { id: makeId(), term: 'Paid', timestamp: now - 2 * DAY - 3 * HOUR },
        { id: makeId(), term: 'Due Amount', timestamp: now - 4 * DAY },
        { id: makeId(), term: 'Precision Innovations', timestamp: now - 6 * DAY },
        { id: makeId(), term: 'January 2025', timestamp: now - 9 * DAY },
        { id: makeId(), term: 'Overdue', timestamp: now - 14 * DAY },
    ];
}
