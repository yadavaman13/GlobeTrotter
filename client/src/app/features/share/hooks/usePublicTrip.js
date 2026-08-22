import { useState, useEffect, useCallback } from 'react';
import * as shareApi from '../services/share.api';
import * as tripsApi from '../../trips/services/trips.api';

export function usePublicTrip(slug) {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cloneLoading, setCloneLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPublicTrip = useCallback(async () => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        try {
            const res = await shareApi.getPublicTrip(slug);
            if (res?.success && res.trip) {
                setTrip(res.trip);
            } else {
                throw new Error(res?.message || 'Public trip not found');
            }
        } catch (err) {
            console.error('usePublicTrip error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load public trip');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchPublicTrip();
        }
    }, [slug, fetchPublicTrip]);

    const handleCloneTrip = useCallback(
        async (customTitle) => {
            if (!trip?.id) return null;
            setCloneLoading(true);
            try {
                const res = await tripsApi.cloneTrip(trip.id, { title: customTitle });
                if (res?.success && res.trip) {
                    return res.trip;
                }
                throw new Error(res?.message || 'Failed to clone trip');
            } catch (err) {
                console.error('handleCloneTrip error:', err);
                throw err;
            } finally {
                setCloneLoading(false);
            }
        },
        [trip?.id],
    );

    return {
        trip,
        loading,
        cloneLoading,
        error,
        refetch: fetchPublicTrip,
        handleCloneTrip,
    };
}

export default usePublicTrip;
