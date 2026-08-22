import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks';
import * as exploreApi from '../services/explore.api';

export function useActivitySearch({ cityId, category, initialSearch = '' } = {}) {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        let isMounted = true;

        async function fetchActivities() {
            setLoading(true);
            setError(null);
            try {
                let res;
                if (cityId && !debouncedSearch && !category) {
                    res = await exploreApi.getCityActivities(cityId);
                } else {
                    res = await exploreApi.searchActivities({
                        search: debouncedSearch || undefined,
                        cityId: cityId || undefined,
                        activityType: category || undefined,
                        limit: 20,
                    });
                }
                if (isMounted && res?.success) {
                    setActivities(res.activities || res.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('useActivitySearch error:', err);
                    setError(
                        err.response?.data?.message || err.message || 'Failed to search activities',
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchActivities();

        return () => {
            isMounted = false;
        };
    }, [cityId, category, debouncedSearch]);

    return {
        searchTerm,
        setSearchTerm,
        activities,
        loading,
        error,
    };
}

export default useActivitySearch;
