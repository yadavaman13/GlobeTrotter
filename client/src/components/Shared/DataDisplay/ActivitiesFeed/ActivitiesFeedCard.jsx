import React from 'react';
import { MoreHorizontal, AlertCircle, RefreshCw, Inbox } from 'lucide-react';
import ActivityFeedItem from './ActivityFeedItem/ActivityFeedItem';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import './ActivitiesFeedCard.scss';

// Default sample activities data for fallback/demo
const DEFAULT_ACTIVITIES = [
    {
        id: '1',
        user: {
            name: 'Logan Harrington',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
            initials: 'LH',
        },
        statusText: 'New Task',
        statusIcon: 'flag',
        statusType: 'warning',
        actionPrefix: 'created new maintenance request...',
        timestamp: 'Today, 9:48 AM',
        detailCard: {
            title: 'Water Drip from Faucets',
            code: '#284',
            badgeText: 'MAINTENANCE',
            badgeVariant: 'warning',
        },
    },
    {
        id: '2',
        user: {
            name: 'Georgia Mollie',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
            initials: 'GM',
        },
        statusText: 'Task Completed',
        statusIcon: 'check',
        statusType: 'success',
        actionPrefix: 'completed task',
        actionHighlight: '#276',
        timestamp: 'Yesterday, 3:58 PM',
    },
];

// Date Formatter Helper for backend timestamps (ISO, Epoch, or Date objects)
export function formatActivityDate(dateInput) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isToday = now.toDateString() === date.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();

    if (isToday) {
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        return `Today, ${timeStr}`;
    }

    if (isYesterday) {
        return `Yesterday, ${timeStr}`;
    }

    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

// Backend Payload Normalizer (maps raw API fields to standard structure)
export function normalizeActivity(item = {}) {
    if (!item || typeof item !== 'object') return {};

    // 1. User / Actor normalization
    const rawUser = item.user || item.actor || item.author || item.member || {};
    const userName =
        typeof rawUser === 'string'
            ? rawUser
            : rawUser.name ||
              rawUser.username ||
              item.userName ||
              item.actorName ||
              item.authorName ||
              'System User';

    const userAvatar =
        typeof rawUser === 'object'
            ? rawUser.avatar ||
              rawUser.image ||
              rawUser.profilePicture ||
              item.userAvatar ||
              item.actorAvatar
            : item.userAvatar;

    const userInitials =
        rawUser.initials ||
        item.userInitials ||
        (userName
            ? userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
            : 'SU');

    // 2. Date / Timestamp normalization
    const rawDate =
        item.timestamp || item.createdAt || item.created_at || item.date || item.updatedAt;
    const formattedTime = formatActivityDate(rawDate) || 'Just now';

    // 3. Status & Icon normalization
    let statusText = item.statusText || item.status || item.type || item.eventType || '';
    let statusIcon = item.statusIcon || item.icon || null;
    let statusType = item.statusType || item.variant || 'warning';

    if (typeof statusText === 'string') {
        const upper = statusText.toUpperCase();
        if (upper.includes('CREATE') || upper.includes('NEW') || upper.includes('TASK')) {
            if (!item.statusText) statusText = 'New Task';
            if (!item.statusType) statusType = 'warning';
            if (!item.statusIcon) statusIcon = 'flag';
        } else if (
            upper.includes('COMPLETE') ||
            upper.includes('DONE') ||
            upper.includes('RESOLV')
        ) {
            if (!item.statusText) statusText = 'Task Completed';
            if (!item.statusType) statusType = 'success';
            if (!item.statusIcon) statusIcon = 'check';
        } else if (upper.includes('COMMENT') || upper.includes('MESSAGE')) {
            if (!item.statusText) statusText = 'New Comment';
            if (!item.statusType) statusType = 'info';
            if (!item.statusIcon) statusIcon = 'comment';
        } else if (
            upper.includes('MAINTENANCE') ||
            upper.includes('ALERT') ||
            upper.includes('ERROR')
        ) {
            if (!item.statusType) statusType = 'danger';
            if (!item.statusIcon) statusIcon = 'alert';
        }
    }

    // 4. Description line normalization
    const actionPrefix =
        item.actionPrefix || item.action || item.description || item.title || item.message || '';
    const actionHighlight =
        item.actionHighlight || item.target || item.code || item.reference || '';

    // 5. Embedded Detail Card normalization
    let detailCard = item.detailCard || item.detail || item.metadata || item.card || null;
    if (detailCard && typeof detailCard === 'object' && !React.isValidElement(detailCard)) {
        detailCard = {
            title: detailCard.title || detailCard.name || detailCard.subject || '',
            code:
                detailCard.code ||
                detailCard.id ||
                detailCard.ticketId ||
                detailCard.reference ||
                '',
            badgeText:
                detailCard.badgeText ||
                detailCard.tag ||
                detailCard.category ||
                detailCard.status ||
                '',
            badgeVariant: detailCard.badgeVariant || detailCard.variant || statusType || 'warning',
            onClick: detailCard.onClick,
        };
    }

    return {
        id: item.id || item._id || item.key || Math.random().toString(),
        user: { name: userName, avatar: userAvatar, initials: userInitials },
        statusText,
        statusIcon,
        statusType,
        actionPrefix,
        actionHighlight,
        timestamp: formattedTime,
        detailCard,
        raw: item,
    };
}

function ActivitiesFeedCard({
    title = 'Recent Activities',
    activities = DEFAULT_ACTIVITIES,
    loading = false,
    error = null,
    emptyText = 'No recent activities found',
    onRetry = null,
    onItemClick = null,
    onMenuClick = null,
    headerAction = null,
    renderItem = null,
    className = '',
    style = {},
}) {
    const rawList = Array.isArray(activities) ? activities : DEFAULT_ACTIVITIES;
    const normalizedList = rawList.map(normalizeActivity);

    return (
        <div className={`activities-feed-card-wrapper ${className}`} style={style}>
            {/* Header Row */}
            {(title || onMenuClick || headerAction) && (
                <div className="activities-feed-card-header">
                    {title && <h3 className="activities-feed-card-title">{title}</h3>}
                    <div className="activities-feed-header-action">
                        {headerAction ? (
                            headerAction
                        ) : (
                            <button
                                type="button"
                                className="activities-feed-menu-btn"
                                onClick={onMenuClick}
                                aria-label="More options"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Loading Skeleton Mode */}
            {loading && (
                <div className="activities-feed-skeleton-container">
                    <div className="activities-skeleton-item">
                        <div className="skeleton-avatar" />
                        <div className="skeleton-text-group">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line long" />
                            <div className="skeleton-line date" />
                        </div>
                    </div>
                    <div className="activities-skeleton-item">
                        <div className="skeleton-avatar" />
                        <div className="skeleton-text-group">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line long" />
                            <div className="skeleton-line date" />
                        </div>
                    </div>
                </div>
            )}

            {/* Error / Retry State */}
            {!loading && error && (
                <div className="activities-feed-error-container">
                    <AlertCircle size={20} className="error-icon" />
                    <span className="error-message">
                        {typeof error === 'string' ? error : 'Failed to load activities'}
                    </span>
                    {onRetry && (
                        <button type="button" className="activities-retry-btn" onClick={onRetry}>
                            <RefreshCw size={13} />
                            <span>Retry</span>
                        </button>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && normalizedList.length === 0 && (
                <EmptyState variant="compact" icon={Inbox} title={emptyText} />
            )}

            {/* Vertical Feed List */}
            {!loading && !error && normalizedList.length > 0 && (
                <div className="activities-feed-list-container">
                    {normalizedList.map((item, idx) => {
                        const isLast = idx === normalizedList.length - 1;

                        if (typeof renderItem === 'function') {
                            return renderItem(item, idx, isLast);
                        }

                        return (
                            <ActivityFeedItem
                                key={item.id || idx}
                                user={item.user}
                                statusText={item.statusText}
                                statusIcon={item.statusIcon}
                                statusType={item.statusType}
                                actionPrefix={item.actionPrefix}
                                actionHighlight={item.actionHighlight}
                                timestamp={item.timestamp}
                                detailCard={item.detailCard}
                                isLast={isLast}
                                onClick={
                                    onItemClick ? () => onItemClick(item.raw || item) : undefined
                                }
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ActivitiesFeedCard;
