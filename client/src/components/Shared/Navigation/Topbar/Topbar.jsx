import { Bell as BellIcon, Menu as MenuIcon } from 'lucide-react';
import IconButton from '@/components/Shared/Buttons/IconButton/IconButton';
import Breadcrumbs from '@/components/Shared/Navigation/Breadcrumbs/Breadcrumbs';
import { useActiveNavTab } from '@/hooks/useActiveNavTab';
import './Topbar.scss';

function Topbar({ onMenuClick, unreadNotificationCount, onNotificationClick }) {
    const { activeTab, activeSubTab } = useActiveNavTab();
    const notificationCount = unreadNotificationCount ?? 4;

    return (
        <div className="shared-topbar-container">
            <button
                type="button"
                className="topbar-menu-trigger"
                onClick={onMenuClick}
                title="Open navigation menu"
            >
                <MenuIcon size={20} />
            </button>

            {/* Shared Standalone Breadcrumbs Component */}
            <Breadcrumbs activeTab={activeTab} activeSubTab={activeSubTab} />

            <div className="topbar-right">
                {/* Notification Bell with Server-Driven Badge Count */}
                <div className="topbar-notification-wrapper">
                    <IconButton
                        variant="plain"
                        icon={<BellIcon size={18} />}
                        onClick={onNotificationClick}
                        aria-label={`Notifications (${notificationCount || 0} unread)`}
                    />
                    {notificationCount > 0 && (
                        <span className="notification-badge">
                            {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Topbar;
