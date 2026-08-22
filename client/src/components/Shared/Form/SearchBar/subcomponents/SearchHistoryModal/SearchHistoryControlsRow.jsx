import { ArrowUpDown as SortIcon } from 'lucide-react';
import DateTimePicker from '@/components/Shared/Form/DateTimePicker/DateTimePicker';

/**
 * Search History Controls Row (Date Range & Sort) Subcomponent
 */
function SearchHistoryControlsRow({
    filterFromDate,
    setFilterFromDate,
    filterToDate,
    setFilterToDate,
    sortOrder,
    setSortOrder,
}) {
    return (
        <div className="history-modal-controls-row">
            <div className="history-modal-date-pickers">
                <div className="history-modal-date-field">
                    <span className="history-date-field-label">From</span>
                    <DateTimePicker
                        value={filterFromDate}
                        onChange={setFilterFromDate}
                        placeholder="Start date..."
                        showTime={false}
                        clearable={true}
                        className="history-dtp"
                    />
                </div>

                <span className="history-date-separator">—</span>

                <div className="history-modal-date-field">
                    <span className="history-date-field-label">To</span>
                    <DateTimePicker
                        value={filterToDate}
                        onChange={setFilterToDate}
                        placeholder="End date..."
                        showTime={false}
                        clearable={true}
                        className="history-dtp"
                    />
                </div>
            </div>

            {/* Sort toggle */}
            <div className="history-modal-sort-group">
                <span className="history-sort-label">
                    <SortIcon size={14} /> Sort
                </span>
                <div className="history-sort-toggle">
                    <button
                        type="button"
                        className={`sort-btn ${sortOrder === 'newest' ? 'active' : ''}`}
                        onClick={() => setSortOrder('newest')}
                    >
                        Newest
                    </button>
                    <button
                        type="button"
                        className={`sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                        onClick={() => setSortOrder('oldest')}
                    >
                        Oldest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchHistoryControlsRow;
