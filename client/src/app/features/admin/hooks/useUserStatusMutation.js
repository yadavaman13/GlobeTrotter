import { useState, useCallback } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { updateAdminUserStatus, cleanupExpiredUsers } from '../api/admin.api';

/**
 * Custom Hook: Executes user status changes, soft-deletes, role updates, and cleanup
 */
export function useUserStatusMutation() {
    const { updateUserInList, removeUsersFromList, setMutating } = useAdminContext();
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    const toggleActiveStatus = useCallback(
        async (user) => {
            if (!user) return;
            const newActiveState = !user.isActive;
            setActionLoading(true);
            setMutating(true);
            setActionError(null);
            try {
                const res = await updateAdminUserStatus(user.id, {
                    isActive: newActiveState,
                });
                if (res.success && res.data?.user) {
                    updateUserInList(res.data.user);
                    return { success: true, user: res.data.user };
                }
            } catch (err) {
                const msg =
                    err.response?.data?.message || err.message || 'Failed to update user status';
                setActionError(msg);
                throw new Error(msg, { cause: err });
            } finally {
                setActionLoading(false);
                setMutating(false);
            }
        },
        [updateUserInList, setMutating],
    );

    const toggleSoftDelete = useCallback(
        async (user) => {
            if (!user) return;
            const newDeleteState = !user.isDeleted;
            setActionLoading(true);
            setMutating(true);
            setActionError(null);
            try {
                const res = await updateAdminUserStatus(user.id, {
                    isDeleted: newDeleteState,
                });
                if (res.success && res.data?.user) {
                    updateUserInList(res.data.user);
                    return { success: true, user: res.data.user };
                }
            } catch (err) {
                const msg =
                    err.response?.data?.message || err.message || 'Failed to update delete state';
                setActionError(msg);
                throw new Error(msg, { cause: err });
            } finally {
                setActionLoading(false);
                setMutating(false);
            }
        },
        [updateUserInList, setMutating],
    );

    const updateUserRole = useCallback(
        async (userId, newRole) => {
            setActionLoading(true);
            setMutating(true);
            setActionError(null);
            try {
                const res = await updateAdminUserStatus(userId, {
                    role: newRole,
                });
                if (res.success && res.data?.user) {
                    updateUserInList(res.data.user);
                    return { success: true, user: res.data.user };
                }
            } catch (err) {
                const msg =
                    err.response?.data?.message || err.message || 'Failed to update user role';
                setActionError(msg);
                throw new Error(msg, { cause: err });
            } finally {
                setActionLoading(false);
                setMutating(false);
            }
        },
        [updateUserInList, setMutating],
    );

    const executeCleanup = useCallback(async () => {
        setActionLoading(true);
        setMutating(true);
        setActionError(null);
        try {
            const res = await cleanupExpiredUsers();
            if (res.success && res.deletedUsers) {
                const deletedIds = res.deletedUsers.map((u) => u.id);
                removeUsersFromList(deletedIds);
                return { success: true, count: deletedIds.length, deletedUsers: res.deletedUsers };
            }
            return { success: true, count: 0, deletedUsers: [] };
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Failed to clean up expired users';
            setActionError(msg);
            throw new Error(msg, { cause: err });
        } finally {
            setActionLoading(false);
            setMutating(false);
        }
    }, [removeUsersFromList, setMutating]);

    return {
        toggleActiveStatus,
        toggleSoftDelete,
        updateUserRole,
        executeCleanup,
        actionLoading,
        actionError,
    };
}
