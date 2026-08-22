import { Users, Compass, IndianRupee, MapPin } from 'lucide-react';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import './KpiMetricsGrid.scss';

export function KpiMetricsGrid({ analytics, loading }) {
    if (loading || !analytics) {
        return (
            <div className="kpi-metrics-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="kpi-skeleton-card" />
                ))}
            </div>
        );
    }

    const { users, trips, catalog, financials } = analytics;

    const formattedTotalExpenses = financials?.totalExpensesRecorded
        ? new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
          }).format(financials.totalExpensesRecorded)
        : '₹0';

    const formattedAvgBudget = trips?.averageBudgetAmount
        ? new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
          }).format(trips.averageBudgetAmount)
        : '₹0';

    return (
        <div className="kpi-metrics-grid">
            <StatCard
                title="Total Registered Users"
                value={users?.total?.toLocaleString() ?? '0'}
                icon={<Users />}
                trend={{
                    label: `${users?.newThisMonth ?? 0} new this month`,
                    direction: 'up',
                }}
                className="kpi-card users"
            />

            <StatCard
                title="Itineraries Created"
                value={trips?.total?.toLocaleString() ?? '0'}
                icon={<Compass />}
                trend={{
                    label: `${trips?.averageDurationDays ?? 0} days avg trip`,
                    direction: 'up',
                }}
                className="kpi-card trips"
            />

            <StatCard
                title="Recorded Expenses"
                value={formattedTotalExpenses}
                icon={<IndianRupee />}
                trend={{
                    label: `Avg ${formattedAvgBudget} / trip`,
                    direction: 'up',
                }}
                className="kpi-card financials"
            />

            <StatCard
                title="Catalog Destinations"
                value={`${catalog?.totalCities ?? 0} Cities`}
                icon={<MapPin />}
                trend={{
                    label: `${catalog?.totalActivities ?? 0} curated activities`,
                    direction: 'up',
                }}
                className="kpi-card catalog"
            />
        </div>
    );
}

export default KpiMetricsGrid;
