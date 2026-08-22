import { Search as SearchIcon, X as CloseIcon } from 'lucide-react';

/**
 * Keyword Filter Header Subcomponent
 */
function SearchHistoryFilterHeader({ modalTextQuery, setModalTextQuery }) {
    return (
        <div className="history-modal-filter-wrapper">
            <SearchIcon size={16} className="history-modal-search-icon" />
            <input
                type="text"
                className="history-modal-filter-input"
                placeholder="Filter by keyword..."
                value={modalTextQuery}
                onChange={(e) => setModalTextQuery(e.target.value)}
                autoFocus
            />
            {modalTextQuery && (
                <button
                    type="button"
                    className="history-modal-clear-filter"
                    onClick={() => setModalTextQuery('')}
                    title="Clear text filter"
                >
                    <CloseIcon size={12} />
                </button>
            )}
        </div>
    );
}

export default SearchHistoryFilterHeader;
