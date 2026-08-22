import { Clock, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

export function ActivityTimelineItem({ activity, onDelete, onEdit }) {
    const [showMenu, setShowMenu] = useState(false);

    // Format time (e.g., "09:00:00" -> "09:00 AM")
    const formatTime = (timeStr) => {
        if (!timeStr) return '09:00 AM';
        const parts = timeStr.split(':');
        const hour = parseInt(parts[0], 10);
        const min = parts[1] || '00';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${String(formattedHour).padStart(2, '0')}:${min} ${ampm}`;
    };

    const defaultImg =
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80';

    return (
        <div className="activity-timeline-item">
            {/* Timeline bullet */}
            <div className="activity-node-dot">
                <div className="dot-inner" />
            </div>

            {/* Time badge */}
            <div className="activity-time-col">{formatTime(activity.startTime)}</div>

            {/* Activity Card Content */}
            <div className="activity-card-bubble">
                <div className="activity-thumb">
                    <img
                        src={activity.image || activity.coverImage || defaultImg}
                        alt={activity.name || 'Activity'}
                        className="thumb-img"
                    />
                </div>

                <div className="activity-info">
                    <h5 className="activity-name">{activity.name || 'Scheduled Activity'}</h5>
                    <p className="activity-meta">
                        <span className="meta-category">
                            {activity.activityType || activity.category || 'Sightseeing'}
                        </span>
                        <span className="meta-dot">•</span>
                        <span className="meta-duration">
                            <Clock size={12} />
                            {activity.durationMinutes
                                ? `${activity.durationMinutes} mins`
                                : '2 hours'}
                        </span>
                        {Number(activity.cost) > 0 && (
                            <>
                                <span className="meta-dot">•</span>
                                <span className="meta-cost">
                                    {activity.currency || '$'}
                                    {activity.cost}
                                </span>
                            </>
                        )}
                    </p>
                    {activity.notes && <p className="activity-notes">{activity.notes}</p>}
                </div>

                {/* Actions */}
                <div className="activity-actions">
                    <button
                        type="button"
                        className="action-icon-btn"
                        onClick={() => setShowMenu(!showMenu)}
                        title="Options"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <div className="activity-dropdown-menu">
                            {onEdit && (
                                <button
                                    type="button"
                                    className="menu-item"
                                    onClick={() => {
                                        setShowMenu(false);
                                        onEdit(activity);
                                    }}
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                            )}
                            <button
                                type="button"
                                className="menu-item delete"
                                onClick={() => {
                                    setShowMenu(false);
                                    onDelete(activity.id);
                                }}
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActivityTimelineItem;
