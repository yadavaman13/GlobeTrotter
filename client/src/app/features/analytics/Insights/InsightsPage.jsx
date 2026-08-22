import { AnalyticsProvider, useAnalyticsContext } from '../context/AnalyticsContext';
import AnalyticsHeader from '../components/AnalyticsHeader/AnalyticsHeader';
import KpiMetricsGrid from '../components/KpiMetricsGrid/KpiMetricsGrid';
import TripStatusDonutChart from '../components/TripStatusDonutChart/TripStatusDonutChart';
import PopularCitiesBarChart from '../components/PopularCitiesBarChart/PopularCitiesBarChart';
import ExpenseCategoryChart from '../components/ExpenseCategoryChart/ExpenseCategoryChart';
import PopularActivitiesTable from '../components/PopularActivitiesTable/PopularActivitiesTable';
import './InsightsPage.scss';

function InsightsContent() {
    const {
        analytics,
        loading,
        refreshing,
        error,
        lastUpdated,
        refreshAnalytics,
        exportReport,
    } = useAnalyticsContext();

    return (
        <div className="analytics-insights-page">
            <AnalyticsHeader
                title="Platform Insights & Live Analytics"
                subtitle="Live performance metrics, itinerary distribution, and travel cost breakdown."
                lastUpdated={lastUpdated}
                onRefresh={refreshAnalytics}
                onExport={exportReport}
                refreshing={refreshing}
            />

            {error && (
                <div className="analytics-error-banner">
                    <span>{error}</span>
                </div>
            )}

            {/* Top KPI Metrics Row */}
            <KpiMetricsGrid analytics={analytics} loading={loading} />

            {/* Charts Grid: Donut + Bar */}
            <div className="analytics-charts-grid">
                <TripStatusDonutChart
                    byStatus={analytics?.trips?.byStatus || {}}
                    total={analytics?.trips?.total || 0}
                />
                <PopularCitiesBarChart cities={analytics?.catalog?.popularCities || []} />
            </div>

            {/* Financial Ledger Breakdown & Popular Activities */}
            <div className="analytics-details-grid">
                <ExpenseCategoryChart
                    expensesByCategory={analytics?.financials?.expensesByCategory || []}
                    totalExpenses={analytics?.financials?.totalExpensesRecorded || 0}
                />
                <PopularActivitiesTable activities={analytics?.catalog?.popularActivities || []} />
            </div>
        </div>
    );
}

export function InsightsPage() {
    return (
        <AnalyticsProvider>
            <InsightsContent />
        </AnalyticsProvider>
    );
}

export default InsightsPage;
