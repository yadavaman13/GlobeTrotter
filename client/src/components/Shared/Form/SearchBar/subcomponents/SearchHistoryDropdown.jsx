import { Clock as ClockIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import SearchHistoryItem from './SearchHistoryItem';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import ClearAllButton from '@/components/Shared/Buttons/ClearAllButton';

function SearchHistoryDropdown({
    history = [],
    onSelectTerm,
    onRemoveItem,
    onClearAll,
    onOpenModal,
}) {
    const topHistory = [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);

    if (history.length === 0) {
        return (
            <div className="searchbar-history-dropdown searchbar-history-empty">
                <EmptyState
                    variant="minimal"
                    icon={ClockIcon}
                    title="No recent searches yet"
                    size="sm"
                />
            </div>
        );
    }

    return (
        <div className="searchbar-history-dropdown">
            <div className="history-dropdown-header">
                <span className="history-title">
                    <ClockIcon size={13} /> Recent Searches
                </span>
                <ClearAllButton label="Clear all" variant="danger" size="sm" onClick={onClearAll} />
            </div>

            <ul className="history-dropdown-list">
                {topHistory.map(({ id, term, timestamp }) => (
                    <SearchHistoryItem
                        key={id}
                        id={id}
                        term={term}
                        timestamp={timestamp}
                        onSelect={onSelectTerm}
                        onRemove={onRemoveItem}
                    />
                ))}
            </ul>

            <div className="history-dropdown-footer">
                <button
                    type="button"
                    className="history-see-all-btn"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onOpenModal}
                >
                    <span>See all search history ({history.length})</span>
                    <ChevronRightIcon size={14} />
                </button>
            </div>
        </div>
    );
}

export default SearchHistoryDropdown;
