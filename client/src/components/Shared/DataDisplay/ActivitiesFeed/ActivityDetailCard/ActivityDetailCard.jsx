import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import './ActivityDetailCard.scss';

function ActivityDetailCard({
    title = '',
    code = '',
    badgeText = '',
    badgeVariant = 'warning',
    onClick,
    className = '',
    style = {},
}) {
    return (
        <div
            className={`activity-detail-card-container ${onClick ? 'is-clickable' : ''} ${className}`}
            onClick={onClick}
            style={style}
        >
            {(title || code) && (
                <div className="activity-detail-title-row">
                    {title && <span className="activity-detail-title">{title}</span>}
                    {code && <span className="activity-detail-code">{code}</span>}
                </div>
            )}

            {badgeText && (
                <div className="activity-detail-badge-row">
                    <Badge variant={badgeVariant} type="light">
                        {badgeText}
                    </Badge>
                </div>
            )}
        </div>
    );
}

export default ActivityDetailCard;
