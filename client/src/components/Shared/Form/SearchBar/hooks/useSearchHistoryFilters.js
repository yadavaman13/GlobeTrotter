import { useState, useMemo } from 'react';

/**
 * Custom hook for history filtering, date range validation, and sorting.
 */
export function useSearchHistoryFilters(history = []) {
    const [modalTextQuery, setModalTextQuery] = useState('');
    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

    const resetModalFilters = () => {
        setModalTextQuery('');
        setFilterFromDate(null);
        setFilterToDate(null);
        setSortOrder('newest');
    };

    // Date range validation
    const dateRangeError = useMemo(() => {
        if (!filterFromDate || !filterToDate) return null;
        const from = new Date(filterFromDate);
        const to = new Date(filterToDate);
        if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
        if (to < from) return '"To" date must be after "From" date.';
        return null;
    }, [filterFromDate, filterToDate]);

    const futureDateWarning = useMemo(() => {
        const now = new Date();
        if (filterFromDate && new Date(filterFromDate) > now) {
            return 'The "From" date is in the future — no history entries will match.';
        }
        return null;
    }, [filterFromDate]);

    // Filtered + sorted history
    const filteredModalHistory = useMemo(() => {
        if (dateRangeError) return [];

        const from = filterFromDate ? new Date(filterFromDate) : null;
        const to = filterToDate ? new Date(filterToDate) : null;

        if (to) to.setHours(23, 59, 59, 999);

        let result = history.filter((h) => {
            const textMatch =
                !modalTextQuery || h.term.toLowerCase().includes(modalTextQuery.toLowerCase());
            const itemDate = new Date(h.timestamp);
            const fromMatch = !from || itemDate >= from;
            const toMatch = !to || itemDate <= to;
            return textMatch && fromMatch && toMatch;
        });

        result = [...result].sort((a, b) => {
            return sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
        });

        return result;
    }, [history, modalTextQuery, filterFromDate, filterToDate, sortOrder, dateRangeError]);

    const hasActiveFilters = Boolean(
        modalTextQuery || filterFromDate || filterToDate || sortOrder !== 'newest',
    );

    return {
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
    };
}
