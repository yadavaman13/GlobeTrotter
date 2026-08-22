import { useState } from 'react';
import { AdminProvider } from '../context/AdminContext';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useUserDetails } from '../hooks/useUserDetails';
import { useUserStatusMutation } from '../hooks/useUserStatusMutation';
import UserFilters from '../components/UserFilters/UserFilters';
import UserTable from '../components/UserTable/UserTable';
import UserDetailsDrawer from '../components/UserDetailsDrawer/UserDetailsDrawer';
import {
    StatusChangeDialog,
    RoleChangeDialog,
    DeleteUserDialog,
    CleanupUsersDialog,
} from '../components/UserActionDialogs/UserActionDialogs';
import Drawer from '@/components/Shared/Feedback/Drawer/Drawer';
import { Users as UsersIcon, ShieldCheck } from 'lucide-react';
import './AdminUsersPage.scss';

function AdminUsersContent() {
    const {
        users,
        pagination,
        filters,
        updateFilterField,
        resetFilters,
        setPage,
        loading,
        error,
        refetch,
    } = useAdminUsers();

    const {
        selectedUser,
        loadingDetails,
        openUserDetails,
        closeUserDetails,
    } = useUserDetails();

    const {
        toggleActiveStatus,
        toggleSoftDelete,
        updateUserRole,
        executeCleanup,
        actionLoading,
    } = useUserStatusMutation();

    // Modal dialog state handlers
    const [statusModalUser, setStatusModalUser] = useState(null);
    const [roleModalUser, setRoleModalUser] = useState(null);
    const [deleteModalUser, setDeleteModalUser] = useState(null);
    const [showCleanupModal, setShowCleanupModal] = useState(false);

    // Confirm callbacks
    const handleConfirmStatus = async (user) => {
        try {
            await toggleActiveStatus(user);
            setStatusModalUser(null);
        } catch (err) {
            console.error('Status toggle failed:', err);
        }
    };

    const handleConfirmRole = async (userId, role) => {
        try {
            await updateUserRole(userId, role);
            setRoleModalUser(null);
        } catch (err) {
            console.error('Role update failed:', err);
        }
    };

    const handleConfirmDelete = async (user) => {
        try {
            await toggleSoftDelete(user);
            setDeleteModalUser(null);
        } catch (err) {
            console.error('Delete toggle failed:', err);
        }
    };

    const handleConfirmCleanup = async () => {
        try {
            await executeCleanup();
            setShowCleanupModal(false);
        } catch (err) {
            console.error('Cleanup failed:', err);
        }
    };

    return (
        <div className="admin-users-page-container">
            <div className="admin-page-header">
                <div className="title-group">
                    <div className="icon-wrapper">
                        <UsersIcon size={24} />
                    </div>
                    <div>
                        <h1 className="page-title">User Account Management</h1>
                        <p className="page-subtitle">
                            Oversee registered traveler accounts, permissions, account verification, and status.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="admin-error-banner">
                    <span>{error}</span>
                </div>
            )}

            <UserFilters
                filters={filters}
                onFilterChange={updateFilterField}
                onResetFilters={resetFilters}
                onOpenCleanupDialog={() => setShowCleanupModal(true)}
                loading={loading}
            />

            <UserTable
                users={users}
                pagination={pagination}
                onPageChange={setPage}
                onViewUser={openUserDetails}
                onToggleActiveClick={(u) => setStatusModalUser(u)}
                onToggleDeleteClick={(u) => setDeleteModalUser(u)}
                onRoleChangeClick={(u) => setRoleModalUser(u)}
                loading={loading}
            />

            {/* Slide-out User Profile & Stats Drawer */}
            <Drawer
                isOpen={Boolean(selectedUser)}
                onClose={closeUserDetails}
                title="Traveler Profile & Activity"
                subtitle={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
                size="md"
            >
                {selectedUser && (
                    <UserDetailsDrawer
                        user={selectedUser}
                        onClose={closeUserDetails}
                        onToggleActive={(u) => setStatusModalUser(u)}
                        onToggleDelete={(u) => setDeleteModalUser(u)}
                        onChangeRole={(u) => setRoleModalUser(u)}
                        actionLoading={actionLoading}
                    />
                )}
            </Drawer>

            {/* Interactive Confirmation Modals */}
            <StatusChangeDialog
                isOpen={Boolean(statusModalUser)}
                user={statusModalUser}
                onClose={() => setStatusModalUser(null)}
                onConfirm={handleConfirmStatus}
                loading={actionLoading}
            />

            <RoleChangeDialog
                isOpen={Boolean(roleModalUser)}
                user={roleModalUser}
                onClose={() => setRoleModalUser(null)}
                onConfirm={handleConfirmRole}
                loading={actionLoading}
            />

            <DeleteUserDialog
                isOpen={Boolean(deleteModalUser)}
                user={deleteModalUser}
                onClose={() => setDeleteModalUser(null)}
                onConfirm={handleConfirmDelete}
                loading={actionLoading}
            />

            <CleanupUsersDialog
                isOpen={showCleanupModal}
                onClose={() => setShowCleanupModal(false)}
                onConfirm={handleConfirmCleanup}
                loading={actionLoading}
            />
        </div>
    );
}

export default function AdminUsersPage() {
    return (
        <AdminProvider>
            <AdminUsersContent />
        </AdminProvider>
    );
}
