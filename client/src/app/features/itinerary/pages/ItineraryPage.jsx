import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
    ChevronRight,
    MapPin,
    Plus,
    Share2,
    Calendar,
    PieChart,
    Cloud,
    ArrowRight,
} from 'lucide-react';
import { useItinerary } from '../hooks/useItinerary';
import { useTrips } from '../../trips/hooks/useTrips';
import { useToast } from '@/components/Shared/Feedback/Toast';
import TripRouteSidebar from '../components/TripRouteSidebar';
import StopCard from '../components/StopCard';
import BudgetOverviewWidget from '../components/BudgetOverviewWidget';
import AddStopModal from '../components/AddStopModal';
import AddActivityModal from '../components/AddActivityModal';
import ShareTripModal from '../components/ShareTripModal';
import '../styles/itinerary-page.scss';

export function ItineraryPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const {
        trip,
        stops,
        activeStopId,
        setActiveStopId,
        loading,
        loadItinerary,
        handleAddStop,
        handleDeleteStop,
        handleAddActivity,
        handleDeleteActivity,
    } = useItinerary();

    const { handleToggleVisibility } = useTrips();

    // Modals state
    const [isAddStopOpen, setIsAddStopOpen] = useState(false);
    const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
    const [selectedStopForActivity, setSelectedStopForActivity] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        if (tripId) {
            loadItinerary(tripId);
        }
    }, [tripId, loadItinerary]);

    const handleOpenAddActivityModal = (stopId) => {
        const targetStop = stops.find((s) => s.id === stopId);
        setSelectedStopForActivity(targetStop || null);
        setIsAddActivityOpen(true);
    };

    const handleCreateActivitySubmit = async (stopId, activityData) => {
        try {
            await handleAddActivity(stopId, activityData);
            toast({ type: 'success', message: 'Activity scheduled successfully!' });
        } catch (err) {
            console.error('Failed to add activity:', err);
            toast({ type: 'error', message: err.message || 'Failed to add activity' });
        }
    };

    const handleCreateStopSubmit = async (stopData) => {
        try {
            await handleAddStop(stopData);
            toast({ type: 'success', message: 'Destination city added to trip!' });
        } catch (err) {
            console.error('Failed to add stop:', err);
            toast({ type: 'error', message: err.message || 'Failed to add destination' });
        }
    };

    const handleDeleteStopAction = async (stopId) => {
        try {
            await handleDeleteStop(stopId);
            toast({ type: 'success', message: 'Destination removed from trip' });
        } catch (err) {
            console.error('Failed to delete stop:', err);
            toast({ type: 'error', message: 'Failed to delete stop' });
        }
    };

    const handleDeleteActivityAction = async (stopId, activityId) => {
        try {
            await handleDeleteActivity(stopId, activityId);
            toast({ type: 'success', message: 'Activity removed' });
        } catch (err) {
            console.error('Failed to delete activity:', err);
            toast({ type: 'error', message: 'Failed to remove activity' });
        }
    };

    // Calculate total estimated across all stops
    const totalEstimated = stops.reduce((acc, stop) => {
        const stopTotal = (stop.activities || []).reduce(
            (sum, act) => sum + (parseFloat(act.cost) || 0),
            0,
        );
        return acc + stopTotal;
    }, 0);

    return (
        <div className="itinerary-page-container">
            {/* Top Navigation & Header */}
            <div className="top-header-section">
                <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} className="crumb-icon" />
                    <Link to="/me/trips">My Trips</Link>
                    <ChevronRight size={14} className="crumb-icon" />
                    <span className="current-page">{trip?.name || 'Itinerary Builder'}</span>
                </nav>

                <div className="header-title-row">
                    <h1 className="main-heading">{trip?.name || 'Itinerary Builder'}</h1>

                    {/* View Switcher Tabs */}
                    <div className="header-tabs">
                        <button type="button" className="nav-tab-btn active">
                            <MapPin size={16} />
                            <span>Itinerary Builder</span>
                        </button>
                        <button
                            type="button"
                            className="nav-tab-btn"
                            onClick={() => navigate(`/trips/${tripId}/timeline`)}
                        >
                            <Calendar size={16} />
                            <span>Timeline & Calendar</span>
                        </button>
                        <button
                            type="button"
                            className="nav-tab-btn"
                            onClick={() => navigate(`/trips/${tripId}/budget`)}
                        >
                            <PieChart size={16} />
                            <span>Budget Analytics</span>
                        </button>
                    </div>

                    <div className="header-right-actions">
                        <button
                            type="button"
                            className="share-btn"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 size={16} />
                            <span>Share Trip</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3-Column Master Layout */}
            <div className="three-column-builder-layout">
                {/* Left Column (22%): Sticky Route Timeline */}
                <TripRouteSidebar
                    stops={stops}
                    activeStopId={activeStopId}
                    onSelectStop={(id) => setActiveStopId(id)}
                    onOpenAddStop={() => setIsAddStopOpen(true)}
                />

                {/* Center Column (56%): Stops & Activity Builder */}
                <section className="itinerary-main-section">
                    {loading && stops.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: '#6A6A6A' }}>
                            <p>Loading trip destinations and schedule...</p>
                        </div>
                    ) : (
                        stops.map((stop, idx) => (
                            <StopCard
                                key={stop.id}
                                stop={stop}
                                index={idx}
                                currency={trip?.budgetCurrency || 'USD'}
                                onOpenAddActivity={handleOpenAddActivityModal}
                                onDeleteStop={handleDeleteStopAction}
                                onDeleteActivity={handleDeleteActivityAction}
                                onAddSuggestedActivity={(stopId, actData) =>
                                    handleCreateActivitySubmit(stopId, actData)
                                }
                            />
                        ))
                    )}

                    {/* Add Another City Card */}
                    <button
                        type="button"
                        className="add-city-dashed-card"
                        onClick={() => setIsAddStopOpen(true)}
                    >
                        <Plus size={28} />
                        <span>Add Another City or Destination</span>
                    </button>
                </section>

                {/* Right Column (22%): Budget Summary Widget */}
                <aside className="trip-summary-sidebar">
                    <BudgetOverviewWidget
                        tripId={tripId}
                        totalBudget={trip?.budgetAmount || trip?.totalBudget || 0}
                        totalEstimated={totalEstimated}
                        currency={trip?.budgetCurrency || 'USD'}
                        onOpenShare={() => setIsShareModalOpen(true)}
                    />
                </aside>
            </div>

            {/* Bottom Sticky Action Toolbar */}
            <div className="bottom-builder-toolbar">
                <div className="autosave-pill">
                    <Cloud size={16} />
                    <span>Autosaved just now</span>
                </div>

                <div className="toolbar-buttons">
                    <button
                        type="button"
                        className="preview-btn"
                        onClick={() => navigate(`/trips/${tripId}/timeline`)}
                    >
                        Preview Itinerary
                    </button>
                    <button
                        type="button"
                        className="finalize-btn"
                        onClick={() => setIsShareModalOpen(true)}
                    >
                        <span>Share & Finalize</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AddStopModal
                isOpen={isAddStopOpen}
                onClose={() => setIsAddStopOpen(false)}
                onAddStop={handleCreateStopSubmit}
                tripStartDate={trip?.startDate}
                tripEndDate={trip?.endDate}
            />

            <AddActivityModal
                isOpen={isAddActivityOpen}
                onClose={() => {
                    setIsAddActivityOpen(false);
                    setSelectedStopForActivity(null);
                }}
                onAddActivity={handleCreateActivitySubmit}
                stopId={selectedStopForActivity?.id}
                cityId={selectedStopForActivity?.cityId || selectedStopForActivity?.city?.id}
                cityName={selectedStopForActivity?.cityName || selectedStopForActivity?.city?.name}
                stopStartDate={selectedStopForActivity?.startDate}
                stopEndDate={selectedStopForActivity?.endDate}
            />

            <ShareTripModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                trip={trip}
                onToggleVisibility={async (id, vis) => {
                    await handleToggleVisibility(id, vis);
                    await loadItinerary(tripId);
                }}
            />
        </div>
    );
}

export default ItineraryPage;
