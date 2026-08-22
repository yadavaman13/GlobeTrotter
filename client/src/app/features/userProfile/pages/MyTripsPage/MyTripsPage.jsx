import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserProfileContext } from '../../context/userProfile.context';
import { useUserProfile } from '../../hooks/useUserProfile';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import {
    PlaneTakeoff,
    Compass,
    CalendarRange,
    Globe,
    Search,
    SlidersHorizontal,
    Plus,
    Calendar,
    CloudSun,
    Star,
} from 'lucide-react';
import { useToast } from '@/components/Shared/Feedback/Toast';
import './MyTripsPage.scss';

export default function MyTripsPage() {
    const navigate = useNavigate();
    const { success } = useToast();
    const { trips, loading, stats } = useContext(UserProfileContext);
    const { loadTrips } = useUserProfile();

    const [searchVal, setSearchVal] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // empty means 'all'
    const [sortBy, setSortBy] = useState('startDate');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search trigger
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadTrips({
                search: searchVal,
                status: statusFilter,
                sortBy: sortBy,
                order: sortOrder,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchVal, statusFilter, sortBy, sortOrder, loadTrips]);

    // Grouping trips from current loaded list
    const ongoingTrips = trips.filter((t) => t.status === 'ongoing');
    const upcomingTrips = trips.filter((t) => t.status === 'planned');
    const completedTrips = trips.filter((t) => t.status === 'completed');

    const handlePlanTrip = () => {
        // Navigate to the AI trip planning panel
        navigate('/dashboard/user/analytics/insight');
    };

    const handleDuplicateTrip = (trip) => {
        success(`Trip "${trip.name}" duplicated successfully!`);
    };

    const handleViewMemories = (trip) => {
        success(`Opening travel journal for "${trip.name}"`);
    };

    const handleEditTrip = (trip) => {
        navigate(`/dashboard/user/analytics/insight?editTripId=${trip.id}`);
    };

    return (
        <div className="my-trips-page-container">
            {/* Header section with branding and primary Plan CTA */}
            <header className="page-header-row">
                <div className="title-area">
                    <span className="subtitle-tag">YOUR TRAVEL DASHBOARD</span>
                    <h1 className="main-title">My Trips</h1>
                </div>
                <Button
                    onClick={handlePlanTrip}
                    variant="primary"
                    className="plan-new-trip-btn"
                    icon={Plus}
                >
                    Plan New Trip
                </Button>
            </header>

            {/* Travel Summary Highlights Grid */}
            <section className="stats-dashboard-grid">
                <StatCard
                    title="Total Trips"
                    value={stats.totalTrips}
                    icon={PlaneTakeoff}
                    className="stat-card--total"
                />
                <StatCard
                    title="Ongoing Trips"
                    value={stats.ongoingCount}
                    icon={Compass}
                    className="stat-card--ongoing"
                />
                <StatCard
                    title="Upcoming Trips"
                    value={stats.upcomingCount}
                    icon={CalendarRange}
                    className="stat-card--upcoming"
                />
                <StatCard
                    title="Countries Visited"
                    value={stats.countriesCount}
                    icon={Globe}
                    className="stat-card--countries"
                />
            </section>

            {/* Search & Dynamic Filter Toolbar */}
            <div className="toolbar-section">
                <div className="search-bar-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search trips, destinations, or dates..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="toolbar-actions-row">
                    <Button
                        variant="secondary"
                        onClick={() => setShowFilters(!showFilters)}
                        icon={SlidersHorizontal}
                        className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                    >
                        Filters & Sort
                    </Button>
                </div>
            </div>

            {/* Expandable filter options panel */}
            {showFilters && (
                <div className="filters-expansion-panel">
                    <div className="filter-group">
                        <label>Filter by Status</label>
                        <div className="options-row">
                            <button
                                className={`option-chip ${statusFilter === '' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('')}
                            >
                                All Trips
                            </button>
                            <button
                                className={`option-chip ${statusFilter === 'ongoing' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('ongoing')}
                            >
                                Ongoing
                            </button>
                            <button
                                className={`option-chip ${statusFilter === 'planned' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('planned')}
                            >
                                Upcoming
                            </button>
                            <button
                                className={`option-chip ${statusFilter === 'completed' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('completed')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <div className="options-row">
                            <button
                                className={`option-chip ${sortBy === 'startDate' ? 'active' : ''}`}
                                onClick={() => setSortBy('startDate')}
                            >
                                Travel Date
                            </button>
                            <button
                                className={`option-chip ${sortBy === 'name' ? 'active' : ''}`}
                                onClick={() => setSortBy('name')}
                            >
                                Trip Name
                            </button>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Order</label>
                        <div className="options-row">
                            <button
                                className={`option-chip ${sortOrder === 'asc' ? 'active' : ''}`}
                                onClick={() => setSortOrder('asc')}
                            >
                                Chronological (Asc)
                            </button>
                            <button
                                className={`option-chip ${sortOrder === 'desc' ? 'active' : ''}`}
                                onClick={() => setSortOrder('desc')}
                            >
                                Latest first (Desc)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trips Lists Sections */}
            {loading ? (
                <div className="loading-spinner-wrapper">
                    <Spinner label="Loading your travels..." />
                </div>
            ) : (
                <div className="trips-sections-stack">
                    {/* 1. ONGOING ADVENTURES */}
                    {ongoingTrips.length > 0 && (
                        <section className="trip-section-block">
                            <h2 className="section-title">Ongoing Adventures</h2>
                            <div className="ongoing-trips-list">
                                {ongoingTrips.map((trip) => (
                                    <div key={trip.id} className="ongoing-trip-hero-card">
                                        <div className="hero-img-pane">
                                            <img
                                                src={trip.coverPhotoUrl}
                                                alt={trip.name}
                                                className="ongoing-trip-image"
                                            />
                                            <div className="status-badge-overlay">
                                                <span className="pulse-dot"></span>
                                                <span className="badge-text">Ongoing</span>
                                            </div>
                                        </div>
                                        <div className="hero-details-pane">
                                            <div className="details-header">
                                                <div className="title-group">
                                                    <h3 className="trip-name">{trip.name}</h3>
                                                    <p className="trip-destination">
                                                        {trip.destination}
                                                    </p>
                                                </div>
                                                <div className="progress-group">
                                                    <span className="progress-percentage">
                                                        {trip.progress}%
                                                    </span>
                                                    <div className="progress-radial-placeholder">
                                                        <svg
                                                            className="radial-svg"
                                                            viewBox="0 0 36 36"
                                                        >
                                                            <path
                                                                className="circle-bg"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                            <path
                                                                className="circle-fill"
                                                                strokeDasharray={`${trip.progress || 72}, 100`}
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="meta-info-row">
                                                <div className="meta-tag">
                                                    <Calendar className="meta-icon" size={16} />
                                                    <span>
                                                        {trip.startDate} - {trip.endDate}
                                                    </span>
                                                </div>
                                                {trip.weather && (
                                                    <div className="meta-tag weather-tag">
                                                        <CloudSun className="meta-icon" size={16} />
                                                        <span>{trip.weather}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="action-row">
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        navigate(
                                                            '/dashboard/user/analytics/insight',
                                                        )
                                                    }
                                                    className="resume-trip-btn"
                                                >
                                                    Resume Trip
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 2. UPCOMING TRIPS */}
                    {upcomingTrips.length > 0 && (
                        <section className="trip-section-block">
                            <h2 className="section-title">Upcoming Trips</h2>
                            <div className="upcoming-trips-grid">
                                {upcomingTrips.map((trip) => (
                                    <div key={trip.id} className="upcoming-trip-card hover-lift">
                                        <div className="card-img-wrapper">
                                            <img
                                                src={trip.coverPhotoUrl}
                                                alt={trip.name}
                                                className="card-image"
                                            />
                                            {trip.daysToStart && (
                                                <div className="days-tag-overlay">
                                                    <span>Starts in {trip.daysToStart} Days</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-content-pane">
                                            <h3 className="trip-name">{trip.name}</h3>
                                            <p className="trip-destination">{trip.destination}</p>
                                            <div className="card-footer border-t">
                                                <span className="budget-label">
                                                    Budget:{' '}
                                                    <strong className="text-ink">
                                                        ${trip.budgetAmount || '0'}
                                                    </strong>
                                                </span>
                                                <button
                                                    className="edit-trip-btn"
                                                    onClick={() => handleEditTrip(trip)}
                                                >
                                                    Edit Trip
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. COMPLETED JOURNEYS */}
                    {completedTrips.length > 0 && (
                        <section className="trip-section-block">
                            <div className="completed-header">
                                <h2 className="section-title">Completed Journeys</h2>
                                <p className="section-desc">
                                    Your travel memories and finished itineraries.
                                </p>
                            </div>
                            <div className="completed-trips-grid">
                                {completedTrips.map((trip) => (
                                    <div key={trip.id} className="completed-trip-card hover-lift">
                                        <div className="card-img-wrapper">
                                            <img
                                                src={trip.coverPhotoUrl}
                                                alt={trip.name}
                                                className="card-image"
                                            />
                                            <div className="completed-badge-overlay">
                                                <span>Completed</span>
                                            </div>
                                        </div>
                                        <div className="card-content-pane">
                                            <h3 className="trip-name">{trip.name}</h3>
                                            <p className="trip-meta">{trip.destination}</p>
                                            <div className="financials-row">
                                                <span className="spent-label">
                                                    Spent:{' '}
                                                    <strong className="text-ink">
                                                        ${trip.spent || trip.budgetAmount || '0'}
                                                    </strong>
                                                </span>
                                                {trip.rating && (
                                                    <div className="rating-badge">
                                                        <Star
                                                            size={14}
                                                            className="star-icon"
                                                            fill="currentColor"
                                                        />
                                                        <span>{trip.rating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="card-actions-footer border-t">
                                                <button
                                                    className="memories-btn text-primary"
                                                    onClick={() => handleViewMemories(trip)}
                                                >
                                                    View Memories
                                                </button>
                                                <button
                                                    className="duplicate-btn text-muted"
                                                    onClick={() => handleDuplicateTrip(trip)}
                                                >
                                                    Duplicate Trip
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty search results fallback */}
                    {trips.length === 0 && (
                        <div className="empty-results-box">
                            <Compass className="empty-icon text-muted" size={48} />
                            <h3>No trips match your filters</h3>
                            <p>Try resetting filters or planning a new adventure!</p>
                            <Button onClick={handlePlanTrip} variant="primary" className="mt-4">
                                Plan New Trip
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
