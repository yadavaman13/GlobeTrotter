import { Clock } from 'lucide-react';

export function PublicTimelineView({ stops = [], currency = 'USD' }) {
    const formatTime = (timeStr) => {
        if (!timeStr) return '09:00 AM';
        const parts = timeStr.split(':');
        const hour = parseInt(parts[0], 10);
        const min = parts[1] || '00';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${String(formattedHour).padStart(2, '0')}:${min} ${ampm}`;
    };

    return (
        <div className="public-timeline-flow">
            {stops.map((stop, index) => {
                const activities = stop.activities || [];

                return (
                    <div key={stop.id || index} className="public-stop-card">
                        <div className="public-stop-header">
                            <div className="stop-badge">Stop {index + 1}</div>
                            <h3 className="stop-name">{stop.cityName || 'Destination City'}</h3>
                            <p className="stop-dates">
                                {stop.startDate && stop.endDate
                                    ? `${stop.startDate} - ${stop.endDate}`
                                    : 'Flexible dates'}
                            </p>
                        </div>

                        <div className="public-activities-stream">
                            {activities.map((act) => (
                                <div key={act.id} className="public-activity-row">
                                    <div className="activity-time">
                                        <Clock size={14} />
                                        <span>{formatTime(act.startTime)}</span>
                                    </div>

                                    <div className="activity-bullet-point" />

                                    <div className="activity-details-box">
                                        <div className="act-header">
                                            <h4 className="act-name">{act.name}</h4>
                                            <span className="act-type">
                                                {act.activityType || 'Experience'}
                                            </span>
                                        </div>

                                        {act.description && (
                                            <p className="act-desc">{act.description}</p>
                                        )}

                                        {act.notes && <p className="act-notes">{act.notes}</p>}

                                        <div className="act-meta">
                                            {act.durationMinutes && (
                                                <span>Duration: {act.durationMinutes}m</span>
                                            )}
                                            {Number(act.cost) > 0 && (
                                                <span className="act-cost">
                                                    Cost: {act.currency || currency} {act.cost}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {activities.length === 0 && (
                                <p className="no-acts">Sightseeing & free exploration</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PublicTimelineView;
