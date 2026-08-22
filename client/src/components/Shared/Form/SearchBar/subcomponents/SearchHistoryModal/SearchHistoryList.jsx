import {
    Search as SearchIcon,
    CalendarClock as CalendarClockIcon,
    RotateCcw as ResetIcon,
} from 'lucide-react';
import SearchHistoryItem from './SearchHistoryItem';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';

/**
 * Search History List Container Subcomponent
 * Handles zero-history empty state, zero-matches filtered empty state, and list rendering.
 */
function SearchHistoryList({
    history = [],
    filteredModalHistory = [],
    dateRangeError,
    resetModalFilters,
    onSelectTerm,
    onRemoveItem,
}) {
    return (
        <div className="history-modal-list-wrapper">
            {history.length === 0 ? (
                <EmptyState
                    variant="compact"
                    icon={CalendarClockIcon}
                    title="No search history"
                    description="Your search history will appear here after you make searches."
                />
            ) : filteredModalHistory.length === 0 ? (
                <EmptyState
                    variant="compact"
                    icon={SearchIcon}
                    title="No matches found"
                    description={
                        dateRangeError
                            ? 'Fix the date range to see results.'
                            : 'Try adjusting your filters or date range.'
                    }
                    action={
                        <button
                            type="button"
                            className="empty-reset-btn"
                            onClick={resetModalFilters}
                        >
                            <ResetIcon size={13} style={{ marginRight: '4px' }} /> Reset Filters
                        </button>
                    }
                />
            ) : (
                <ul className="history-modal-list">
                    {filteredModalHistory.map(({ id, term, timestamp }) => (
                        <SearchHistoryItem
                            key={id}
                            id={id}
                            term={term}
                            timestamp={timestamp}
                            onSelectTerm={onSelectTerm}
                            onRemoveItem={onRemoveItem}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchHistoryList;
