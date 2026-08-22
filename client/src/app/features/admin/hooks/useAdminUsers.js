import { useEffect, useCallback, useRef } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { fetchAdminUsers } from '../api/admin.api';

/**
 * Custom Hook: Orchestrates user list fetching, search debouncing, and pagination
 */
export function useAdminUsers() {
    const {
        users,
        pagination,
        setUsers,
        setPagination,
        filters,
        updateFilterField,
        resetFilters,
        setPage,
        loading,
        setLoading,
        error,
        setError,
    } = useAdminContext();

    const debounceTimerRef = useRef(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAdminUsers({
                page: pagination.page,
                limit: pagination.limit,
                search: filters.search,
                role: filters.role,
                isActive: filters.isActive,
                isDeleted: filters.isDeleted,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            });

            if (res.success && res.data) {
                setUsers(res.data.users || []);
                setPagination(res.data.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 });
            }
        } catch (err) {
            console.error('Error fetching admin users:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [
        pagination.page,
        pagination.limit,
        filters.search,
        filters.role,
        filters.isActive,
        filters.isDeleted,
        filters.sortBy,
        filters.sortOrder,
        setUsers,
        setPagination,
        setLoading,
        setError,
    ]);

    // Handle debounced search vs instant filter changes
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            loadUsers();
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [loadUsers]);

    return {
        users,
        pagination,
        filters,
        updateFilterField,
        resetFilters,
        setPage,
        loading,
        error,
        refetch: loadUsers,
    };
}
