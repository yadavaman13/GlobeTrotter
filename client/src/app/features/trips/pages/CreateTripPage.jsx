import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { Plane, Search, ChevronRight, Cloud, ArrowRight, MapPin, Loader2, X } from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import { useCitySearch } from '../../explore/hooks/useCitySearch';
import * as exploreApi from '../../explore/services/explore.api';
import * as itineraryApi from '../../itinerary/services/itinerary.api';
import { useToast } from '@/components/Shared/Feedback/Toast';
import TripLivePreviewCard from '../components/TripLivePreviewCard';
import CuratedActivitySuggestions from '../components/CuratedActivitySuggestions';
import '../styles/create-trip-page.scss';

const DEFAULT_COVER_IMAGES = {
    Tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    Kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    Rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    Jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    Udaipur:
        'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    Zurich: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80',
};

export function CreateTripPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleCreateTrip, loading } = useTrips();
    const { toast } = useToast();

    const paramDestination = searchParams.get('destination') || '';

    // Form states - starting clean
    const [tripName, setTripName] = useState(paramDestination ? `${paramDestination} Trip` : '');
    const [destinationInput, setDestinationInput] = useState(paramDestination);
    const [selectedCity, setSelectedCity] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetCurrency, setBudgetCurrency] = useState('USD');
    const [description, setDescription] = useState('');
    const [coverPhotoUrl, setCoverPhotoUrl] = useState('');

    // Dropdown state & ref
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Curated activities state
    const [curatedActivities, setCuratedActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [selectedActivityIds, setSelectedActivityIds] = useState(new Set());

    const { cities, setSearchTerm, loading: searchingCities } = useCitySearch(destinationInput);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Load real activities for a city
    const loadCityActivities = useCallback(async (cityId, cityName = '') => {
        setActivitiesLoading(true);
        try {
            const res = await exploreApi.getCityActivities(cityId);
            const list = res?.data?.activities || res?.activities || [];
            if (list.length > 0) {
                setCuratedActivities(list);
            } else {
                // If city has no specific activities, fetch general catalog activities
                const generalRes = await exploreApi.searchActivities({ limit: 6 });
                setCuratedActivities(generalRes?.data?.activities || generalRes?.activities || []);
            }
        } catch (err) {
            console.error('Failed to load city activities:', err);
            try {
                const generalRes = await exploreApi.searchActivities({ limit: 6 });
                setCuratedActivities(generalRes?.data?.activities || generalRes?.activities || []);
            } catch {
                setCuratedActivities([]);
            }
        } finally {
            setActivitiesLoading(false);
        }
    }, []);

    // Initial load: if paramDestination provided, try finding matching city, else load general catalog activities
    useEffect(() => {
        async function initActivities() {
            if (paramDestination && cities.length > 0 && !selectedCity) {
                const match = cities.find(
                    (c) => c.name.toLowerCase() === paramDestination.toLowerCase(),
                );
                if (match) {
                    setSelectedCity(match);
                    setDestinationInput(`${match.name}, ${match.country}`);
                    const cover =
                        DEFAULT_COVER_IMAGES[match.name] ||
                        `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80`;
                    setCoverPhotoUrl(cover);
                    loadCityActivities(match.id, match.name);
                    return;
                }
            }

            if (!selectedCity && curatedActivities.length === 0) {
                setActivitiesLoading(true);
                try {
                    const res = await exploreApi.searchActivities({ limit: 6 });
                    const list = res?.data?.activities || res?.activities || [];
                    setCuratedActivities(list);
                } catch (err) {
                    console.error('Failed to load initial activities:', err);
                } finally {
                    setActivitiesLoading(false);
                }
            }
        }

        initActivities();
    }, [cities, paramDestination, selectedCity, curatedActivities.length, loadCityActivities]);

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setDestinationInput(`${city.name}, ${city.country}`);
        setSearchTerm(city.name);
        setIsDropdownOpen(false);

        if (!tripName.trim()) {
            setTripName(`${city.name} Adventure`);
        }

        const cover =
            DEFAULT_COVER_IMAGES[city.name] ||
            `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80`;
        setCoverPhotoUrl(cover);

        loadCityActivities(city.id, city.name);
    };

    const handleClearDestination = () => {
        setDestinationInput('');
        setSearchTerm('');
        setSelectedCity(null);
        setIsDropdownOpen(true);
    };

    const handleToggleActivity = (act) => {
        const nextSet = new Set(selectedActivityIds);
        let nextList = [...selectedActivities];

        if (nextSet.has(act.id)) {
            nextSet.delete(act.id);
            nextList = nextList.filter((a) => a.id !== act.id);
        } else {
            nextSet.add(act.id);
            nextList.push(act);
        }

        setSelectedActivityIds(nextSet);
        setSelectedActivities(nextList);
    };

    const handleSaveAndContinue = async (status = 'draft') => {
        if (!tripName.trim()) {
            toast({ type: 'error', message: 'Please enter a trip name' });
            return;
        }

        if (!destinationInput.trim()) {
            toast({ type: 'error', message: 'Please select or enter a primary destination' });
            return;
        }

        if (!startDate || !endDate) {
            toast({ type: 'error', message: 'Please select both start and end dates' });
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            toast({ type: 'error', message: 'End date must be on or after start date' });
            return;
        }

        try {
            const payload = {
                name: tripName.trim(),
                description: description.trim(),
                startDate: startDate,
                endDate: endDate,
                budgetAmount: budgetAmount ? parseFloat(budgetAmount) : 0,
                budgetCurrency: budgetCurrency || 'USD',
                coverPhotoUrl: coverPhotoUrl || undefined,
                status,
                visibility: 'private',
            };

            const created = await handleCreateTrip(payload);

            if (!created || !created.id) {
                throw new Error('Trip was created but no ID was returned.');
            }

            // If a city was picked or entered, create the initial stop
            if (selectedCity?.id || destinationInput.trim()) {
                try {
                    const cityName = selectedCity?.name || destinationInput.split(',')[0].trim();
                    const countryName =
                        selectedCity?.country || destinationInput.split(',')[1]?.trim() || 'Global';

                    const stopPayload = {
                        cityId: selectedCity?.id,
                        cityName,
                        country: countryName,
                        startDate: payload.startDate,
                        endDate: payload.endDate,
                        sequenceOrder: 1,
                    };

                    const stopRes = await itineraryApi.createStop(created.id, stopPayload);
                    const createdStopId = stopRes?.stop?.id || stopRes?.data?.stop?.id;

                    // If activities were selected, attach them to this stop
                    if (createdStopId && selectedActivities.length > 0) {
                        for (let i = 0; i < selectedActivities.length; i++) {
                            const act = selectedActivities[i];
                            try {
                                await itineraryApi.createActivity(created.id, createdStopId, {
                                    activityId:
                                        act.id && !act.id.startsWith('sug-') ? act.id : undefined,
                                    name: act.name,
                                    description: act.description,
                                    category: act.activityType || act.category || 'sightseeing',
                                    cost: act.cost ? parseFloat(act.cost) : 0,
                                    activityDate: payload.startDate,
                                    startTime:
                                        i === 0 ? '09:00:00' : i === 1 ? '13:30:00' : '16:00:00',
                                    sequenceOrder: i + 1,
                                    notes: act.description,
                                });
                            } catch (actErr) {
                                console.warn('Activity scheduling note:', actErr);
                            }
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

            navigate(`/trips/${created.id}/itinerary`);
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
                <Link to="/">Home</Link>
                <span className="separator">
                    <ChevronRight size={14} />
                </span>
                <Link to="/me/trips">My Trips</Link>
                <span className="separator">
                    <ChevronRight size={14} />
                </span>
                <span className="active">Plan a Trip</span>
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

                        <div className="form-group" ref={dropdownRef}>
                            <label className="field-label">Primary Destination</label>
                            <div className="destination-search-container">
                                <div className="input-wrapper">
                                    <Search className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        value={destinationInput}
                                        onChange={(e) => {
                                            setDestinationInput(e.target.value);
                                            setSearchTerm(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        placeholder="Search destination city (e.g. Kyoto, Paris, Tokyo, Goa)..."
                                    />
                                    {destinationInput && (
                                        <button
                                            type="button"
                                            className="clear-input-btn"
                                            onClick={handleClearDestination}
                                            aria-label="Clear destination"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Destination Autocomplete Dropdown */}
                                {isDropdownOpen && (
                                    <div className="destination-dropdown">
                                        <div className="dropdown-header">
                                            <span>
                                                {destinationInput
                                                    ? 'MATCHING DESTINATIONS'
                                                    : 'POPULAR DESTINATIONS'}
                                            </span>
                                            {searchingCities && (
                                                <Loader2 className="animate-spin" size={14} />
                                            )}
                                        </div>

                                        {cities.length > 0 ? (
                                            <div className="dropdown-list">
                                                {cities.map((city) => (
                                                    <div
                                                        key={city.id}
                                                        className="dropdown-item"
                                                        onClick={() => handleSelectCity(city)}
                                                    >
                                                        <div className="city-info">
                                                            <div className="city-name-row">
                                                                <MapPin
                                                                    size={16}
                                                                    className="pin-icon"
                                                                />
                                                                <span className="city-name">
                                                                    {city.name}
                                                                </span>
                                                                <span className="city-country">
                                                                    , {city.country}
                                                                </span>
                                                            </div>
                                                            {city.region && (
                                                                <span className="city-region">
                                                                    {city.region}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="city-badges">
                                                            {city.popularity && (
                                                                <span className="popularity-badge">
                                                                    ★ {city.popularity}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : !searchingCities ? (
                                            <div className="dropdown-empty">
                                                <span>
                                                    No matching cities found in catalog. You can
                                                    still type custom destination name.
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
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

                    {/* Curated Activity Suggestions Grid with real catalog data */}
                    <CuratedActivitySuggestions
                        activities={curatedActivities}
                        selectedActivityIds={selectedActivityIds}
                        onToggleActivity={handleToggleActivity}
                        loading={activitiesLoading}
                        destinationName={selectedCity?.name || destinationInput.split(',')[0]}
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
                    <span>Ready to create</span>
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
                        <span>{loading ? 'Creating Trip...' : 'Continue to Builder'}</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTripPage;
