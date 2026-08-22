import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import { UserProfileContext } from '../../context/userProfile.context';
import { useUserProfile } from '../../hooks/useUserProfile';
import { getAvatarUrl } from '@/utils/avatar';
import { CheckCircle2, Share2, Edit2, Compass, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/Shared/Feedback/Toast';
import './UserProfilePage.scss';

export default function UserProfilePage() {
    const navigate = useNavigate();
    const { success } = useToast();
    const { user } = useAuth();
    const { trips, loading } = useContext(UserProfileContext);
    const { loadTrips } = useUserProfile();

    useEffect(() => {
        loadTrips();
    }, [loadTrips]);

    const handleShareProfile = () => {
        navigator.clipboard.writeText(window.location.href);
        success('Profile link copied to clipboard!');
    };

    const handleEditProfile = () => {
        const roleSegment = user?.role?.toLowerCase() === 'admin' ? 'admin' : 'user';
        navigate(`/dashboard/${roleSegment}/settings/account`);
    };

    const handleViewItinerary = () => {
        // Navigate to the planning tool
        navigate('/dashboard/user/analytics/insight');
    };

    // Filter trips for preplanned (planned/draft) and previous (completed)
    const preplannedTrips = trips.filter((t) => t.status === 'planned');
    const previousTrips = trips.filter((t) => t.status === 'completed');

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Traveler';
    const tagline = user?.additionalInformation || 'Passionate Explorer & Photography Enthusiast';
    const avatarUrl = getAvatarUrl(user?.profileImage);

    return (
        <div className="user-profile-page-container">
            {/* Hero Profile Banner */}
            <section className="profile-hero-banner">
                <div className="banner-gradient-overlay" />
                <div className="banner-content-wrapper">
                    <div className="avatar-and-names">
                        <div className="avatar-border-glow">
                            <img src={avatarUrl} alt={fullName} className="profile-large-avatar" />
                        </div>
                        <div className="name-details">
                            <h1 className="user-name">
                                {fullName}
                                <span className="verified-badge-inline" title="Verified Traveler">
                                    <CheckCircle2
                                        size={20}
                                        fill="currentColor"
                                        className="check-icon"
                                    />
                                </span>
                            </h1>
                            <p className="user-tagline">{tagline}</p>
                        </div>
                    </div>
                    <div className="banner-actions">
                        <button className="banner-btn edit-btn" onClick={handleEditProfile}>
                            <Edit2 size={16} />
                            <span>Edit Profile</span>
                        </button>
                        <button
                            className="banner-btn share-btn"
                            onClick={handleShareProfile}
                            title="Share Profile"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Preplanned Trips Section */}
            <section className="profile-section-block">
                <h2 className="section-title">Preplanned Trips</h2>
                {loading ? (
                    <div className="loading-placeholder">Loading itineraries...</div>
                ) : (
                    <div className="profile-trips-grid">
                        {preplannedTrips.slice(0, 3).map((trip) => (
                            <div
                                key={trip.id}
                                className="trip-card-simple hover-lift"
                                onClick={() => handleViewItinerary(trip)}
                            >
                                <div className="card-img-wrapper">
                                    <img src={trip.coverPhotoUrl} alt={trip.name} />
                                    {trip.daysToStart && (
                                        <div className="days-badge">
                                            Starts in {trip.daysToStart} days
                                        </div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <h3 className="trip-title">{trip.name}</h3>
                                    <p className="trip-loc">{trip.destination}</p>
                                    <div className="card-action">
                                        <span>View Itinerary</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {preplannedTrips.length === 0 && (
                            <div className="no-trips-placeholder">
                                <Compass size={32} />
                                <p>No preplanned trips found.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Previous Trips Section */}
            <section className="profile-section-block">
                <h2 className="section-title">Previous Trips</h2>
                {loading ? (
                    <div className="loading-placeholder">Loading previous trips...</div>
                ) : (
                    <div className="profile-trips-grid">
                        {previousTrips.slice(0, 3).map((trip) => (
                            <div key={trip.id} className="trip-card-simple hover-lift">
                                <div className="card-img-wrapper">
                                    <img src={trip.coverPhotoUrl} alt={trip.name} />
                                    <div className="completed-badge">
                                        <CheckCircle2 size={12} fill="currentColor" />
                                        <span>Completed</span>
                                    </div>
                                </div>
                                <div className="card-info">
                                    <h3 className="trip-title">{trip.name}</h3>
                                    <div className="star-rating-row">
                                        {[...Array(5)].map((_, i) => {
                                            const ratingVal = Math.round(trip.rating || 5);
                                            return (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < ratingVal ? 'currentColor' : 'none'}
                                                    className="star-icon"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {previousTrips.length === 0 && (
                            <div className="no-trips-placeholder">
                                <Compass size={32} />
                                <p>No previous trips found.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
