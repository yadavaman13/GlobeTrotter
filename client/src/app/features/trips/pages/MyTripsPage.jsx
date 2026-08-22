import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Compass } from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import { useToast } from '@/components/Shared/Feedback/Toast';
import TripCard from '../components/TripCard';
import TripFilters from '../components/TripFilters';
import '../styles/my-trips-page.scss';

export function MyTripsPage() {
    const navigate = useNavigate();
    const { trips, loading, fetchTrips, handleDeleteTrip, handleCloneTrip } = useTrips();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeStatus, setActiveStatus] = useState('all');

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const filteredTrips = useMemo(() => {
        return trips.filter((t) => {
            const matchesStatus =
                activeStatus === 'all' || t.status?.toLowerCase() === activeStatus.toLowerCase();

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                t.name?.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [trips, activeStatus, searchQuery]);

    const onDeleteTrip = async (tripId) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;
        try {
            await handleDeleteTrip(tripId);
            toast({ type: 'success', message: 'Trip deleted successfully' });
        } catch (err) {
            console.error('Delete trip error:', err);
            toast({ type: 'error', message: 'Failed to delete trip' });
        }
    };

    const onCloneTrip = async (tripId, title) => {
        try {
            const cloned = await handleCloneTrip(tripId, title);
            toast({ type: 'success', message: `Trip duplicated as "${cloned.name}"!` });
            navigate(`/dashboard/user/trips/${cloned.id}/itinerary`);
        } catch (err) {
            console.error('Clone trip error:', err);
            toast({ type: 'error', message: 'Failed to duplicate trip' });
        }
    };

    return (
        <div className="my-trips-page-container">
            {/* Page Header */}
            <div className="page-header-row">
                <div className="header-title-group">
                    <h1 className="page-title">My Travel Journeys</h1>
                    <p className="page-subtitle">
                        Manage your multi-city itineraries, budget breakdowns, and shared
                        adventures.
                    </p>
                </div>

                <Link to="/dashboard/user/trips/new" className="plan-new-trip-cta">
                    <Plus size={18} />
                    <span>Plan New Trip</span>
                </Link>
            </div>

            {/* Filters Bar */}
            <TripFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeStatus={activeStatus}
                onStatusChange={setActiveStatus}
            />

            {/* Trips List / Grid */}
            {loading && trips.length === 0 ? (
                <p>Loading your trips...</p>
            ) : filteredTrips.length > 0 ? (
                <div className="trips-card-grid">
                    {filteredTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onDelete={onDeleteTrip}
                            onClone={onCloneTrip}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-trips-view">
                    <div className="empty-illustration-icon">
                        <Compass size={32} />
                    </div>
                    <h3 className="empty-heading">No trips found</h3>
                    <p className="empty-message">
                        {searchQuery || activeStatus !== 'all'
                            ? 'No journeys match your active filters. Try adjusting your search query.'
                            : "You haven't planned any trips yet. Start designing your first dream multi-city journey today!"}
                    </p>
                    <Link to="/dashboard/user/trips/new" className="empty-action-btn">
                        <Plus size={16} /> Plan a New Trip
                    </Link>
                </div>
            )}
        </div>
    );
}

export default MyTripsPage;
