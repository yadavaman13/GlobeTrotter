import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchPlatformAnalytics, downloadAnalyticsReport } from '../services/analytics.api';

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [timeframe, setTimeframe] = useState('30d'); // '7d' | '30d' | 'ytd'
    const [searchQuery, setSearchQuery] = useState('');

    const loadAnalytics = useCallback(
        async (isSilentRefresh = false, overrideTimeframe = timeframe, overrideSearch = searchQuery) => {
            if (isSilentRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            try {
                const res = await fetchPlatformAnalytics({
                    timeframe: overrideTimeframe,
                    search: overrideSearch,
                });
                if (res.success && res.data?.analytics) {
                    setAnalytics(res.data.analytics);
                    setLastUpdated(new Date());
                }
            } catch (err) {
                console.error('Error loading platform analytics:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load analytics');
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [timeframe, searchQuery],
    );

    // Fetch on timeframe changes
    useEffect(() => {
        loadAnalytics(false, timeframe, searchQuery);
    }, [timeframe]);

    const handleTimeframeChange = useCallback(
        (newTf) => {
            setTimeframe(newTf);
        },
        [],
    );

    const handleExport = useCallback(
        (format = 'json') => {
            downloadAnalyticsReport(format, analytics);
        },
        [analytics],
    );

    const value = {
        analytics,
        loading,
        refreshing,
        error,
        lastUpdated,
        timeframe,
        searchQuery,
        setTimeframe: handleTimeframeChange,
        setSearchQuery,
        refreshAnalytics: () => loadAnalytics(true, timeframe, searchQuery),
        exportReport: handleExport,
    };

    return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalyticsContext() {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
    }
    return context;
}

