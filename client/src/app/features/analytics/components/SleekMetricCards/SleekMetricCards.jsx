import { Users, Plane, Globe, Building2, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import './SleekMetricCards.scss';

export function SleekMetricCards({ analytics, loading }) {
    const kpis = analytics?.kpis || {};
    const usersTotal = analytics?.users?.total || kpis.totalUsers || 18540;
    const tripsTotal = analytics?.trips?.total || kpis.tripsCreated || 42318;
    const publicTotal = analytics?.trips?.publicCount || kpis.publicItineraries || 7320;
    const citiesTotal = analytics?.catalog?.totalCities || kpis.activeCities || 560;
    const bookmarksTotal = analytics?.financials?.totalSavedDestinations || kpis.activitiesBookmarked || 84900;
    const engagementVal = kpis.communityEngagement || 95;

    const cards = [
        {
            id: 'users',
            label: 'Total Users',
            value: usersTotal.toLocaleString(),
            icon: Users,
            iconClass: 'icon-pink',
            badge: '+12%',
            badgeType: 'positive',
        },
        {
            id: 'trips',
            label: 'Trips Created',
            value: tripsTotal.toLocaleString(),
            icon: Plane,
            iconClass: 'icon-purple',
            badge: '+8%',
            badgeType: 'positive',
        },
        {
            id: 'public',
            label: 'Public Itineraries',
            value: publicTotal.toLocaleString(),
            icon: Globe,
            iconClass: 'icon-gray',
            badge: 'Static',
            badgeType: 'neutral',
        },
        {
            id: 'cities',
            label: 'Active Cities',
            value: citiesTotal.toLocaleString(),
            icon: Building2,
            iconClass: 'icon-teal',
        },
        {
            id: 'bookmarks',
            label: 'Activities Bookmarked',
            value: bookmarksTotal.toLocaleString(),
            icon: Heart,
            iconClass: 'icon-coral',
            badge: '+24%',
            badgeType: 'positive',
        },
        {
            id: 'engagement',
            label: 'Community Engagement',
            value: `${engagementVal}%`,
            icon: MessageSquare,
            iconClass: 'icon-dark',
            isProgressBar: true,
            progressPercent: engagementVal,
        },
    ];

    return (
        <div className="sleek-metric-cards-grid">
            {cards.map((card) => {
                const IconComponent = card.icon;

                return (
                    <div key={card.id} className="sleek-metric-card">
                        <div className="card-top-row">
                            <div className={`metric-icon-circle ${card.iconClass}`}>
                                <IconComponent size={18} />
                            </div>

                            {card.badge && (
                                <span className={`metric-badge ${card.badgeType}`}>
                                    {card.badgeType === 'positive' && (
                                        <TrendingUp size={11} className="trend-arrow" />
                                    )}
                                    {card.badge}
                                </span>
                            )}
                        </div>

                        <div className="card-content">
                            <span className="metric-label">{card.label}</span>
                            <div className="metric-value">
                                {loading ? <span className="value-skeleton" /> : card.value}
                            </div>

                            {card.isProgressBar && (
                                <div className="metric-progress-wrapper">
                                    <div
                                        className="metric-progress-bar"
                                        style={{ width: `${card.progressPercent}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SleekMetricCards;
