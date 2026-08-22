import { User, Mail, Calendar, Compass, Bookmark, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import Button from '@/components/Shared/Buttons/Button/Button';
import { UserStatusBadge, UserRoleBadge } from '../UserStatusBadge/UserStatusBadge';
import './UserDetailsDrawer.scss';

export function UserDetailsDrawer({
    user,
    onClose,
    onToggleActive,
    onToggleDelete,
    onChangeRole,
    actionLoading,
}) {
    if (!user) return null;

    const formattedCreatedAt = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : 'N/A';

    const formattedDeletedAt = user.deletedAt
        ? new Date(user.deletedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : null;

    const formattedRecoveryExpires = user.recoveryExpiresAt
        ? new Date(user.recoveryExpiresAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : null;

    return (
        <div className="user-details-drawer-content">
            <div className="drawer-header-profile">
                <CircularAvatar
                    src={user.profileImage}
                    name={`${user.firstName || ''} ${user.lastName || ''}`}
                    size="xl"
                />
                <div className="profile-text-meta">
                    <h3 className="profile-name">
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className="profile-email">
                        <Mail size={14} /> {user.email}
                    </p>
                    <div className="profile-badges-row">
                        <UserRoleBadge role={user.role} />
                        <UserStatusBadge
                            isActive={user.isActive}
                            isDeleted={user.isDeleted}
                            emailVerified={user.emailVerified}
                        />
                    </div>
                </div>
            </div>

            <div className="drawer-stats-grid">
                <div className="stat-box">
                    <div className="stat-icon-wrapper trips">
                        <Compass size={18} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Trips</span>
                        <span className="stat-number">{user.stats?.totalTrips ?? 0}</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon-wrapper bookmarks">
                        <Bookmark size={18} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Saved Cities</span>
                        <span className="stat-number">{user.stats?.totalSavedDestinations ?? 0}</span>
                    </div>
                </div>
            </div>

            <div className="drawer-section">
                <h4 className="section-title">Account Details</h4>
                <div className="info-list">
                    <div className="info-item">
                        <span className="info-label">
                            <Calendar size={14} /> Registered On
                        </span>
                        <span className="info-value">{formattedCreatedAt}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            <Shield size={14} /> Email Verification
                        </span>
                        <span className="info-value">
                            {user.emailVerified ? (
                                <span className="verified-tag">
                                    <CheckCircle size={13} /> Verified
                                </span>
                            ) : (
                                <span className="unverified-tag">
                                    <Clock size={13} /> Unverified
                                </span>
                            )}
                        </span>
                    </div>

                    {user.isDeleted && (
                        <>
                            <div className="info-item">
                                <span className="info-label">
                                    <AlertTriangle size={14} /> Deleted On
                                </span>
                                <span className="info-value deleted-val">{formattedDeletedAt}</span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">
                                    <Clock size={14} /> Recovery Deadline
                                </span>
                                <span className="info-value warning-val">{formattedRecoveryExpires}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="drawer-actions-panel">
                <h4 className="section-title">Administrative Actions</h4>
                <div className="actions-buttons-col">
                    <Button
                        variant={user.isActive ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onToggleActive(user)}
                        disabled={actionLoading}
                        className="action-btn"
                    >
                        {user.isActive ? 'Suspend User Account' : 'Activate User Account'}
                    </Button>

                    <Button
                        variant={user.isDeleted ? 'primary' : 'outline'}
                        size="md"
                        onClick={() => onToggleDelete(user)}
                        disabled={actionLoading}
                        className="action-btn delete-btn"
                    >
                        {user.isDeleted ? 'Restore Soft-Deleted Account' : 'Soft-Delete User Account'}
                    </Button>

                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => onChangeRole(user)}
                        disabled={actionLoading}
                        className="action-btn role-btn"
                    >
                        {user.role === 'admin' ? 'Demote to Standard User' : 'Promote to Platform Admin'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailsDrawer;
