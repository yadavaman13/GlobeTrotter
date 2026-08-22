import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLandingData } from './hooks/useLandingData';
import './LandingPage.scss';

// Mock collections matching the exact design specification fallback
const mockRegionalSelections = [
    {
        name: 'Japan',
        flag: '🇯🇵',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA15cg6M8H1w64aJZKmsylD9_wLvQFAzB4u8GLbCmreNLzjddZ9LmRFXlDj6A29HGqFgATBKmXvgLubj7ymvsmviH033FKBfqFpN_CRZqKYYFR7pk2LjHEObwd2YrSrNzbJtxil6Z3WB5NgvdyIbdiX8sAPUVLNfTQW42ZX92RZ56KttTM-qFMzwNymrgkp7cBn4Xu9hIOKUP_RmYTQGSebdGVeZcm5T0KIpgc3y-udTTXFoynZqcj0',
        itineraries: '120+ Itineraries',
    },
    {
        name: 'Bali',
        flag: '🇮🇩',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJThqU_xq8iv_2lICP3jPXu9x0EoLlZZOVdqAhkOlZZHIQ8HiouEGhlOdi2Wg4QppyMXg0ftaiSwZ5rygSAXUS2-v0rPL7jPgbCSRU2MnEsRDFwXQLyoVvcDySaL_JyNVNR5AsYO8igYgNZEgF52ELYx3m70MHttVhLL9eTETqpwYWD13NVu7n0aSSDPtoqSmlNYyrR8M6NoCNQ8KXla7xLpLGaadcjFpzIFFei-bO93jbTukvVZ7P',
        itineraries: '85+ Itineraries',
    },
    {
        name: 'Italy',
        flag: '🇮🇹',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjcI7Z5K9_fNwyhBa_Se7I2yB3l-4SYXAwSM0z-LQcK7Zv5UyFPN6ux3UKJcexNix7CHlsahA27mTu5hLkbZVnInxM7AHvXOiF30tSbjDoLDwyCt0i-TGsBnkS_I59S6TvW1z4S976zaT2u_kBdAXTxKHvB8lI2a47UZs65bFMktN-SSJwNTrK6mWQuwS5h-GICB7_wJSSnNQGiroWrsurSMw38gYM3PMwQmN_c2KxoaWoaSK3DgF-',
        itineraries: '200+ Itineraries',
    },
    {
        name: 'Switzerland',
        flag: '🇨🇭',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDigbMZbX1pkLRbRbUJGQdd27PKpLcUdvuKYVz0SWNWgkyMqKeHPuvz6Dd0-2da2oHL5p_fuPeSN_FYlsYTEuCWTIWaEsaBAk5ePpGsgh8LRJDr-gNkMfufyKhP2HCuBO2jLf4fhPnxQD4Q0OlHildBNC07Wn7LjDT3CoTFqRnKS8Xxzb3DtB-nMC7CMD10vILA9W78XMo-t6GCvFXAz6aCoMc16xNnVc0uePbPw0z0z3mz3XUJvPAw',
        itineraries: '95+ Itineraries',
    },
    {
        name: 'Iceland',
        flag: '🇮🇸',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8x1-BMWM7gnGb0xK9l4zk1hy8AjzLn2PKWsy-vGHUIo2FrQ6MtwaEv-U51JNihA7X1NgS6VZWnkdtB-dJDhLxblhtnj4bosKHWAHEXZp9but3cr1pXhu6fBi2lUBTVL3N7dHTaZ-4HluZZ57x2oK6KYJxO4Rj_mOLFBmbtYppOAFegvCJNfDp6yrEPBmXPA-wd7UgiHiqyr0GJ5NCo_fMYDZAXOEPl6W9_nk5vnWuGYJoYT1sBJHR',
        itineraries: '60+ Itineraries',
    },
];

const mockPreviousTrips = [
    {
        name: 'Autumn in Kyoto',
        dates: '12 Oct - 18 Oct, 2023',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxLCF7Gr-zKRCKCW08THYgYfwUlzWrJlHSPwEci1BEumaCllr-PmrP__7gpbPlvhW3kClhSLl05mjVX57uDetAw-cTf0xR47rbsgX6fw4jeOEII_WR8PFYwC24Q2RzaQqEhqep5xpNb7j8x3IxRzNkWjivhGuHhb4qEtEq6VruUmxDSRJX38Mxd1UrXgCOOZ0S-cSCeXGFm5AMfCSuRPF-nEWq9_d5bNrhhkna6CvTxDrS1QSKzwxO',
    },
    {
        name: 'Summer in Amalfi',
        dates: '15 Jun - 22 Jun, 2023',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7dg_EOegYc8D2wTFt--ja1ZeWDCEMyD3Ghdrp-kjfpzR6SDdMvPrRLb_Ss_C40Sb0LhZIGnx0iCzUCYUYnJ-7DehZVuU6ecBqCggFGttLfjwX3VDq21Axk3ph9ji0_yyRvzj4lpSHiv70x0v5gYXnG6reQMqKHs58zjKWgSAy-8YQZPmCQP9RFIcXJtcYmwz3C0v_OteZT1bC2xMzj-VWV4J9b2c4ZR8taIsfE2kRHRXaFo1d3GVb',
    },
    {
        name: 'Swiss Alps Explorer',
        dates: '05 Jan - 12 Jan, 2023',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTgSJRFhRjPRYlJPAZRuhUuwhvGFsYNj81ZJNOKTCvOIiakME073_oBR63aLM8lQQD-8_j4QJlQwVgtk-Bnai-04V5UMfhZGA4MzpdYpuxK-dIeQE2Ggng0Zvs1C0YOK6at0A3FfMj3My3YiRMx8wvvMWcgH6E49FWcYg_iHAGAg58dywIYDss99u9gOScBWIXNrffZPscL03CP1rFwMo6X2xeH86xyMP_CGiXeBuNk4TMvXAs3uF7',
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const {
        user,
        searchQuery,
        setSearchQuery,
        searchSuggestions,
        selectedRegion,
        setSelectedRegion,
        cities,
        upcomingTrip,
        previousTrips,
    } = useLandingData();

    // Dynamically load Google Material Icons stylesheet
    useEffect(() => {
        const link = document.createElement('link');
        link.href =
            'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    // Format trip start/end date strings nicely
    const formatTripDates = (startStr, endStr) => {
        if (!startStr || !endStr) return '';
        try {
            const start = new Date(startStr);
            const end = new Date(endStr);
            const options = { day: 'numeric', month: 'short' };
            const startFmt = start.toLocaleDateString('en-US', options);
            const endFmt = end.toLocaleDateString('en-US', options);
            const year = start.getFullYear();
            return `${startFmt} - ${endFmt}, ${year}`;
        } catch {
            return `${startStr} - ${endStr}`;
        }
    };

    // Calculate progression percentage based on today's date
    const calculateProgress = (trip) => {
        if (trip.status === 'completed') return 100;
        if (!trip.startDate || !trip.endDate) return 0;
        try {
            const start = new Date(trip.startDate).getTime();
            const end = new Date(trip.endDate).getTime();
            const today = new Date().getTime();
            if (today < start) return 0;
            if (today > end) return 100;
            const progress = ((today - start) / (end - start)) * 100;
            return Math.min(Math.max(Math.round(progress), 0), 100);
        } catch {
            return 0;
        }
    };

    const getCountryFlag = (country) => {
        if (!country) return '📍';
        const lower = country.toLowerCase().trim();
        if (lower.includes('japan')) return '🇯🇵';
        if (lower.includes('india')) return '🇮🇳';
        if (lower.includes('france')) return '🇫🇷';
        if (lower.includes('united kingdom') || lower.includes('uk')) return '🇬🇧';
        if (lower.includes('united states') || lower.includes('usa')) return '🇺🇸';
        if (lower.includes('italy')) return '🇮🇹';
        if (lower.includes('switzerland')) return '🇨🇭';
        if (lower.includes('indonesia') || lower.includes('bali')) return '🇮🇩';
        return '📍';
    };

    // Handle interactive button navigation
    const handleStartPlanning = () => {
        if (user) {
            navigate('/dashboard/user/analytics/insight');
        } else {
            navigate('/login');
        }
    };

    const handleSelectSuggestion = (city) => {
        setSearchQuery('');
        if (user) {
            navigate(`/dashboard/user/analytics/insight?cityId=${city.id}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="landing-page-root">
            {/* Header / Navigation */}
            <header className="landing-header">
                <div className="landing-header-container">
                    <div className="logo-brand" onClick={() => navigate('/')}>
                        GlobeTrotter
                    </div>
                    <nav className="nav-menu">
                        <a className="nav-item active" href="/">
                            Explore
                        </a>
                        <a className="nav-item" href="/dashboard/user/analytics/insight">
                            My Trips
                        </a>
                        <a className="nav-item" href="/dashboard/user/analytics/insight">
                            Discover Experiences
                        </a>
                    </nav>
                    <div className="nav-actions">
                        <button className="icon-btn">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                        {user ? (
                            <div
                                className="avatar-wrapper"
                                onClick={() => navigate('/dashboard/user/analytics/insight')}
                                title={`Logged in as ${user.name || 'User'}`}
                            >
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="user-avatar"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined avatar-fallback">
                                        account_circle
                                    </span>
                                )}
                            </div>
                        ) : (
                            <button className="icon-btn" onClick={() => navigate('/login')}>
                                <span className="material-symbols-outlined">account_circle</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero / Banner */}
            <main className="landing-main-content">
                <section className="hero-banner-section">
                    <div className="hero-banner-image-bg" />
                    <div className="hero-banner-scrim" />
                    <div className={`hero-banner-grid ${upcomingTrip ? 'has-upcoming' : ''}`}>
                        <div className="hero-text-content">
                            <h1 className="hero-title">
                                Plan unforgettable journeys across the world.
                            </h1>
                            <p className="hero-subtitle">
                                Your personal AI travel concierge. Discover, plan, and budget your
                                next adventure seamlessly.
                            </p>
                            <div className="hero-cta-buttons">
                                <button className="cta-btn-primary" onClick={handleStartPlanning}>
                                    Start Planning
                                </button>
                                <button
                                    className="cta-btn-secondary"
                                    onClick={() => {
                                        const el = document.getElementById('search-anchor');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Browse Destinations
                                </button>
                            </div>
                        </div>

                        {/* Glassmorphic Upcoming Trip Widget */}
                        {upcomingTrip && (
                            <div className="hero-upcoming-trip-wrapper">
                                <div className="upcoming-trip-glass-card">
                                    <p className="widget-label">UPCOMING TRIP</p>
                                    <h3 className="widget-title">{upcomingTrip.name}</h3>
                                    <p className="widget-dates">
                                        <span className="material-symbols-outlined calendar-icon">
                                            calendar_today
                                        </span>
                                        {formatTripDates(
                                            upcomingTrip.startDate,
                                            upcomingTrip.endDate,
                                        )}
                                    </p>
                                    <div className="widget-progress">
                                        <div className="progress-bar-track">
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${calculateProgress(upcomingTrip)}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="progress-text">
                                            {calculateProgress(upcomingTrip)}% Complete
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Search & Filters */}
                <section className="search-and-filters-container" id="search-anchor">
                    <div className="search-bar-wrap">
                        <div className="search-input-field">
                            <span className="material-symbols-outlined search-icon">search</span>
                            <input
                                type="text"
                                className="search-input-el"
                                placeholder="Where do you want to go?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Dynamic Search Suggestions Dropdown */}
                        {searchSuggestions.length > 0 && (
                            <div className="search-dropdown-menu">
                                {searchSuggestions.map((city) => (
                                    <div
                                        key={city.id}
                                        className="search-dropdown-item"
                                        onClick={() => handleSelectSuggestion(city)}
                                    >
                                        <span className="material-symbols-outlined item-icon">
                                            location_on
                                        </span>
                                        <span className="item-name">
                                            {city.name}, {city.country}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Regional filters pills */}
                    <div className="filters-carousel-track">
                        {[
                            'Europe',
                            'Asia',
                            'Beaches',
                            'Mountains',
                            'Adventure',
                            'Food',
                            'Luxury',
                        ].map((region) => (
                            <button
                                key={region}
                                className={`filter-carousel-pill ${
                                    selectedRegion === region ? 'active' : ''
                                }`}
                                onClick={() => setSelectedRegion(region)}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Top Regional Selections */}
                <section className="selections-grid-section">
                    <div className="selections-header">
                        <h2 className="grid-title">Top Regional Selections</h2>
                        <span
                            className="view-all-trigger"
                            onClick={() => navigate('/dashboard/user/analytics/insight')}
                        >
                            View all
                        </span>
                    </div>

                    <div className="selections-grid">
                        {cities.length > 0
                            ? cities.map((city, idx) => (
                                  <div
                                      key={city.id}
                                      className="selection-grid-item"
                                      onClick={() => handleSelectSuggestion(city)}
                                  >
                                      <div className="selection-item-card hover-lift">
                                          <img
                                              src={
                                                  mockRegionalSelections[
                                                      idx % mockRegionalSelections.length
                                                  ].image
                                              }
                                              alt={city.name}
                                              className="card-media"
                                          />
                                          <button
                                              className="favorite-heart-btn"
                                              onClick={(e) => e.stopPropagation()}
                                          >
                                              <span className="material-symbols-outlined heart-icon">
                                                  favorite
                                              </span>
                                          </button>
                                      </div>
                                      <div className="selection-item-info">
                                          <span className="country-flag-badge">
                                              {getCountryFlag(city.country)}
                                          </span>
                                          <h4 className="selection-item-name">{city.name}</h4>
                                      </div>
                                      <p className="selection-itinerary-count">
                                          {Math.round(parseFloat(city.popularity || '4') * 18)}+
                                          Itineraries
                                      </p>
                                  </div>
                              ))
                            : mockRegionalSelections.map((selection, idx) => (
                                  <div
                                      key={idx}
                                      className="selection-grid-item"
                                      onClick={handleStartPlanning}
                                  >
                                      <div className="selection-item-card hover-lift">
                                          <img
                                              src={selection.image}
                                              alt={selection.name}
                                              className="card-media"
                                          />
                                          <button className="favorite-heart-btn">
                                              <span className="material-symbols-outlined heart-icon">
                                                  favorite
                                              </span>
                                          </button>
                                      </div>
                                      <div className="selection-item-info">
                                          <span className="country-flag-badge">
                                              {selection.flag}
                                          </span>
                                          <h4 className="selection-item-name">{selection.name}</h4>
                                      </div>
                                      <p className="selection-itinerary-count">
                                          {selection.itineraries}
                                      </p>
                                  </div>
                              ))}
                    </div>
                </section>

                {/* Previous Trips */}
                <section className="previous-trips-section">
                    <h2 className="section-title">Previous Trips</h2>
                    <div className="previous-trips-grid">
                        {user && previousTrips.length > 0
                            ? previousTrips.map((trip) => (
                                  <div key={trip.id} className="trip-card hover-lift">
                                      <div className="trip-card-image-wrap">
                                          <img
                                              src={trip.coverPhotoUrl || mockPreviousTrips[0].image}
                                              alt={trip.name}
                                              className="trip-image"
                                          />
                                      </div>
                                      <div className="trip-card-content">
                                          <h3 className="trip-name">{trip.name}</h3>
                                          <p className="trip-dates">
                                              <span className="material-symbols-outlined">
                                                  calendar_today
                                              </span>
                                              {formatTripDates(trip.startDate, trip.endDate)}
                                          </p>
                                          <div className="trip-progress-box">
                                              <div className="progress-bar-track">
                                                  <div
                                                      className="progress-bar-fill"
                                                      style={{ width: '100%' }}
                                                  />
                                              </div>
                                              <p className="progress-percentage-text">
                                                  100% Complete
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : mockPreviousTrips.map((trip, idx) => (
                                  <div key={idx} className="trip-card hover-lift">
                                      <div className="trip-card-image-wrap">
                                          <img
                                              src={trip.image}
                                              alt={trip.name}
                                              className="trip-image"
                                          />
                                      </div>
                                      <div className="trip-card-content">
                                          <h3 className="trip-name">{trip.name}</h3>
                                          <p className="trip-dates">
                                              <span className="material-symbols-outlined">
                                                  calendar_today
                                              </span>
                                              {trip.dates}
                                          </p>
                                          <div className="trip-progress-box">
                                              <div className="progress-bar-track">
                                                  <div
                                                      className="progress-bar-fill"
                                                      style={{ width: '100%' }}
                                                  />
                                              </div>
                                              <p className="progress-percentage-text">
                                                  100% Complete
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </section>
            </main>

            {/* Floating Action Button */}
            <button className="floating-action-planner-btn shadow-lg" onClick={handleStartPlanning}>
                <span className="material-symbols-outlined add-icon">add</span>
                <span className="btn-label-text">Plan a trip</span>
            </button>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-container">
                    <div className="footer-logo">GlobeTrotter</div>
                    <nav className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Sitemap</a>
                        <a href="#">Company details</a>
                        <a href="#">Destinations</a>
                    </nav>
                    <div className="footer-copyright">
                        © 2024 GlobeTrotter, Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
