import { Heart, Plus, Check, Compass, Loader2 } from 'lucide-react';

const CATEGORY_FALLBACK_IMAGES = {
    sightseeing:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    cultural:
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    entertainment:
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    adventure:
        'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=600&q=80',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    relaxation:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
};

export function CuratedActivitySuggestions({
    activities = [],
    selectedActivityIds = new Set(),
    onToggleActivity,
    loading = false,
    destinationName = '',
}) {
    return (
        <section className="curated-suggestions-section">
            <div className="section-header-row">
                <h2 className="suggestions-headline">
                    Suggestions for Places to Visit & Activities
                </h2>
                {destinationName && <span className="destination-tag">in {destinationName}</span>}
            </div>

            {loading ? (
                <div className="suggestions-loading-state">
                    <Loader2 className="spinner-icon animate-spin" size={24} />
                    <span>Loading curated places...</span>
                </div>
            ) : activities.length === 0 ? (
                <div className="suggestions-empty-state">
                    <Compass className="empty-icon" size={36} />
                    <p className="empty-title">
                        {destinationName
                            ? `No curated activities cataloged yet for ${destinationName}`
                            : 'Select a destination above to see curated activities'}
                    </p>
                    <p className="empty-subtitle">
                        You can always add and customize custom stops and activities later in the
                        Itinerary Builder.
                    </p>
                </div>
            ) : (
                <div className="suggestions-grid">
                    {activities.map((act) => {
                        const isSelected = selectedActivityIds.has(act.id);
                        const categoryKey = (
                            act.activityType ||
                            act.category ||
                            'sightseeing'
                        ).toLowerCase();
                        const fallbackImg =
                            CATEGORY_FALLBACK_IMAGES[categoryKey] ||
                            CATEGORY_FALLBACK_IMAGES.sightseeing;

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
                                            act.imageUrl ||
                                            fallbackImg
                                        }
                                        alt={act.name}
                                        className="card-img"
                                        loading="lazy"
                                    />
                                    <span className="card-category-badge">
                                        {act.activityType || act.category || 'Experience'}
                                    </span>
                                    <button
                                        type="button"
                                        className="favorite-btn"
                                        aria-label="Favorite"
                                    >
                                        <Heart size={16} />
                                    </button>
                                </div>

                                <div className="card-content">
                                    <h3 className="card-title">{act.name}</h3>
                                    <p className="card-desc">{act.description}</p>

                                    <div className="card-footer">
                                        <span className="card-price">
                                            {!act.cost || Number(act.cost) === 0
                                                ? 'Free'
                                                : `${act.currency || '₹'} ${Number(act.cost).toLocaleString()}`}
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
            )}
        </section>
    );
}

export default CuratedActivitySuggestions;
