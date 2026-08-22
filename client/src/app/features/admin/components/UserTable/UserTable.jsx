import { useMemo, useCallback } from 'react';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import Pagination from '@/components/Shared/Navigation/Pagination/Pagination';
import Button from '@/components/Shared/Buttons/Button/Button';
import { UserStatusBadge, UserRoleBadge } from '../UserStatusBadge/UserStatusBadge';
import { Eye, Shield, UserX, UserCheck, Trash2, RotateCcw, MoreVertical } from 'lucide-react';
import './UserTable.scss';

export function UserTable({
    users = [],
    pagination,
    onPageChange,
    onViewUser,
    onToggleActiveClick,
    onToggleDeleteClick,
    onRoleChangeClick,
    loading = false,
}) {
    const renderTableBody = () => {
        if (loading) {
            return (
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="skeleton-row">
                            <td>
                                <div className="skeleton-avatar" />
                            </td>
                            <td>
                                <div className="skeleton-text long" />
                            </td>
                            <td>
                                <div className="skeleton-text short" />
                            </td>
                            <td>
                                <div className="skeleton-text short" />
                            </td>
                            <td>
                                <div className="skeleton-text medium" />
                            </td>
                            <td>
                                <div className="skeleton-text actions" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            );
        }

        if (users.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={6} className="empty-table-cell">
                            <div className="empty-message">
                                <h4>No users found</h4>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody>
                {users.map((user) => {
                    const formattedDate = user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                          })
                        : '—';

                    return (
                        <tr key={user.id} className="user-table-row">
                            <td className="user-profile-cell">
                                <CircularAvatar
                                    src={user.profileImage}
                                    name={`${user.firstName || ''} ${user.lastName || ''}`}
                                    size="md"
                                />
                                <div className="user-info">
                                    <span className="user-name">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                            </td>

                            <td>
                                <UserRoleBadge role={user.role} />
                            </td>

                            <td>
                                <UserStatusBadge
                                    isActive={user.isActive}
                                    isDeleted={user.isDeleted}
                                    emailVerified={user.emailVerified}
                                />
                            </td>

                            <td>
                                <span className={`verification-text ${user.emailVerified ? 'verified' : 'unverified'}`}>
                                    {user.emailVerified ? 'Verified' : 'Pending'}
                                </span>
                            </td>

                            <td className="date-cell">{formattedDate}</td>

                            <td className="actions-cell">
                                <div className="row-actions">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onViewUser(user)}
                                        title="View Details"
                                        className="action-icon-btn"
                                    >
                                        <Eye size={16} />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleActiveClick(user)}
                                        title={user.isActive ? 'Suspend User' : 'Activate User'}
                                        className="action-icon-btn"
                                    >
                                        {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRoleChangeClick(user)}
                                        title="Change Role"
                                        className="action-icon-btn"
                                    >
                                        <Shield size={16} />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleDeleteClick(user)}
                                        title={user.isDeleted ? 'Restore Account' : 'Soft Delete'}
                                        className={`action-icon-btn ${user.isDeleted ? 'restore' : 'delete'}`}
                                    >
                                        {user.isDeleted ? <RotateCcw size={16} /> : <Trash2 size={16} />}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        );
    };

    return (
        <div className="admin-user-table-wrapper">
            <div className="table-responsive-container">
                <table className="admin-user-table">
                    <thead>
                        <tr>
                            <th>User Profile</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Email Verified</th>
                            <th>Joined Date</th>
                            <th className="th-actions">Actions</th>
                        </tr>
                    </thead>
                    {renderTableBody()}
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="table-pagination-footer">
                    <div className="pagination-info">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} users
                    </div>
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}

export default UserTable;
