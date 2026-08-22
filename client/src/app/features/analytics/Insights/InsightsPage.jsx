import { useState } from 'react';
import { AnalyticsProvider, useAnalyticsContext } from '../context/AnalyticsContext';
import SleekMetricCards from '../components/SleekMetricCards/SleekMetricCards';
import InteractiveEChartsSection from '../components/InteractiveEChartsSection/InteractiveEChartsSection';
import TripStatusDonutChart from '../components/TripStatusDonutChart/TripStatusDonutChart';
import PopularCitiesBarChart from '../components/PopularCitiesBarChart/PopularCitiesBarChart';
import ExpenseCategoryChart from '../components/ExpenseCategoryChart/ExpenseCategoryChart';
import PopularActivitiesTable from '../components/PopularActivitiesTable/PopularActivitiesTable';
import AdminFooter from '../components/AdminFooter/AdminFooter';
import { Download, Upload, Search } from 'lucide-react';
import './InsightsPage.scss';

function InsightsContent() {
    const {
        analytics,
        loading,
        error,
        timeframe,
        setTimeframe,
        setSearchQuery,
        exportReport,
    } = useAnalyticsContext();

    const [filterSearch, setFilterSearch] = useState('');

    const handleSearch = (e) => {
        const val = e.target.value;
        setFilterSearch(val);
        if (setSearchQuery) {
            setSearchQuery(val);
        }
    };

    return (
        <div className="analytics-insights-page">
            <main className="analytics-main-container">

                {/* Header Section */}
                <div className="analytics-hero-header">
                    <div className="hero-title-group">
                        <span className="control-center-tag">ADMIN CONTROL CENTER</span>
                        <h1 className="main-page-title">Analytics Dashboard</h1>
                    </div>

                    <div className="hero-action-buttons">
                        <button
                            type="button"
                            className="btn-download-pdf"
                            onClick={() => exportReport('pdf')}
                            title="Download PDF Report"
                        >
                            <Download size={15} />
                            <span>Download PDF</span>
                        </button>

                        <button
                            type="button"
                            className="btn-export-report"
                            onClick={() => exportReport('csv')}
                            title="Export CSV / JSON Report"
                        >
                            <Upload size={15} />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>

                {/* Filter & Date Range Bar */}
                <div className="analytics-filter-toolbar">
                    <div className="analytics-search-input-box">
                        <Search size={15} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search analytics..."
                            value={filterSearch}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>

                    <div className="date-range-filter-group">
                        <span className="date-range-label">Date Range:</span>
                        <div className="date-range-pills">
                            <button
                                type="button"
                                className={`date-pill ${timeframe === '7d' ? 'active' : ''}`}
                                onClick={() => setTimeframe('7d')}
                            >
                                Last 7 Days
                            </button>
                            <button
                                type="button"
                                className={`date-pill ${timeframe === '30d' ? 'active' : ''}`}
                                onClick={() => setTimeframe('30d')}
                            >
                                Last Month
                            </button>
                            <button
                                type="button"
                                className={`date-pill ${timeframe === 'ytd' ? 'active' : ''}`}
                                onClick={() => setTimeframe('ytd')}
                            >
                                YTD
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="analytics-error-banner">
                        <span>{error}</span>
                    </div>
                )}

                {/* 6 Sleek Metric KPI Cards */}
                <SleekMetricCards analytics={analytics} loading={loading} />

                {/* Interactive ECharts Visualizations */}
                <InteractiveEChartsSection
                    analytics={analytics}
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                />

                {/* Detailed Analytics Breakdown Grid */}
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

                {/* Footer matching reference design */}
                <AdminFooter />
            </main>
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
