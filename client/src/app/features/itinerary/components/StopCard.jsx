import { useState } from 'react';
import {
    Calendar,
    Wallet,
    Bed,
    Compass,
    Plus,
    Trash2,
    Edit,
    Sparkles,
    MoreHorizontal,
} from 'lucide-react';
import ActivityTimelineItem from './ActivityTimelineItem';

export function StopCard({
    stop,
    index,
    currency = 'USD',
    onOpenAddActivity,
    onDeleteStop,
    onDeleteActivity,
    onAddSuggestedActivity,
}) {
    const [showMenu, setShowMenu] = useState(false);

    const defaultCover =
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80';

    const activities = stop.activities || [];
    const stopTotalCost = activities.reduce((sum, act) => sum + (parseFloat(act.cost) || 0), 0);

    return (
        <article className="stop-card-container">
            {/* City Hero Banner */}
            <div
                className="stop-hero-header"
                style={{ backgroundImage: `url('${stop.coverImage || defaultCover}')` }}
            >
                <div className="stop-hero-overlay" />

                <div className="stop-header-actions">
                    <button
                        type="button"
                        className="header-action-btn"
                        onClick={() => setShowMenu(!showMenu)}
                        title="Options"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    {showMenu && (
                        <div className="stop-dropdown-menu">
                            <button
                                type="button"
                                className="menu-item delete"
                                onClick={() => {
                                    setShowMenu(false);
                                    onDeleteStop(stop.id);
                                }}
                            >
                                <Trash2 size={14} /> Remove Destination
                            </button>
                        </div>
                    )}
                </div>

                <div className="stop-hero-text">
                    <span className="stop-index-badge">Stop {index + 1}</span>
                    <h2 className="stop-city-name">{stop.cityName || 'Destination City'}</h2>
                    <p className="stop-country-subtitle">
                        {stop.country
                            ? `${stop.country}${stop.region ? ` • ${stop.region}` : ''}`
                            : 'Cultural destination'}
                    </p>
                </div>
            </div>

            <div className="stop-body">
                {/* Date & Budget Allocation Row */}
                <div className="stop-metrics-row">
                    <div className="metric-pill">
                        <Calendar size={18} className="pill-icon" />
                        <div>
                            <span className="pill-label">DATES</span>
                            <span className="pill-val">
                                {stop.startDate && stop.endDate
                                    ? `${stop.startDate} - ${stop.endDate}`
                                    : 'Dates not set'}
                            </span>
                        </div>
                    </div>

                    <div className="metric-pill">
                        <Wallet size={18} className="pill-icon" />
                        <div>
                            <span className="pill-label">ESTIMATED COST</span>
                            <span className="pill-val">
                                {currency} {stopTotalCost.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stay / Accommodation Module */}
                <div className="accommodation-module">
                    <h4 className="module-title">
                        <Bed size={18} className="stay-icon" />
                        <span>Stay & Lodging</span>
                    </h4>
                    <div className="stay-card">
                        <div className="stay-thumb">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80"
                                alt="Lodging"
                                className="stay-img"
                            />
                        </div>
                        <div className="stay-info">
                            <h5 className="stay-hotel-name">
                                {stop.cityName ? `Grand Hotel ${stop.cityName}` : 'Boutique Hotel'}
                            </h5>
                            <p className="stay-details">3 Nights • Deluxe King Room</p>
                            <span className="stay-badge-confirmed">CONFIRMED</span>
                        </div>
                        <button type="button" className="stay-edit-btn" title="Edit Lodging">
                            <Edit size={16} />
                        </button>
                    </div>
                </div>

                {/* Itinerary Activities Timeline */}
                <div className="activities-timeline-section">
                    <div className="timeline-header">
                        <h4 className="module-title">
                            <Compass size={18} className="activity-icon" />
                            <span>Itinerary Schedule ({activities.length} activities)</span>
                        </h4>
                        <button
                            type="button"
                            className="add-activity-cta"
                            onClick={() => onOpenAddActivity(stop.id)}
                        >
                            <Plus size={16} /> Add Activity
                        </button>
                    </div>

                    <div className="activities-timeline-stream">
                        {activities.map((act) => (
                            <ActivityTimelineItem
                                key={act.id}
                                activity={act}
                                onDelete={(actId) => onDeleteActivity(stop.id, actId)}
                            />
                        ))}

                        {activities.length === 0 && (
                            <div className="empty-activities-prompt">
                                <p>No activities scheduled for this stop yet.</p>
                                <button
                                    type="button"
                                    className="add-first-activity-btn"
                                    onClick={() => onOpenAddActivity(stop.id)}
                                >
                                    <Plus size={14} /> Schedule First Activity
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI / Curated Discovery Suggestion */}
                <div className="ai-suggestion-card">
                    <div className="ai-sparkle-orb">
                        <Sparkles size={20} />
                    </div>
                    <div className="ai-suggestion-text">
                        <h5 className="suggestion-title">
                            Curated Suggestion: {stop.cityName} Highlights Tour
                        </h5>
                        <p className="suggestion-desc">
                            Top-rated experience among travelers visiting{' '}
                            {stop.cityName || 'this city'}.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="add-suggestion-btn"
                        onClick={() =>
                            onAddSuggestedActivity?.(stop.id, {
                                name: `${stop.cityName || 'City'} Highlights Walking Tour`,
                                category: 'Culture',
                                durationMinutes: 120,
                                cost: 35,
                                notes: 'Guided exploration of historic landmarks.',
                            })
                        }
                    >
                        Add to Itinerary
                    </button>
                </div>
            </div>
        </article>
    );
}

export default StopCard;
