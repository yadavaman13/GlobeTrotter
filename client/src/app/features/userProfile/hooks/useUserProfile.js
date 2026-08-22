import { useContext, useCallback } from 'react';
import { UserProfileContext } from '../context/userProfile.context';
import * as userProfileApi from '../services/userProfile.api';

export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }

    const {
        setTrips,
        setDashboardData,
        setLoading,
        setError,
        setPagination,
        setIsMock,
        mockTripsList,
    } = context;

    /**
     * Load all trips for the authenticated user, falling back to mockup seeds if empty
     * @param {object} params - query parameters like search, status, sortBy, order, page, limit
     */
    const loadTrips = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userProfileApi.fetchTrips(params);
                const backendTrips = data.trips || [];

                if (backendTrips.length === 0) {
                    // Database has no trips. Inject premium mockup seeds for visual presentation
                    setIsMock(true);

                    // Apply filters client-side on mock data to make UI interactive
                    let filteredMock = [...mockTripsList];

                    const query = (params.search || params.q || '').toLowerCase().trim();
                    if (query) {
                        filteredMock = filteredMock.filter(
                            (t) =>
                                t.name.toLowerCase().includes(query) ||
                                t.destination.toLowerCase().includes(query),
                        );
                    }

                    if (params.status) {
                        filteredMock = filteredMock.filter((t) => t.status === params.status);
                    }

                    setTrips(filteredMock);
                    setPagination({
                        page: 1,
                        limit: params.limit || 20,
                        total: filteredMock.length,
                        totalPages: 1,
                    });
                } else {
                    // Database has real data. Use backend response directly
                    setIsMock(false);
                    setTrips(backendTrips);
                    setPagination(
                        data.pagination || { page: 1, limit: 20, total: backendTrips.length },
                    );
                }
                return data;
            } catch (err) {
                console.error('Error fetching user trips:', err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch trips');
                // Even on error, fall back to mock data so UI remains beautiful
                setIsMock(true);
                setTrips(mockTripsList);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setTrips, setLoading, setError, setPagination, setIsMock, mockTripsList],
    );

    /**
     * Load user dashboard highlights
     */
    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userProfileApi.fetchDashboardData();
            setDashboardData(data.data || data);
            return data;
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to load dashboard metrics',
            );
        } finally {
            setLoading(false);
        }
    }, [setDashboardData, setLoading, setError]);

    return {
        loadTrips,
        loadDashboard,
    };
}
