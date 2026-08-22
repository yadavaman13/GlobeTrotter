import { X as CloseIcon, RotateCcw as ResetIcon } from 'lucide-react';

/**
 * Search History Active Filters Subcomponent
 */
function SearchHistoryActiveFilters({
    hasActiveFilters,
    modalTextQuery,
    setModalTextQuery,
    filterFromDate,
    setFilterFromDate,
    filterToDate,
    setFilterToDate,
    sortOrder,
    setSortOrder,
    resetModalFilters,
}) {
    if (!hasActiveFilters) return null;

    return (
        <div className="history-modal-active-filters">
            <span className="active-filter-label">Active filters:</span>
            {modalTextQuery && (
                <span className="filter-chip">
                    keyword: "{modalTextQuery}"
                    <button type="button" onClick={() => setModalTextQuery('')}>
                        <CloseIcon size={10} />
                    </button>
                </span>
            )}
            {filterFromDate && (
                <span className="filter-chip">
                    from: {new Date(filterFromDate).toLocaleDateString()}
                    <button type="button" onClick={() => setFilterFromDate(null)}>
                        <CloseIcon size={10} />
                    </button>
                </span>
            )}
            {filterToDate && (
                <span className="filter-chip">
                    to: {new Date(filterToDate).toLocaleDateString()}
                    <button type="button" onClick={() => setFilterToDate(null)}>
                        <CloseIcon size={10} />
                    </button>
                </span>
            )}
            {sortOrder !== 'newest' && (
                <span className="filter-chip">
                    sort: oldest first
                    <button type="button" onClick={() => setSortOrder('newest')}>
                        <CloseIcon size={10} />
                    </button>
                </span>
            )}
            <button
                type="button"
                className="filter-reset-all-btn"
                onClick={resetModalFilters}
                title="Reset all filters"
            >
                <ResetIcon size={13} /> Reset all
            </button>
        </div>
    );
}

export default SearchHistoryActiveFilters;
