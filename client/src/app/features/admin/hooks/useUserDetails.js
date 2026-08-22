import { useState, useCallback } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { fetchAdminUserById } from '../api/admin.api';

/**
 * Custom Hook: Fetch single user detailed metrics and manage details drawer
 */
export function useUserDetails() {
    const { selectedUser, setSelectedUser, updateUserInList } = useAdminContext();
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    const openUserDetails = useCallback(
        async (userSummaryOrId) => {
            const userId = typeof userSummaryOrId === 'string' ? userSummaryOrId : userSummaryOrId.id;

            // Set initial state from existing summary if available
            if (typeof userSummaryOrId === 'object') {
                setSelectedUser(userSummaryOrId);
            }

            setLoadingDetails(true);
            setDetailsError(null);
            try {
                const res = await fetchAdminUserById(userId);
                if (res.success && res.data?.user) {
                    setSelectedUser(res.data.user);
                    updateUserInList(res.data.user);
                }
            } catch (err) {
                console.error('Error fetching user details:', err);
                setDetailsError(err.response?.data?.message || err.message || 'Failed to load user details');
            } finally {
                setLoadingDetails(false);
            }
        },
        [setSelectedUser, updateUserInList],
    );

    const closeUserDetails = useCallback(() => {
        setSelectedUser(null);
        setDetailsError(null);
    }, [setSelectedUser]);

    return {
        selectedUser,
        loadingDetails,
        detailsError,
        openUserDetails,
        closeUserDetails,
    };
}
