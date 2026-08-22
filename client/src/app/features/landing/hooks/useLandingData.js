import { useState, useEffect } from 'react';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import * as landingService from '../services/landing.service';

export function useLandingData() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('Europe');
    const [cities, setCities] = useState([]);
    const [upcomingTrip, setUpcomingTrip] = useState(null);
    const [previousTrips, setPreviousTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cities by region
    useEffect(() => {
        let isMounted = true;
        const fetchCities = async () => {
            try {
                const res = await landingService.getCities({
                    region: selectedRegion,
                    limit: 5,
                });
                if (isMounted) {
                    setCities(res.data?.cities || []);
                }
            } catch (err) {
                console.error('Error fetching regional selections:', err);
            }
        };

        fetchCities();
        return () => {
            isMounted = false;
        };
    }, [selectedRegion]);

    // Fetch user's trips if logged in
    useEffect(() => {
        if (!user) {
            setTimeout(() => {
                setUpcomingTrip(null);
                setPreviousTrips([]);
            }, 0);
            return;
        }

        let isMounted = true;
        const fetchUserTrips = async () => {
            try {
                setLoading(true);
                const res = await landingService.getTrips();
                if (isMounted) {
                    const allTrips = res.trips || [];

                    // Upcoming Trip: First trip that is planned or ongoing
                    const upcoming = allTrips.find(
                        (t) => t.status === 'planned' || t.status === 'ongoing',
                    );
                    setUpcomingTrip(upcoming || null);

                    // Previous Trips: All trips that are completed
                    const completed = allTrips.filter((t) => t.status === 'completed');
                    setPreviousTrips(completed);
                }
            } catch (err) {
                console.error('Error fetching user trips:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to load trips');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUserTrips();
        return () => {
            isMounted = false;
        };
    }, [user]);

    // Debounced search logic for destinations
    useEffect(() => {
        if (!searchQuery.trim()) {
            setTimeout(() => {
                setSearchSuggestions([]);
            }, 0);
            return;
        }

        const handler = setTimeout(async () => {
            try {
                const res = await landingService.getCities({
                    q: searchQuery,
                    limit: 10,
                });
                setSearchSuggestions(res.data?.cities || []);
            } catch (err) {
                console.error('Search query failed:', err);
            }
        }, 300); // 300ms debounce loop

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    return {
        user,
        searchQuery,
        setSearchQuery,
        searchSuggestions,
        selectedRegion,
        setSelectedRegion,
        cities,
        upcomingTrip,
        previousTrips,
        loading,
        error,
    };
}
