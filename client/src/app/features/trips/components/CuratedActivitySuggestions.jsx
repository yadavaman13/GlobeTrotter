import { Heart, Plus, Check } from 'lucide-react';

export function CuratedActivitySuggestions({
    activities = [],
    selectedActivityIds = new Set(),
    onToggleActivity,
}) {
    const defaultSuggestions = [
        {
            id: 'sug-1',
            name: 'Fushimi Inari Shrine Hike',
            description: 'Iconic mountain trail with thousands of vibrant vermilion torii gates.',
            activityType: 'Culture',
            cost: 0,
            currency: 'USD',
            durationMinutes: 120,
            image: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'sug-2',
            name: 'Cappadocia Balloon Ride',
            description: 'Sunrise flight over fairy chimneys and dramatic valley landscapes.',
            activityType: 'Adventure',
            cost: 150,
            currency: 'USD',
            durationMinutes: 90,
            image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'sug-3',
            name: 'Traditional Tea Ceremony',
            description:
                'Experience authentic matcha preparation in a historic Zen garden setting.',
            activityType: 'Relaxation',
            cost: 45,
            currency: 'USD',
            durationMinutes: 60,
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        },
    ];

    const displayActivities = activities.length > 0 ? activities : defaultSuggestions;

    return (
        <section className="curated-suggestions-section">
            <h2 className="suggestions-headline">Suggestions for Places to Visit & Activities</h2>
            <div className="suggestions-grid">
                {displayActivities.map((act) => {
                    const isSelected = selectedActivityIds.has(act.id);
                    return (
                        <div
                            key={act.id}
                            className={`activity-suggestion-card ${isSelected ? 'selected' : ''}`}
                        >
                            <div className="card-media">
                                <img
                                    src={
                                        act.image ||
                                        act.coverImage ||
                                        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
                                    }
                                    alt={act.name}
                                    className="card-img"
                                />
                                <span className="card-category-badge">
                                    {act.activityType || act.category || 'Experience'}
                                </span>
                                <button className="favorite-btn" aria-label="Favorite">
                                    <Heart size={16} />
                                </button>
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{act.name}</h3>
                                <p className="card-desc">{act.description}</p>

                                <div className="card-footer">
                                    <span className="card-price">
                                        {Number(act.cost) === 0
                                            ? 'Free'
                                            : `${act.currency || '$'}${act.cost}`}
                                    </span>
                                    <button
                                        type="button"
                                        className={`add-btn ${isSelected ? 'added' : ''}`}
                                        onClick={() => onToggleActivity(act)}
                                    >
                                        {isSelected ? (
                                            <>
                                                <Check size={14} /> Added
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={14} /> Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default CuratedActivitySuggestions;
