import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import * as landingService from '../services/landing.service';

export function useLandingData() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Heritage');
    const [mapViewEnabled, setMapViewEnabled] = useState(true);
    const [activities, setActivities] = useState([]);
    const [cities, setCities] = useState([]);
    const [savedCityIds, setSavedCityIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch activities directly from database via backend API
    const fetchActivities = useCallback(async (query, category) => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (query && query.trim()) params.q = query.trim();
            if (category && category !== 'All') params.activityType = category.toLowerCase();

            const res = await landingService.getActivities(params);
            const fetched = res.data?.activities || res.activities || [];

            setActivities(
                fetched.map((act) => ({
                    id: act.id,
                    name: act.name,
                    description: act.description || '',
                    activityType: act.activityType || 'Sightseeing',
                    location: act.city ? `${act.city.name}, ${act.city.country}` : 'Global',
                    rating: 4.8,
                    badge: act.activityType || 'Popular',
                    tags: [act.activityType || 'Activity', `${act.durationMinutes || 60} Mins`],
                    imageUrl: act.images && act.images.length > 0 ? act.images[0].imageUrl : '',
                })),
            );
        } catch (err) {
            console.error('Failed to fetch activities from database:', err);
            setError(err.message || 'Failed to fetch activities');
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch and category change
    useEffect(() => {
        fetchActivities(searchQuery, selectedCategory);
    }, [selectedCategory, fetchActivities]);

    // 300ms Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchActivities(searchQuery, selectedCategory);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery, selectedCategory, fetchActivities]);

    // Fetch saved destinations for logged-in user
    useEffect(() => {
        if (!user) return;
        let isMounted = true;

        const loadSaved = async () => {
            try {
                const res = await landingService.getSavedDestinations();
                if (isMounted && res.data?.savedDestinations) {
                    setSavedCityIds(res.data.savedDestinations.map((d) => d.id || d.cityId));
                }
            } catch (err) {
                console.error('Error fetching saved destinations:', err);
            }
        };

        loadSaved();
        return () => {
            isMounted = false;
        };
    }, [user]);

    // Toggle save / bookmark
    const toggleSaveCity = async (cityId) => {
        if (!user) return false;
        const isSaved = savedCityIds.includes(cityId);
        try {
            if (isSaved) {
                await landingService.removeSavedDestination(cityId);
                setSavedCityIds((prev) => prev.filter((id) => id !== cityId));
            } else {
                await landingService.saveDestination(cityId);
                setSavedCityIds((prev) => [...prev, cityId]);
            }
            return true;
        } catch (err) {
            console.error('Failed to toggle save destination:', err);
            return false;
        }
    };

    return {
        user,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        mapViewEnabled,
        setMapViewEnabled,
        activities,
        cities,
        savedCityIds,
        toggleSaveCity,
        loading,
        error,
    };
}
