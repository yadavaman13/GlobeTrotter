import React from 'react';
import {
    Flag,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    UserPlus,
    DollarSign,
    Activity,
    FileText,
} from 'lucide-react';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import ActivityDetailCard from '../ActivityDetailCard/ActivityDetailCard';
import './ActivityFeedItem.scss';

function ActivityFeedItem({
    user = { name: '', avatar: null, initials: '' },
    statusText = '',
    statusIcon = null,
    statusType = 'warning', // 'warning' | 'success' | 'primary' | 'info' | 'danger'
    actionPrefix = '',
    actionHighlight = '',
    timestamp = '',
    detailCard = null,
    isLast = false,
    onClick = null,
    className = '',
    style = {},
}) {
    const statusTypeClass = `status-${statusType}`;

    // Render Lucide SVG Icons automatically based on backend event types/names
    const renderStatusIcon = () => {
        if (React.isValidElement(statusIcon)) return statusIcon;

        const iconName = typeof statusIcon === 'string' ? statusIcon.toLowerCase() : '';
        const textLower = typeof statusText === 'string' ? statusText.toLowerCase() : '';

        if (
            iconName.includes('flag') ||
            statusType === 'warning' ||
            textLower.includes('new task') ||
            textLower.includes('flag')
        ) {
            return <Flag size={13} className="status-tag-icon-svg" />;
        }

        if (
            iconName.includes('check') ||
            statusType === 'success' ||
            textLower.includes('completed') ||
            textLower.includes('done') ||
            textLower.includes('resolved')
        ) {
            return <CheckCircle2 size={14} className="status-tag-icon-svg" />;
        }

        if (
            iconName.includes('comment') ||
            iconName.includes('message') ||
            textLower.includes('comment') ||
            textLower.includes('message')
        ) {
            return <MessageSquare size={13} className="status-tag-icon-svg" />;
        }

        if (
            iconName.includes('user') ||
            textLower.includes('joined') ||
            textLower.includes('member')
        ) {
            return <UserPlus size={13} className="status-tag-icon-svg" />;
        }

        if (
            iconName.includes('pay') ||
            iconName.includes('dollar') ||
            textLower.includes('payment') ||
            textLower.includes('invoice')
        ) {
            return <DollarSign size={13} className="status-tag-icon-svg" />;
        }

        if (
            iconName.includes('doc') ||
            iconName.includes('file') ||
            textLower.includes('file') ||
            textLower.includes('document')
        ) {
            return <FileText size={13} className="status-tag-icon-svg" />;
        }

        if (iconName.includes('clock') || statusType === 'info') {
            return <Clock size={13} className="status-tag-icon-svg" />;
        }

        if (
            iconName.includes('alert') ||
            statusType === 'danger' ||
            textLower.includes('maintenance') ||
            textLower.includes('error')
        ) {
            return <AlertCircle size={13} className="status-tag-icon-svg" />;
        }

        if (statusIcon) {
            return <span className="status-tag-icon-raw">{statusIcon}</span>;
        }

        return <Activity size={13} className="status-tag-icon-svg" />;
    };

    return (
        <div
            className={`activity-feed-item-container ${isLast ? 'is-last' : ''} ${onClick ? 'is-clickable' : ''} ${className}`}
            style={style}
            onClick={onClick}
        >
            {/* Left Timeline Node & Vertical Dotted Line Connector */}
            <div className="activity-item-timeline-col">
                {!isLast && <div className="activity-timeline-line" />}
                <div className="activity-item-avatar-wrapper">
                    <CircularAvatar
                        src={user?.avatar}
                        text={
                            user?.initials ||
                            (user?.name ? user.name.slice(0, 2).toUpperCase() : null)
                        }
                        size={32}
                    />
                </div>
            </div>

            {/* Right Content Col */}
            <div className="activity-item-content-col">
                {/* Status Tag Line */}
                {(statusText || statusIcon) && (
                    <div className={`activity-item-status-tag ${statusTypeClass}`}>
                        <span className="status-tag-icon">{renderStatusIcon()}</span>
                        {statusText && <span className="status-tag-text">{statusText}</span>}
                    </div>
                )}

                {/* User Action Line */}
                <div className="activity-item-action-line">
                    {user?.name && <span className="user-name">{user.name}</span>}{' '}
                    {actionPrefix && <span className="action-text">{actionPrefix}</span>}{' '}
                    {actionHighlight && <span className="action-highlight">{actionHighlight}</span>}
                </div>

                {/* Timestamp */}
                {timestamp && <span className="activity-item-timestamp">{timestamp}</span>}

                {/* Embedded Detail Card Slot */}
                {detailCard && (
                    <div className="activity-item-detail-slot">
                        {typeof detailCard === 'object' && !React.isValidElement(detailCard) ? (
                            <ActivityDetailCard
                                title={detailCard.title}
                                code={detailCard.code}
                                badgeText={detailCard.badgeText}
                                badgeVariant={detailCard.badgeVariant}
                                onClick={detailCard.onClick}
                            />
                        ) : (
                            detailCard
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActivityFeedItem;
