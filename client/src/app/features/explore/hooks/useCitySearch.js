import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks';
import * as exploreApi from '../services/explore.api';

export function useCitySearch(initialSearch = '') {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        let isMounted = true;

        async function fetchCities() {
            setLoading(true);
            setError(null);
            try {
                const res = await exploreApi.searchCities({
                    q: debouncedSearch ? debouncedSearch.trim() : undefined,
                    limit: 15,
                });
                if (isMounted && res?.success) {
                    const cityList = res.data?.cities || res.cities || res.data || [];
                    setCities(cityList);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('useCitySearch error:', err);
                    setError(
                        err.response?.data?.message || err.message || 'Failed to search cities',
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchCities();

        return () => {
            isMounted = false;
        };
    }, [debouncedSearch]);

    return {
        searchTerm,
        setSearchTerm,
        cities,
        loading,
        error,
    };
}

export default useCitySearch;
