import { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        isActive: '',
        isDeleted: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mutating, setMutating] = useState(false);
    const [error, setError] = useState(null);

    const updateFilterField = useCallback((field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Reset to page 1 whenever search/filter criteria change
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            role: '',
            isActive: '',
            isDeleted: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, []);

    const setPage = useCallback((pageNumber) => {
        setPagination((prev) => ({
            ...prev,
            page: pageNumber,
        }));
    }, []);

    const updateUserInList = useCallback((updatedUser) => {
        if (!updatedUser || !updatedUser.id) return;
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)),
        );
        setSelectedUser((prev) =>
            prev && prev.id === updatedUser.id ? { ...prev, ...updatedUser } : prev,
        );
    }, []);

    const removeUsersFromList = useCallback((deletedUserIds) => {
        const idSet = new Set(deletedUserIds);
        setUsers((prev) => prev.filter((u) => !idSet.has(u.id)));
        setPagination((prev) => ({
            ...prev,
            total: Math.max(0, prev.total - deletedUserIds.length),
        }));
    }, []);

    const value = {
        users,
        setUsers,
        pagination,
        setPagination,
        filters,
        setFilters,
        updateFilterField,
        resetFilters,
        setPage,
        selectedUser,
        setSelectedUser,
        loading,
        setLoading,
        mutating,
        setMutating,
        error,
        setError,
        updateUserInList,
        removeUsersFromList,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
}
