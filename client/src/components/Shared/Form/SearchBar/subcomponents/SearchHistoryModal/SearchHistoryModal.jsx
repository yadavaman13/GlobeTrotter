import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import ClearAllButton from '@/components/Shared/Buttons/ClearAllButton';
import SearchHistoryFilterHeader from './SearchHistoryFilterHeader';
import SearchHistoryControlsRow from './SearchHistoryControlsRow';
import SearchHistoryAlerts from './SearchHistoryAlerts';
import SearchHistoryActiveFilters from './SearchHistoryActiveFilters';
import SearchHistoryList from './SearchHistoryList';

/**
 * Search History Modal Component
 * Composes SearchHistoryFilterHeader, SearchHistoryControlsRow, SearchHistoryAlerts,
 * SearchHistoryActiveFilters, and SearchHistoryList inside Dialog portal.
 */
function SearchHistoryModal({
    isOpen,
    onClose,
    history = [],
    filteredModalHistory = [],
    modalTextQuery,
    setModalTextQuery,
    filterFromDate,
    setFilterFromDate,
    filterToDate,
    setFilterToDate,
    sortOrder,
    setSortOrder,
    resetModalFilters,
    dateRangeError,
    futureDateWarning,
    hasActiveFilters,
    onSelectTerm,
    onRemoveItem,
    onClearAllHistory,
}) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Search History"
            size="lg"
            showCloseIcon={true}
            confirmText=""
            cancelText=""
        >
            <div className="history-modal-container">
                {/* 1. Keyword Text Filter Header */}
                <SearchHistoryFilterHeader
                    modalTextQuery={modalTextQuery}
                    setModalTextQuery={setModalTextQuery}
                />

                {/* 2. Date Range & Sort Controls Row */}
                <SearchHistoryControlsRow
                    filterFromDate={filterFromDate}
                    setFilterFromDate={setFilterFromDate}
                    filterToDate={filterToDate}
                    setFilterToDate={setFilterToDate}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />

                {/* 3. Validation Warnings & Alerts */}
                <SearchHistoryAlerts
                    dateRangeError={dateRangeError}
                    futureDateWarning={futureDateWarning}
                />

                {/* 4. Active Filters Chips */}
                <SearchHistoryActiveFilters
                    hasActiveFilters={hasActiveFilters}
                    modalTextQuery={modalTextQuery}
                    setModalTextQuery={setModalTextQuery}
                    filterFromDate={filterFromDate}
                    setFilterFromDate={setFilterFromDate}
                    filterToDate={filterToDate}
                    setFilterToDate={setFilterToDate}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    resetModalFilters={resetModalFilters}
                />

                {/* 5. Results Count Metadata */}
                {history.length > 0 && (
                    <div className="history-modal-results-meta">
                        Showing <strong>{filteredModalHistory.length}</strong> of{' '}
                        <strong>{history.length}</strong> entries
                    </div>
                )}

                {/* 6. Scrollable History List & Empty States */}
                <SearchHistoryList
                    history={history}
                    filteredModalHistory={filteredModalHistory}
                    dateRangeError={dateRangeError}
                    resetModalFilters={resetModalFilters}
                    onSelectTerm={onSelectTerm}
                    onRemoveItem={onRemoveItem}
                />

                {/* 7. Modal Footer Row */}
                <div className="history-modal-footer-row">
                    <ClearAllButton
                        label="Clear All History"
                        variant="danger"
                        size="md"
                        onClick={onClearAllHistory}
                        disabled={history.length === 0}
                    />
                </div>
            </div>
        </Dialog>
    );
}

export default SearchHistoryModal;
