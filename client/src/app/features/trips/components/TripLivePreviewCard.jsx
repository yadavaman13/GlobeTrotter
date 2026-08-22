import { MapPin, Calendar, Clock } from 'lucide-react';

export function TripLivePreviewCard({
    title,
    destination,
    startDate,
    endDate,
    coverPhotoUrl,
    budgetAmount,
    budgetCurrency,
    selectedActivities = [],
}) {
    const defaultCover =
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80';

    return (
        <div className="trip-live-preview-card">
            <div
                className="preview-cover-banner"
                style={{ backgroundImage: `url('${coverPhotoUrl || defaultCover}')` }}
            >
                <div className="preview-cover-overlay" />
                <div className="preview-cover-content">
                    <span className="preview-badge">Draft</span>
                    <h3 className="preview-title">{title || 'Your Trip Preview'}</h3>
                    {budgetAmount && (
                        <p className="preview-budget">
                            Budget: {budgetCurrency} {Number(budgetAmount).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>

            <div className="preview-body">
                <div className="preview-details">
                    <div className="preview-detail-item">
                        <MapPin className="detail-icon" size={18} />
                        <span className="detail-text">
                            {destination || 'Destination pending...'}
                        </span>
                    </div>
                    <div className="preview-detail-item">
                        <Calendar className="detail-icon" size={18} />
                        <span className="detail-text">
                            {startDate && endDate ? `${startDate} to ${endDate}` : 'Dates not set'}
                        </span>
                    </div>
                </div>

                <hr className="preview-divider" />

                <div className="preview-snapshot">
                    <h4 className="snapshot-title">Itinerary Snapshot</h4>
                    {selectedActivities.length > 0 ? (
                        <div className="snapshot-list">
                            {selectedActivities.map((act, index) => (
                                <div key={act.id || index} className="snapshot-item">
                                    <div className="snapshot-bullet" />
                                    <div className="snapshot-item-content">
                                        <p className="snapshot-item-name">{act.name}</p>
                                        <span className="snapshot-item-meta">
                                            <Clock size={12} />{' '}
                                            {act.durationMinutes
                                                ? `${act.durationMinutes} mins`
                                                : act.category || 'Activity'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="snapshot-empty">
                            <div className="snapshot-bullet empty" />
                            <div>
                                <p className="empty-heading">Add activities</p>
                                <p className="empty-desc">Your selected places will appear here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TripLivePreviewCard;
