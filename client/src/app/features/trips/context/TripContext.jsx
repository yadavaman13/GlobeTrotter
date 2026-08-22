import { createContext, useState, useCallback, useMemo } from 'react';
import * as tripsApi from '../services/trips.api';

export const TripContext = createContext(null);

export function TripProvider({ children }) {
    const [trips, setTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        sortBy: 'createdAt',
        order: 'desc',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrips = useCallback(
        async (customParams = {}) => {
            setLoading(true);
            setError(null);
            try {
                const query = {
                    ...filters,
                    ...customParams,
                };
                if (query.status === 'all') delete query.status;
                const res = await tripsApi.listTrips(query);
                if (res?.success) {
                    setTrips(res.trips || []);
                    if (res.pagination) {
                        setPagination(res.pagination);
                    }
                }
                return res;
            } catch (err) {
                console.error('fetchTrips error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch trips');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    const fetchTripById = useCallback(async (tripId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await tripsApi.getTrip(tripId);
            if (res?.success && res.trip) {
                setActiveTrip(res.trip);
                return res.trip;
            }
            return null;
        } catch (err) {
            console.error('fetchTripById error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch trip details');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreateTrip = useCallback(async (tripData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await tripsApi.createTrip(tripData);
            if (res?.success && res.trip) {
                setTrips((prev) => [res.trip, ...prev]);
                setActiveTrip(res.trip);
                return res.trip;
            }
            throw new Error(res?.message || 'Failed to create trip');
        } catch (err) {
            console.error('handleCreateTrip error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create trip');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpdateTrip = useCallback(async (tripId, updates) => {
        setLoading(true);
        setError(null);
        try {
            const res = await tripsApi.updateTrip(tripId, updates);
            if (res?.success && res.trip) {
                setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, ...res.trip } : t)));
                setActiveTrip((prev) => (prev?.id === tripId ? { ...prev, ...res.trip } : prev));
                return res.trip;
            }
            throw new Error(res?.message || 'Failed to update trip');
        } catch (err) {
            console.error('handleUpdateTrip error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update trip');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteTrip = useCallback(
        async (tripId) => {
            setLoading(true);
            setError(null);
            try {
                const res = await tripsApi.deleteTrip(tripId);
                if (res?.success) {
                    setTrips((prev) => prev.filter((t) => t.id !== tripId));
                    if (activeTrip?.id === tripId) {
                        setActiveTrip(null);
                    }
                    return true;
                }
                throw new Error(res?.message || 'Failed to delete trip');
            } catch (err) {
                console.error('handleDeleteTrip error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to delete trip');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [activeTrip],
    );

    const handleCloneTrip = useCallback(async (tripId, customTitle) => {
        setLoading(true);
        setError(null);
        try {
            const res = await tripsApi.cloneTrip(tripId, { title: customTitle });
            if (res?.success && res.trip) {
                setTrips((prev) => [res.trip, ...prev]);
                return res.trip;
            }
            throw new Error(res?.message || 'Failed to clone trip');
        } catch (err) {
            console.error('handleCloneTrip error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to clone trip');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleVisibility = useCallback(async (tripId, visibility) => {
        setLoading(true);
        setError(null);
        try {
            const res = await tripsApi.updateTripVisibility(tripId, visibility);
            if (res?.success && res.trip) {
                setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, ...res.trip } : t)));
                setActiveTrip((prev) => (prev?.id === tripId ? { ...prev, ...res.trip } : prev));
                return res.trip;
            }
            throw new Error(res?.message || 'Failed to update visibility');
        } catch (err) {
            console.error('handleToggleVisibility error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update visibility');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            trips,
            setTrips,
            activeTrip,
            setActiveTrip,
            pagination,
            filters,
            setFilters,
            loading,
            error,
            fetchTrips,
            fetchTripById,
            handleCreateTrip,
            handleUpdateTrip,
            handleDeleteTrip,
            handleCloneTrip,
            handleToggleVisibility,
        }),
        [
            trips,
            activeTrip,
            pagination,
            filters,
            loading,
            error,
            fetchTrips,
            fetchTripById,
            handleCreateTrip,
            handleUpdateTrip,
            handleDeleteTrip,
            handleCloneTrip,
            handleToggleVisibility,
        ],
    );

    return <TripContext.Provider value={contextValue}>{children}</TripContext.Provider>;
}

export default TripProvider;
