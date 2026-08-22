import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { Plane, Search, ChevronRight, Cloud, ArrowRight } from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import { useCitySearch } from '../../explore/hooks/useCitySearch';
import * as exploreApi from '../../explore/services/explore.api';
import * as itineraryApi from '../../itinerary/services/itinerary.api';
import { useToast } from '@/components/Shared/Feedback/Toast';
import TripLivePreviewCard from '../components/TripLivePreviewCard';
import CuratedActivitySuggestions from '../components/CuratedActivitySuggestions';
import '../styles/create-trip-page.scss';

const POPULAR_DESTINATIONS = [
    {
        name: 'Kyoto',
        country: 'Japan',
        flag: '🇯🇵',
        cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Paris',
        country: 'France',
        flag: '🇫🇷',
        cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Bali',
        country: 'Indonesia',
        flag: '🇮🇩',
        cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Rome',
        country: 'Italy',
        flag: '🇮🇹',
        cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Tokyo',
        country: 'Japan',
        flag: '🇯🇵',
        cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    },
];

export function CreateTripPage() {
    const navigate = useNavigate();
    const { handleCreateTrip, loading } = useTrips();
    const { toast } = useToast();

    const [tripName, setTripName] = useState('Japan Autumn Adventure');
    const [destinationInput, setDestinationInput] = useState('Kyoto');
    const [selectedCity, setSelectedCity] = useState(null);
    const [startDate, setStartDate] = useState('2026-10-12');
    const [endDate, setEndDate] = useState('2026-10-25');
    const [budgetAmount, setBudgetAmount] = useState('5000');
    const [budgetCurrency, setBudgetCurrency] = useState('USD');
    const [description, setDescription] = useState(
        'A scenic cultural adventure exploring historic shrines, tea ceremonies, and culinary gems.',
    );
    const [coverPhotoUrl, setCoverPhotoUrl] = useState(
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    );

    const [curatedActivities, setCuratedActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [selectedActivityIds, setSelectedActivityIds] = useState(new Set());

    const { cities, setSearchTerm } = useCitySearch(destinationInput);

    const loadCityActivities = useCallback(async (cityId) => {
        try {
            const res = await exploreApi.getCityActivities(cityId);
            if (res?.success && res.activities?.length > 0) {
                setCuratedActivities(res.activities);
            }
        } catch (err) {
            console.error('Failed to load city activities:', err);
        }
    }, []);

    // Initial search for city matches
    useEffect(() => {
        if (cities.length > 0 && !selectedCity) {
            const match =
                cities.find((c) => c.name.toLowerCase() === destinationInput.toLowerCase()) ||
                cities[0];
            if (match) {
                setSelectedCity(match);
                loadCityActivities(match.id);
            }
        }
    }, [cities, destinationInput, selectedCity, loadCityActivities]);

    const handleSelectPopularCity = (item) => {
        setDestinationInput(item.name);
        setSearchTerm(item.name);
        setCoverPhotoUrl(item.cover);
        setTripName(`${item.name} Experience`);
        const found = cities.find((c) => c.name.toLowerCase() === item.name.toLowerCase());
        if (found) {
            setSelectedCity(found);
            loadCityActivities(found.id);
        }
    };

    const handleToggleActivity = (activity) => {
        const id = activity.id;
        setSelectedActivityIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                setSelectedActivities((curr) => curr.filter((a) => a.id !== id));
            } else {
                next.add(id);
                setSelectedActivities((curr) => [...curr, activity]);
            }
            return next;
        });
    };

    const handleSaveAndContinue = async (status = 'draft') => {
        if (!tripName.trim()) {
            toast({ type: 'error', message: 'Please enter a trip name' });
            return;
        }

        try {
            const payload = {
                name: tripName,
                description,
                startDate: startDate || new Date().toISOString().split('T')[0],
                endDate: endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                budgetAmount: budgetAmount ? parseFloat(budgetAmount) : 0,
                budgetCurrency,
                coverPhotoUrl,
                status,
                visibility: 'private',
            };

            const created = await handleCreateTrip(payload);

            // If a city was picked, create the initial stop
            if (created?.id && selectedCity?.id) {
                try {
                    const stopRes = await itineraryApi.createStop(created.id, {
                        cityId: selectedCity.id,
                        startDate: payload.startDate,
                        endDate: payload.endDate,
                        sequenceOrder: 1,
                    });

                    // If activities were selected, attach them to this stop
                    if (stopRes?.success && stopRes.stop?.id && selectedActivities.length > 0) {
                        for (let i = 0; i < selectedActivities.length; i++) {
                            const act = selectedActivities[i];
                            await itineraryApi.createActivity(created.id, stopRes.stop.id, {
                                activityId: act.id.startsWith('sug-') ? undefined : act.id,
                                activityDate: payload.startDate,
                                startTime: i === 0 ? '09:00:00' : i === 1 ? '13:30:00' : '16:00:00',
                                sequenceOrder: i + 1,
                                notes: act.description,
                            });
                        }
                    }
                } catch (stopErr) {
                    console.warn('Initial stop creation note:', stopErr);
                }
            }

            toast({
                type: 'success',
                message: `Trip "${created.name}" created! Redirecting to Itinerary Builder...`,
            });

            navigate(`/dashboard/user/trips/${created.id}/itinerary`);
        } catch (err) {
            console.error('Trip creation failed:', err);
            toast({
                type: 'error',
                message: err.response?.data?.message || err.message || 'Failed to create trip',
            });
        }
    };

    return (
        <div className="plan-trip-container">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs-bar" aria-label="Breadcrumb">
                <Link to="/dashboard/user/home">Home</Link>
                <span className="separator">
                    <ChevronRight size={14} />
                </span>
                <Link to="/dashboard/user/trips">My Trips</Link>
                <span className="separator">
                    <ChevronRight size={14} />
                </span>
                <span className="active">Create Trip</span>
            </nav>

            {/* Page Header */}
            <div className="page-title-row">
                <h1 className="page-heading">Plan a new trip</h1>
                <Plane className="page-icon" size={32} />
            </div>

            {/* Main 2-Column Grid */}
            <div className="two-column-layout">
                {/* Left Column: Form & Curated Activities */}
                <div className="form-column">
                    <section className="basics-card">
                        <h2 className="section-title">The Basics</h2>

                        <div className="form-group">
                            <label className="field-label">Trip Name</label>
                            <input
                                type="text"
                                value={tripName}
                                onChange={(e) => setTripName(e.target.value)}
                                placeholder="e.g., Summer in Kyoto, European Odyssey"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="field-label">Primary Destination</label>
                            <div className="input-wrapper">
                                <Search className="input-icon" size={18} />
                                <input
                                    type="text"
                                    value={destinationInput}
                                    onChange={(e) => {
                                        setDestinationInput(e.target.value);
                                        setSearchTerm(e.target.value);
                                    }}
                                    placeholder="Search a city or country..."
                                />
                            </div>

                            {/* Popular City Quick Chips */}
                            <div className="chips-list">
                                {POPULAR_DESTINATIONS.map((dest) => (
                                    <button
                                        key={dest.name}
                                        type="button"
                                        className={`city-chip ${destinationInput.toLowerCase() === dest.name.toLowerCase() ? 'active' : ''}`}
                                        onClick={() => handleSelectPopularCity(dest)}
                                    >
                                        <span>{dest.flag}</span>
                                        <span>{dest.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="field-label">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="field-label">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="field-label">Baseline Target Budget</label>
                                <input
                                    type="number"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    placeholder="e.g. 5000"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="field-label">Currency</label>
                                <select
                                    value={budgetCurrency}
                                    onChange={(e) => setBudgetCurrency(e.target.value)}
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="field-label">Trip Description & Notes</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what you want to experience on this journey..."
                            />
                        </div>
                    </section>

                    {/* Curated Activity Suggestions Grid */}
                    <CuratedActivitySuggestions
                        activities={curatedActivities}
                        selectedActivityIds={selectedActivityIds}
                        onToggleActivity={handleToggleActivity}
                    />
                </div>

                {/* Right Column: Live Preview Card */}
                <div className="preview-column">
                    <TripLivePreviewCard
                        title={tripName}
                        destination={destinationInput}
                        startDate={startDate}
                        endDate={endDate}
                        budgetAmount={budgetAmount}
                        budgetCurrency={budgetCurrency}
                        coverPhotoUrl={coverPhotoUrl}
                        selectedActivities={selectedActivities}
                    />
                </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="sticky-bottom-action-bar">
                <div className="autosave-status">
                    <Cloud size={18} />
                    <span>Autosaved just now</span>
                </div>

                <div className="action-buttons-group">
                    <button
                        type="button"
                        className="draft-btn"
                        onClick={() => handleSaveAndContinue('draft')}
                        disabled={loading}
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        className="continue-btn"
                        onClick={() => handleSaveAndContinue('planned')}
                        disabled={loading}
                    >
                        <span>Continue to Builder</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTripPage;
