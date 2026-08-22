import { useState, useRef } from 'react';
import { makeId, makeSeedHistory } from './utils/searchBarUtils';
import { useAnimatedPlaceholder } from './hooks/useAnimatedPlaceholder';
import { useSearchHistoryFilters } from './hooks/useSearchHistoryFilters';
import { useClickOutside } from '@/hooks/useClickOutside';
import SearchInputRow from './subcomponents/SearchInputRow';
import SearchHistoryDropdown from './subcomponents/SearchHistoryDropdown';
import SearchHistoryModal from './subcomponents/SearchHistoryModal';
import Dialog from '@/components/Shared/Feedback/Dialog';
import './SearchBar.scss';

/**
 * Modular SearchBar Component
 */
function SearchBar({
    value = '',
    onChange,
    onClear,
    placeholder = 'Search...',
    placeholderPrefix = 'Search by ',
    placeholderOptions = [],
    placeholderInterval = 3500,
    showFilter = false,
    isFilterActive = false,
    onFilterClick,
    showHistory = true,
    className = '',
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [history, setHistory] = useState(makeSeedHistory);
    const searchbarRef = useRef(null);

    // Animated placeholder options cycling hook
    const { currentIndex, prevIndex, hasAnimatedOptions } = useAnimatedPlaceholder(
        placeholderOptions,
        placeholderInterval,
    );

    // Search history filtering & sorting hook
    const {
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
        filteredModalHistory,
        hasActiveFilters,
    } = useSearchHistoryFilters(history);

    // Click outside listener to close dropdown
    useClickOutside(searchbarRef, () => setIsFocused(false), { enabled: isFocused });

    // Event Handlers
    const handleClear = () => {
        if (onClear) {
            onClear();
        } else if (onChange) {
            onChange({ target: { value: '' } });
        }
    };

    const addToHistory = (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        setHistory((prev) => {
            const filtered = prev.filter((h) => h.term.toLowerCase() !== trimmed.toLowerCase());
            return [{ id: makeId(), term: trimmed, timestamp: Date.now() }, ...filtered];
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (value) addToHistory(value);
            setIsFocused(false);
        }
    };

    const handleSelectHistoryItem = (term) => {
        if (onChange) onChange({ target: { value: term } });
        addToHistory(term);
        setIsFocused(false);
        setIsModalOpen(false);
    };

    const handleRemoveHistoryItem = (e, id) => {
        e.stopPropagation();
        setHistory((prev) => prev.filter((h) => h.id !== id));
    };

    const [isClearHistoryConfirmOpen, setIsClearHistoryConfirmOpen] = useState(false);

    const handleClearAllHistory = (e) => {
        e?.stopPropagation();
        setIsClearHistoryConfirmOpen(true);
    };

    const confirmClearAllHistory = () => {
        setHistory([]);
        resetModalFilters();
        setIsModalOpen(false);
        setIsClearHistoryConfirmOpen(false);
    };

    const handleOpenModal = () => {
        setIsFocused(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetModalFilters();
    };

    return (
        <>
            <div className={`searchbar-container ${className}`} ref={searchbarRef}>
                <SearchInputRow
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onClear={handleClear}
                    placeholder={placeholder}
                    placeholderPrefix={placeholderPrefix}
                    placeholderOptions={placeholderOptions}
                    hasAnimatedOptions={hasAnimatedOptions}
                    currentIndex={currentIndex}
                    prevIndex={prevIndex}
                    isFocused={isFocused}
                    showFilter={showFilter}
                    isFilterActive={isFilterActive}
                    onFilterClick={onFilterClick}
                />

                {/* Inline dropdown - renders only when focused and value is empty */}
                {showHistory && isFocused && !value && (
                    <SearchHistoryDropdown
                        history={history}
                        onSelectTerm={handleSelectHistoryItem}
                        onRemoveItem={handleRemoveHistoryItem}
                        onClearAll={handleClearAllHistory}
                        onOpenModal={handleOpenModal}
                    />
                )}
            </div>

            {/* History Modal Dialog */}
            <SearchHistoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                history={history}
                filteredModalHistory={filteredModalHistory}
                modalTextQuery={modalTextQuery}
                setModalTextQuery={setModalTextQuery}
                filterFromDate={filterFromDate}
                setFilterFromDate={setFilterFromDate}
                filterToDate={filterToDate}
                setFilterToDate={setFilterToDate}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                resetModalFilters={resetModalFilters}
                dateRangeError={dateRangeError}
                futureDateWarning={futureDateWarning}
                hasActiveFilters={hasActiveFilters}
                onSelectTerm={handleSelectHistoryItem}
                onRemoveItem={handleRemoveHistoryItem}
                onClearAllHistory={handleClearAllHistory}
            />

            {/* Clear Search History Confirmation Dialog */}
            <Dialog
                isOpen={isClearHistoryConfirmOpen}
                onClose={() => setIsClearHistoryConfirmOpen(false)}
                title="Clear Search History"
                variant="danger"
                size="sm"
                confirmText="Clear All History"
                cancelText="Cancel"
                onConfirm={confirmClearAllHistory}
            >
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.5 }}>
                    Are you sure you want to clear all recent search history entries? This action
                    cannot be undone.
                </p>
            </Dialog>
        </>
    );
}

export default SearchBar;
