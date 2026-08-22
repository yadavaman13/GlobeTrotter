import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ChevronRight, MapPin, Calendar, PieChart, Compass, Wallet } from 'lucide-react';
import { useItinerary } from '../hooks/useItinerary';
import TimelineScheduleView from '../components/TimelineScheduleView';
import '../styles/trip-timeline-page.scss';

export function TripTimelinePage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { trip, timelineData, loading, loadTimeline, loadItinerary } = useItinerary();

    useEffect(() => {
        if (tripId) {
            loadItinerary(tripId);
            loadTimeline(tripId);
        }
    }, [tripId, loadItinerary, loadTimeline]);

    const days = timelineData?.days || [];
    const summary = timelineData?.summary;
    const currency = summary?.currency || trip?.budgetCurrency || 'USD';

    return (
        <div className="trip-timeline-container">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
                <Link to="/dashboard/user/home">Home</Link>
                <ChevronRight size={14} className="crumb-icon" />
                <Link to="/dashboard/user/trips">My Trips</Link>
                <ChevronRight size={14} className="crumb-icon" />
                <Link to={`/dashboard/user/trips/${tripId}/itinerary`}>
                    {trip?.name || 'Itinerary'}
                </Link>
                <ChevronRight size={14} className="crumb-icon" />
                <span className="current-page">Timeline Schedule</span>
            </nav>

            {/* Header */}
            <div className="timeline-header-row">
                <div className="heading-group">
                    <h1 className="page-title">{trip?.name || 'Trip Timeline'}</h1>
                    <p className="page-subtitle">
                        Day-by-day chronological schedule, stops, and activities flow.
                    </p>
                </div>

                <div className="header-actions">
                    <div className="view-tabs">
                        <button
                            type="button"
                            className="tab-btn"
                            onClick={() => navigate(`/dashboard/user/trips/${tripId}/itinerary`)}
                        >
                            <MapPin size={16} />
                            <span>Itinerary Builder</span>
                        </button>
                        <button type="button" className="tab-btn active">
                            <Calendar size={16} />
                            <span>Timeline View</span>
                        </button>
                        <button
                            type="button"
                            className="tab-btn"
                            onClick={() => navigate(`/dashboard/user/trips/${tripId}/budget`)}
                        >
                            <PieChart size={16} />
                            <span>Budget</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Bar */}
            {summary && (
                <div className="timeline-summary-bar">
                    <div className="summary-metric">
                        <Calendar size={20} className="metric-icon" />
                        <div className="metric-info">
                            <span className="label">Total Duration</span>
                            <span className="val">{summary.totalDays} Days</span>
                        </div>
                    </div>

                    <div className="summary-metric">
                        <MapPin size={20} className="metric-icon" />
                        <div className="metric-info">
                            <span className="label">Destinations</span>
                            <span className="val">{summary.totalStops} Cities</span>
                        </div>
                    </div>

                    <div className="summary-metric">
                        <Compass size={20} className="metric-icon" />
                        <div className="metric-info">
                            <span className="label">Activities</span>
                            <span className="val">{summary.totalActivities} Planned</span>
                        </div>
                    </div>

                    <div className="summary-metric">
                        <Wallet size={20} className="metric-icon" />
                        <div className="metric-info">
                            <span className="label">Est. Total Cost</span>
                            <span className="val">
                                {currency} {Number(summary.totalCost || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Chronological Day-by-Day Schedule */}
            {loading && <p>Synthesizing chronological timeline...</p>}
            {!loading && <TimelineScheduleView days={days} summary={summary} currency={currency} />}
        </div>
    );
}

export default TripTimelinePage;
