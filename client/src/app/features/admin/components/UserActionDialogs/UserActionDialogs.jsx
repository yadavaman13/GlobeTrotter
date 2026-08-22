import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import Button from '@/components/Shared/Buttons/Button/Button';
import { AlertTriangle, Trash2, ShieldAlert, CheckCircle } from 'lucide-react';
import './UserActionDialogs.scss';

export function StatusChangeDialog({ isOpen, onClose, user, onConfirm, loading }) {
    if (!user) return null;
    const willActivate = !user.isActive;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={willActivate ? 'Activate User Account' : 'Suspend User Account'}
            size="sm"
        >
            <div className="action-dialog-body">
                <div className={`dialog-icon-badge ${willActivate ? 'success' : 'warning'}`}>
                    {willActivate ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
                </div>
                <p className="dialog-description">
                    Are you sure you want to {willActivate ? 'activate' : 'suspend'}{' '}
                    <strong>
                        {user.firstName} {user.lastName}
                    </strong>{' '}
                    (<em>{user.email}</em>)?
                </p>
                <p className="dialog-subtext">
                    {willActivate
                        ? 'The user will immediately regain access to log in and manage their itineraries.'
                        : 'The user will be immediately logged out and prevented from accessing their account.'}
                </p>
                <div className="dialog-actions-row">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={willActivate ? 'primary' : 'outline'}
                        onClick={() => onConfirm(user)}
                        disabled={loading}
                    >
                        {willActivate ? 'Activate Account' : 'Suspend Account'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export function RoleChangeDialog({ isOpen, onClose, user, onConfirm, loading }) {
    if (!user) return null;
    const willBeAdmin = user.role !== 'admin';

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={willBeAdmin ? 'Promote to Admin' : 'Demote to Standard User'}
            size="sm"
        >
            <div className="action-dialog-body">
                <div className="dialog-icon-badge primary">
                    <ShieldAlert size={28} />
                </div>
                <p className="dialog-description">
                    Are you sure you want to {willBeAdmin ? 'grant Administrator privileges to' : 'revoke Administrator access from'}{' '}
                    <strong>
                        {user.firstName} {user.lastName}
                    </strong>{' '}
                    (<em>{user.email}</em>)?
                </p>
                <p className="dialog-subtext">
                    {willBeAdmin
                        ? 'Admins have full access to platform analytics, user accounts, and content moderation.'
                        : 'The user will only have access to standard travel planning and itinerary features.'}
                </p>
                <div className="dialog-actions-row">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onConfirm(user.id, willBeAdmin ? 'admin' : 'user')}
                        disabled={loading}
                    >
                        {willBeAdmin ? 'Confirm Promotion' : 'Confirm Demotion'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export function DeleteUserDialog({ isOpen, onClose, user, onConfirm, loading }) {
    if (!user) return null;
    const willRestore = user.isDeleted;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={willRestore ? 'Restore User Account' : 'Soft-Delete User Account'}
            size="sm"
        >
            <div className="action-dialog-body">
                <div className={`dialog-icon-badge ${willRestore ? 'success' : 'danger'}`}>
                    {willRestore ? <CheckCircle size={28} /> : <Trash2 size={28} />}
                </div>
                <p className="dialog-description">
                    Are you sure you want to {willRestore ? 'restore' : 'soft-delete'}{' '}
                    <strong>
                        {user.firstName} {user.lastName}
                    </strong>{' '}
                    (<em>{user.email}</em>)?
                </p>
                <p className="dialog-subtext">
                    {willRestore
                        ? 'The user account will be reactivated and removed from the purge queue.'
                        : 'The account will be disabled with a 15-day recovery window before permanent cleanup.'}
                </p>
                <div className="dialog-actions-row">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={willRestore ? 'primary' : 'outline'}
                        className={!willRestore ? 'danger-action-btn' : ''}
                        onClick={() => onConfirm(user)}
                        disabled={loading}
                    >
                        {willRestore ? 'Restore Account' : 'Soft-Delete Account'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export function CleanupUsersDialog({ isOpen, onClose, onConfirm, loading }) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Permanently Purge Expired Accounts"
            size="sm"
        >
            <div className="action-dialog-body">
                <div className="dialog-icon-badge danger">
                    <Trash2 size={28} />
                </div>
                <p className="dialog-description">
                    This action will <strong>permanently and irreversibly delete</strong> all soft-deleted user accounts whose 15-day recovery period has elapsed.
                </p>
                <p className="dialog-subtext">
                    All associated trips, itineraries, attachments, and data will be cascade removed.
                </p>
                <div className="dialog-actions-row">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        className="danger-action-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        Purge All Expired
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
