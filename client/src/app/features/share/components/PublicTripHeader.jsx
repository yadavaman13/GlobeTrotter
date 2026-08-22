import { Calendar, MapPin, Wallet, Copy, User } from 'lucide-react';

export function PublicTripHeader({ trip, onClone, cloneLoading }) {
    const defaultCover =
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';

    const owner = trip?.owner;
    const ownerName = owner
        ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'GlobeTrotter Traveler'
        : 'GlobeTrotter Traveler';

    const stops = trip?.stops || [];
    const stopCities = stops.map((s) => s.cityName || s.city?.name).filter(Boolean);

    return (
        <header className="public-trip-hero">
            <div
                className="hero-background-media"
                style={{
                    backgroundImage: `url('${trip?.coverPhotoUrl || defaultCover}')`,
                }}
            >
                <div className="hero-scrim-gradient" />
            </div>

            <div className="hero-content-wrapper">
                <div className="hero-meta-badge">
                    <span>Public Travel Itinerary</span>
                </div>

                <h1 className="hero-trip-title">{trip?.name || 'Shared Itinerary'}</h1>

                {trip?.description && <p className="hero-trip-description">{trip.description}</p>}

                {/* Creator Profile & Trip Info Row */}
                <div className="hero-creator-row">
                    <div className="creator-profile">
                        <div className="creator-avatar">
                            {owner?.profileImage ? (
                                <img src={owner.profileImage} alt={ownerName} />
                            ) : (
                                <User size={18} />
                            )}
                        </div>
                        <div className="creator-info">
                            <span className="creator-label">Planned by</span>
                            <span className="creator-name">{ownerName}</span>
                        </div>
                    </div>

                    <div className="trip-key-stats">
                        <div className="stat-item">
                            <Calendar size={16} />
                            <span>
                                {trip?.startDate && trip?.endDate
                                    ? `${trip.startDate} - ${trip.endDate}`
                                    : 'Dates flexible'}
                            </span>
                        </div>

                        {stopCities.length > 0 && (
                            <div className="stat-item">
                                <MapPin size={16} />
                                <span>{stopCities.join(' → ')}</span>
                            </div>
                        )}

                        {trip?.budgetAmount && (
                            <div className="stat-item">
                                <Wallet size={16} />
                                <span>
                                    Target Budget: {trip.budgetCurrency || '$'}
                                    {Number(trip.budgetAmount).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="copy-trip-hero-btn"
                        onClick={onClone}
                        disabled={cloneLoading}
                    >
                        <Copy size={16} />
                        <span>{cloneLoading ? 'Duplicating...' : 'Copy Trip to My Account'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default PublicTripHeader;
