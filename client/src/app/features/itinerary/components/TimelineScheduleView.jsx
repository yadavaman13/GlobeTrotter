import { Clock, MapPin } from 'lucide-react';

export function TimelineScheduleView({ days = [], summary, currency = 'USD' }) {
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
        <div className="timeline-schedule-feed">
            {days.map((day) => {
                const stopsInDay = day.stops || [];
                const activitiesInDay = day.activities || [];

                return (
                    <div key={day.date} className="day-schedule-card">
                        {/* Day Card Header */}
                        <div className="day-header-banner">
                            <div className="day-index-box">
                                <span className="day-num">Day {day.dayNumber}</span>
                                <span className="day-date">{day.date}</span>
                            </div>

                            <div className="day-cities-row">
                                {stopsInDay.map((stop) => (
                                    <span key={stop.id} className="city-pill">
                                        <MapPin size={14} />
                                        <span>{stop.cityName || 'City Stop'}</span>
                                    </span>
                                ))}
                            </div>

                            <div className="day-cost-tag">
                                <span>Day Spend: </span>
                                <strong>
                                    {currency} {day.dailyTotalCost || 0}
                                </strong>
                            </div>
                        </div>

                        {/* Activities List for the Day */}
                        <div className="day-activities-list">
                            {activitiesInDay.length > 0 ? (
                                activitiesInDay.map((act, actIdx) => (
                                    <div key={act.id || actIdx} className="timeline-activity-row">
                                        <div className="timeline-time-badge">
                                            <Clock size={14} />
                                            <span>{formatTime(act.startTime)}</span>
                                        </div>

                                        <div className="timeline-node-connector">
                                            <div className="connector-dot" />
                                            {actIdx < activitiesInDay.length - 1 && (
                                                <div className="connector-line" />
                                            )}
                                        </div>

                                        <div className="timeline-activity-card">
                                            <div className="activity-card-header">
                                                <h4 className="activity-title">{act.name}</h4>
                                                <span className="activity-category-tag">
                                                    {act.activityType || 'Experience'}
                                                </span>
                                            </div>

                                            {act.description && (
                                                <p className="activity-description">
                                                    {act.description}
                                                </p>
                                            )}

                                            <div className="activity-card-footer">
                                                {act.durationMinutes && (
                                                    <span className="duration-tag">
                                                        <Clock size={12} /> {act.durationMinutes}{' '}
                                                        mins
                                                    </span>
                                                )}
                                                {Number(act.cost) > 0 && (
                                                    <span className="cost-tag">
                                                        {currency} {act.cost}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-activities-for-day">
                                    <p>
                                        Free exploration / Leisure day in{' '}
                                        {stopsInDay[0]?.cityName || 'destination'}.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TimelineScheduleView;
