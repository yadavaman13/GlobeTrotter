import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import './UserStatusBadge.scss';

export function UserStatusBadge({ isActive, isDeleted, _emailVerified, _role }) {

    if (isDeleted) {
        return (
            <Badge variant="error" type="light" showDot>
                Soft Deleted
            </Badge>
        );
    }

    if (!isActive) {
        return (
            <Badge variant="warning" type="light" showDot>
                Inactive
            </Badge>
        );
    }

    return (
        <Badge variant="success" type="light" showDot>
            Active
        </Badge>
    );
}

export function UserRoleBadge({ role }) {
    const isAdmin = role?.toLowerCase() === 'admin';
    return (
        <Badge variant={isAdmin ? 'primary' : 'neutral'} type="subtle">
            {isAdmin ? 'Admin' : 'User'}
        </Badge>
    );
}

export default UserStatusBadge;
