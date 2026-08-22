import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import { getAdminAnalyticsApi } from '@/app/features/analytics/services/analytics.api';
import Button from '@/components/Shared/Buttons/Button/Button';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import {
    Users,
    MapPin,
    Compass,
    TrendingUp,
    FileText,
    ArrowUpRight,
    Calendar,
    DollarSign,
    Clock,
    RefreshCw,
} from 'lucide-react';

import AdminFooter from '@/app/features/analytics/components/AdminFooter/AdminFooter';
import './AdminDashboardPage.scss';

export function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardData = async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) setRefreshing(true);
            else setLoading(true);
            setError(null);

            const res = await getAdminAnalyticsApi();
            const analyticsData = res?.data?.analytics || res?.analytics || res?.data?.data?.analytics;
            if (analyticsData) {
                setAnalytics(analyticsData);
            }
        } catch (err) {
            console.error('Failed to fetch admin dashboard analytics:', err);
            setError(err.response?.data?.message || 'Failed to load live metrics.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const userStats = analytics?.users || { total: 0, active: 0, newThisMonth: 0 };
    const tripStats = analytics?.trips || { total: 0, byStatus: {}, recent: [] };
    const catalogStats = analytics?.catalog || {
        totalCities: 0,
        totalActivities: 0,
        popularCities: [],
        popularActivities: [],
    };
    const financialStats = analytics?.financials || { totalExpensesRecorded: 0 };

    const formattedExpenses = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(financialStats.totalExpensesRecorded || 0);

    return (
        <div className="admin-dashboard-page">
            <div className="admin-page-body-container">
                {/* Sleek Clean Page Header */}
                <div className="admin-page-header">
                    <div className="header-title-group">
                        <span className="control-center-tag">SYSTEM ADMINISTRATION CONSOLE</span>
                        <h1 className="main-page-title">
                            Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Administrator'}
                        </h1>
                        <p className="page-subtitle">
                            Real-time platform overview, traveler management, catalog health, and itinerary metrics.
                        </p>
                    </div>

                    <div className="header-actions">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => fetchDashboardData(true)}
                            loading={refreshing}
                            className="refresh-btn"
                        >
                            <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
                            <span>Refresh Data</span>
                        </Button>
                    </div>
                </div>



                {error && (
                    <div className="admin-error-alert">
                        <span>{error}</span>
                    </div>
                )}

                {/* Quick Stat Cards */}
                <div className="admin-stats-grid">
                    <div
                        className="stat-card clickable"
                        onClick={() => navigate('/dashboard/admin/users')}
                    >
                        <div className="stat-header">
                            <div className="icon-wrapper users">
                                <Users size={20} />
                            </div>
                            <ArrowUpRight size={16} className="arrow-icon" />
                        </div>
                        <div className="stat-body">
                            <span className="stat-label">Total Travelers</span>
                            <div className="stat-value">{loading ? '—' : userStats.total}</div>
                            <span className="stat-footnote positive">
                                +{userStats.newThisMonth} new this month
                            </span>
                        </div>
                    </div>

                    <div
                        className="stat-card clickable"
                        onClick={() => navigate('/dashboard/admin/analytics')}
                    >
                        <div className="stat-header">
                            <div className="icon-wrapper trips">
                                <MapPin size={20} />
                            </div>
                            <ArrowUpRight size={16} className="arrow-icon" />
                        </div>
                        <div className="stat-body">
                            <span className="stat-label">Created Itineraries</span>
                            <div className="stat-value">{loading ? '—' : tripStats.total}</div>
                            <span className="stat-footnote">
                                {tripStats.byStatus?.ongoing || 0} ongoing • {tripStats.byStatus?.planned || 0} planned
                            </span>
                        </div>
                    </div>

                    <div
                        className="stat-card clickable"
                        onClick={() => navigate('/dashboard/admin/analytics')}
                    >
                        <div className="stat-header">
                            <div className="icon-wrapper financials">
                                <DollarSign size={20} />
                            </div>
                            <ArrowUpRight size={16} className="arrow-icon" />
                        </div>
                        <div className="stat-body">
                            <span className="stat-label">Recorded Expenses</span>
                            <div className="stat-value">{loading ? '—' : formattedExpenses}</div>
                            <span className="stat-footnote positive">Tracked across Indian trips</span>
                        </div>
                    </div>

                    <div
                        className="stat-card clickable"
                        onClick={() => navigate('/dashboard/admin/analytics')}
                    >
                        <div className="stat-header">
                            <div className="icon-wrapper catalog">
                                <Compass size={20} />
                            </div>
                            <ArrowUpRight size={16} className="arrow-icon" />
                        </div>
                        <div className="stat-body">
                            <span className="stat-label">Indian Catalog</span>
                            <div className="stat-value">
                                {loading ? '—' : `${catalogStats.totalCities} Cities`}
                            </div>
                            <span className="stat-footnote">
                                {catalogStats.totalActivities} Curated Experiences
                            </span>
                        </div>
                    </div>
                </div>

                {/* Admin Command Center / Shortcuts */}
                <div className="admin-shortcuts-section">
                    <h2 className="section-heading">Quick Actions & Navigation</h2>
                    <div className="shortcuts-grid">
                        <div
                            className="shortcut-card"
                            onClick={() => navigate('/dashboard/admin/users')}
                        >
                            <div className="shortcut-icon users">
                                <Users size={22} />
                            </div>
                            <div className="shortcut-info">
                                <h3 className="shortcut-title">Manage Users</h3>
                                <p className="shortcut-desc">
                                    Oversee registered accounts, assign roles, and handle verification.
                                </p>
                            </div>
                            <ArrowUpRight size={16} className="shortcut-arrow" />
                        </div>

                        <div
                            className="shortcut-card"
                            onClick={() => navigate('/dashboard/admin/analytics')}
                        >
                            <div className="shortcut-icon analytics">
                                <TrendingUp size={22} />
                            </div>
                            <div className="shortcut-info">
                                <h3 className="shortcut-title">Platform Insights</h3>
                                <p className="shortcut-desc">
                                    Explore status distributions, popular destinations, and expense ledgers.
                                </p>
                            </div>
                            <ArrowUpRight size={16} className="shortcut-arrow" />
                        </div>

                        <div
                            className="shortcut-card"
                            onClick={() => navigate('/dashboard/admin/analytics')}
                        >
                            <div className="shortcut-icon reports">
                                <FileText size={22} />
                            </div>
                            <div className="shortcut-info">
                                <h3 className="shortcut-title">PDF Reports</h3>
                                <p className="shortcut-desc">
                                    Generate and download executive platform analytics in PDF format.
                                </p>
                            </div>
                            <ArrowUpRight size={16} className="shortcut-arrow" />
                        </div>
                    </div>
                </div>


                {/* Live Recent Itineraries & Trending Snapshot Grid */}
                <div className="admin-content-split-grid">
                    {/* Recent Platform Itineraries */}
                    <div className="admin-card recent-trips-card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">Recent Traveler Itineraries</h3>
                                <span className="card-caption">
                                    Latest multi-city trips planned by travelers
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/dashboard/admin/analytics')}
                            >
                                View All
                            </Button>
                        </div>

                        <div className="trips-table-wrapper">
                            {tripStats.recent && tripStats.recent.length > 0 ? (
                                <table className="recent-trips-table">
                                    <thead>
                                        <tr>
                                            <th>Itinerary Name</th>
                                            <th>Traveler</th>
                                            <th>Budget</th>
                                            <th>Stops</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tripStats.recent.map((trip) => {
                                            const tripBudget = trip.budgetAmount
                                                ? new Intl.NumberFormat('en-IN', {
                                                      style: 'currency',
                                                      currency: trip.budgetCurrency || 'INR',
                                                      maximumFractionDigits: 0,
                                                  }).format(trip.budgetAmount)
                                                : '—';

                                            const getStatusVariant = (st) => {
                                                switch (st) {
                                                    case 'completed':
                                                        return 'success';
                                                    case 'ongoing':
                                                        return 'info';
                                                    case 'planned':
                                                        return 'primary';
                                                    default:
                                                        return 'neutral';
                                                }
                                            };

                                            return (
                                                <tr key={trip.id}>
                                                    <td className="trip-name-cell">
                                                        <span className="name">{trip.name}</span>
                                                        <span className="dates">
                                                            <Calendar size={12} />
                                                            {trip.startDate} to {trip.endDate}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="owner-cell">
                                                            <span className="owner-name">{trip.ownerName}</span>
                                                            <span className="owner-email">{trip.ownerEmail}</span>
                                                        </div>
                                                    </td>
                                                    <td className="budget-cell">{tripBudget}</td>
                                                    <td className="stops-cell">{trip.stopCount} stops</td>
                                                    <td>
                                                        <Badge
                                                            variant={getStatusVariant(trip.status)}
                                                            type="subtle"
                                                        >
                                                            {trip.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-trips-placeholder">
                                    <Clock size={28} />
                                    <p>No itineraries created yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trending Catalog Snapshot */}
                    <div className="admin-card trending-snapshot-card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">Top Destinations Snapshot</h3>
                                <span className="card-caption">Most frequented travel hubs</span>
                            </div>
                        </div>

                        <div className="destinations-mini-list">
                            {catalogStats.popularCities && catalogStats.popularCities.length > 0 ? (
                                catalogStats.popularCities.slice(0, 5).map((city, idx) => (
                                    <div key={city.id || idx} className="destination-mini-row">
                                        <div className="rank-badge">#{idx + 1}</div>
                                        <div className="dest-info">
                                            <span className="dest-name">{city.name}</span>
                                            <span className="dest-region">{city.region}, {city.country}</span>
                                        </div>
                                        <div className="dest-stats">
                                            <span className="stops-pill">{city.visitCount} stops</span>
                                            <span className="rating-pill">★ {city.popularity || '9.5'}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-dest-placeholder">
                                    <p>Catalog destinations loading...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <AdminFooter />
            </div>
        </div>
    );

}

export default AdminDashboardPage;
