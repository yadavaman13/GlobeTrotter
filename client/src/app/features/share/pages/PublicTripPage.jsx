import { useParams, useNavigate, Link } from 'react-router';
import { Compass, Copy } from 'lucide-react';
import { usePublicTrip } from '../hooks/usePublicTrip';
import { useAuth } from '../../auth/hooks/useAuth';
import { useToast } from '@/components/Shared/Feedback/Toast';
import PublicTripHeader from '../components/PublicTripHeader';
import PublicTimelineView from '../components/PublicTimelineView';
import '../styles/public-trip-page.scss';

export function PublicTripPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const { trip, loading, cloneLoading, error, handleCloneTrip } = usePublicTrip(slug);

    const onCloneClick = async () => {
        if (!user) {
            toast({
                type: 'info',
                message:
                    'Please login or create an account to copy this itinerary to your profile.',
            });
            navigate('/login');
            return;
        }

        try {
            const cloned = await handleCloneTrip();
            if (cloned?.id) {
                toast({
                    type: 'success',
                    message: `Itinerary cloned! Welcome to your new trip builder for "${cloned.name}".`,
                });
                navigate(`/trips/${cloned.id}/itinerary`);
            }
        } catch (err) {
            console.error('Failed to clone trip:', err);
            toast({
                type: 'error',
                message: err.response?.data?.message || err.message || 'Failed to clone trip',
            });
        }
    };

    if (loading) {
        return (
            <div className="public-trip-page-container">
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <h2>Loading public itinerary...</h2>
                </div>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="public-trip-page-container">
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <h2>Itinerary Not Found or Private</h2>
                    <p>The shared trip you are looking for might be private or does not exist.</p>
                    <Link to="/login" style={{ color: '#FF385C', fontWeight: 600 }}>
                        Return to GlobeTrotter Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="public-trip-page-container">
            {/* Top Brand Bar */}
            <div className="public-top-bar">
                <Link to="/" className="brand-logo-link">
                    <Compass size={24} className="brand-icon" />
                    <span>GlobeTrotter</span>
                </Link>

                <button
                    type="button"
                    className="top-bar-cta"
                    onClick={onCloneClick}
                    disabled={cloneLoading}
                >
                    <Copy size={16} />
                    <span>{cloneLoading ? 'Duplicating...' : 'Copy Trip'}</span>
                </button>
            </div>

            {/* Public Trip Hero */}
            <PublicTripHeader trip={trip} onClone={onCloneClick} cloneLoading={cloneLoading} />

            {/* Main Content Timeline */}
            <main className="public-main-content">
                <h2 className="section-headline">Full Journey Itinerary</h2>
                <PublicTimelineView
                    stops={trip.stops || []}
                    currency={trip.budgetCurrency || 'USD'}
                />
            </main>
        </div>
    );
}

export default PublicTripPage;
