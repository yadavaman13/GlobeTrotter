import { createContext, useState, useCallback, useMemo } from 'react';
import * as itineraryApi from '../services/itinerary.api';
import * as tripsApi from '../../trips/services/trips.api';

export const ItineraryContext = createContext(null);

export function ItineraryProvider({ children }) {
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [activeStopId, setActiveStopId] = useState(null);
    const [timelineData, setTimelineData] = useState(null);
    const [viewMode, setViewMode] = useState('builder'); // 'builder' | 'timeline' | 'calendar'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadItinerary = useCallback(
        async (tripId) => {
            setLoading(true);
            setError(null);
            try {
                const res = await tripsApi.getTrip(tripId);
                if (res?.success && res.trip) {
                    setTrip(res.trip);
                    const loadedStops = res.trip.stops || [];
                    setStops(loadedStops);
                    if (loadedStops.length > 0 && !activeStopId) {
                        setActiveStopId(loadedStops[0].id);
                    }
                    return res.trip;
                }
                throw new Error(res?.message || 'Trip not found');
            } catch (err) {
                console.error('loadItinerary error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load itinerary');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [activeStopId],
    );

    const handleAddStop = useCallback(
        async (stopData) => {
            if (!trip?.id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await itineraryApi.createStop(trip.id, stopData);
                if (res?.success && res.stop) {
                    const newStop = { ...res.stop, activities: [] };
                    setStops((prev) => [...prev, newStop]);
                    setActiveStopId(newStop.id);
                    // Refresh full trip to get populated city info
                    await loadItinerary(trip.id);
                    return newStop;
                }
                throw new Error(res?.message || 'Failed to add destination');
            } catch (err) {
                console.error('handleAddStop error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to add destination');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [trip?.id, loadItinerary],
    );

    const handleUpdateStop = useCallback(
        async (stopId, updates) => {
            if (!trip?.id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await itineraryApi.updateStop(trip.id, stopId, updates);
                if (res?.success && res.stop) {
                    setStops((prev) =>
                        prev.map((s) => (s.id === stopId ? { ...s, ...res.stop } : s)),
                    );
                    return res.stop;
                }
                throw new Error(res?.message || 'Failed to update destination');
            } catch (err) {
                console.error('handleUpdateStop error:', err);
                setError(
                    err.response?.data?.message || err.message || 'Failed to update destination',
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [trip?.id],
    );

    const handleDeleteStop = useCallback(
        async (stopId) => {
            if (!trip?.id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await itineraryApi.deleteStop(trip.id, stopId);
                if (res?.success) {
                    setStops((prev) => prev.filter((s) => s.id !== stopId));
                    if (activeStopId === stopId) {
                        setActiveStopId(null);
                    }
                    return true;
                }
                throw new Error(res?.message || 'Failed to remove destination');
            } catch (err) {
                console.error('handleDeleteStop error:', err);
                setError(
                    err.response?.data?.message || err.message || 'Failed to remove destination',
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [trip?.id, activeStopId],
    );

    const handleReorderStops = useCallback(
        async (reorderedStops) => {
            if (!trip?.id) return;
            // Optimistic update
            setStops(reorderedStops);
            try {
                const stopOrders = reorderedStops.map((stop, idx) => ({
                    id: stop.id,
                    sequenceOrder: idx + 1,
                }));
                await itineraryApi.reorderStops(trip.id, stopOrders);
            } catch (err) {
                console.error('handleReorderStops error:', err);
                // Revert on error
                await loadItinerary(trip.id);
            }
        },
        [trip?.id, loadItinerary],
    );

    const handleAddActivity = useCallback(
        async (stopId, activityData) => {
            if (!trip?.id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await itineraryApi.createActivity(trip.id, stopId, activityData);
                if (res?.success && res.activity) {
                    setStops((prev) =>
                        prev.map((s) => {
                            if (s.id === stopId) {
                                return {
                                    ...s,
                                    activities: [...(s.activities || []), res.activity],
                                };
                            }
                            return s;
                        }),
                    );
                    // Refresh trip to sync hydrated activity details
                    await loadItinerary(trip.id);
                    return res.activity;
                }
                throw new Error(res?.message || 'Failed to add activity');
            } catch (err) {
                console.error('handleAddActivity error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to add activity');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [trip?.id, loadItinerary],
    );

    const handleUpdateActivity = useCallback(
        async (stopId, activityId, updates) => {
            if (!trip?.id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await itineraryApi.updateActivity(trip.id, stopId, activityId, updates);
                if (res?.success && res.activity) {
                    setStops((prev) =>
                        prev.map((s) => {
                            if (s.id === stopId) {
                                return {
                                    ...s,
                                    activities: (s.activities || []).map((a) =>
                                        a.id === activityId ? { ...a, ...res.activity } : a,
                                    ),
                                };
                            }
                            return s;
                        }),
                    );
                    return res.activity;
                }
                throw new Error(res?.message || 'Failed to update activity');
            } catch (err) {
                console.error('handleUpdateActivity error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to update activity');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [trip],
    );

    const handleDeleteActivity = useCallback(
        async (stopId, activityId) => {
            if (!trip?.id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await itineraryApi.deleteActivity(trip.id, stopId, activityId);
                if (res?.success) {
                    setStops((prev) =>
                        prev.map((s) => {
                            if (s.id === stopId) {
                                return {
                                    ...s,
                                    activities: (s.activities || []).filter(
                                        (a) => a.id !== activityId,
                                    ),
                                };
                            }
                            return s;
                        }),
                    );
                    return true;
                }
                throw new Error(res?.message || 'Failed to remove activity');
            } catch (err) {
                console.error('handleDeleteActivity error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to remove activity');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [trip],
    );

    const handleReorderActivities = useCallback(
        async (stopId, reorderedActivities) => {
            if (!trip?.id) return;
            // Optimistic update
            setStops((prev) =>
                prev.map((s) => (s.id === stopId ? { ...s, activities: reorderedActivities } : s)),
            );
            try {
                const activityOrders = reorderedActivities.map((act, idx) => ({
                    id: act.id,
                    sequenceOrder: idx + 1,
                }));
                await itineraryApi.reorderActivities(trip.id, stopId, activityOrders);
            } catch (err) {
                console.error('handleReorderActivities error:', err);
                await loadItinerary(trip.id);
            }
        },
        [trip, loadItinerary],
    );

    const loadTimeline = useCallback(async (tripId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await itineraryApi.getTripTimeline(tripId);
            if (res?.success && res.data) {
                setTimelineData(res.data);
                return res.data;
            }
            throw new Error(res?.message || 'Failed to load timeline');
        } catch (err) {
            console.error('loadTimeline error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load timeline');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            trip,
            setTrip,
            stops,
            setStops,
            activeStopId,
            setActiveStopId,
            timelineData,
            viewMode,
            setViewMode,
            loading,
            error,
            loadItinerary,
            handleAddStop,
            handleUpdateStop,
            handleDeleteStop,
            handleReorderStops,
            handleAddActivity,
            handleUpdateActivity,
            handleDeleteActivity,
            handleReorderActivities,
            loadTimeline,
        }),
        [
            trip,
            stops,
            activeStopId,
            timelineData,
            viewMode,
            loading,
            error,
            loadItinerary,
            handleAddStop,
            handleUpdateStop,
            handleDeleteStop,
            handleReorderStops,
            handleAddActivity,
            handleUpdateActivity,
            handleDeleteActivity,
            handleReorderActivities,
            loadTimeline,
        ],
    );

    return <ItineraryContext.Provider value={contextValue}>{children}</ItineraryContext.Provider>;
}

export default ItineraryProvider;
