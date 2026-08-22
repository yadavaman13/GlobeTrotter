import axios from 'axios';

const analyticsApiInstance = axios.create({
    baseURL: '/api/admin',
    withCredentials: true,
});

/**
 * Fetch complete platform metrics aggregated across all business domains
 */
export async function fetchPlatformAnalytics() {
    const response = await analyticsApiInstance.get('/analytics');
    return response.data;
}

export const getAdminAnalyticsApi = fetchPlatformAnalytics;

/**
 * Export analytics summary data as CSV or JSON format
 * @param {'csv'|'json'} [format='json']
 * @param {object} analyticsData
 */
export function downloadAnalyticsReport(format = 'json', analyticsData) {
    if (!analyticsData) return;

    if (format === 'json') {
        const jsonStr = JSON.stringify(analyticsData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `globetrotter_analytics_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
    }

    if (format === 'csv') {
        // Flatten key KPIs into CSV
        const rows = [
            ['Section', 'Metric', 'Value'],
            ['Users', 'Total Registered Users', analyticsData.users?.total || 0],
            ['Users', 'Active Users', analyticsData.users?.active || 0],
            ['Users', 'Deleted Users', analyticsData.users?.deleted || 0],
            ['Users', 'New Users (Last 30 Days)', analyticsData.users?.newThisMonth || 0],
            ['Trips', 'Total Trips Created', analyticsData.trips?.total || 0],
            ['Trips', 'Average Duration (Days)', analyticsData.trips?.averageDurationDays || 0],
            ['Trips', 'Total Estimated Budget', analyticsData.trips?.totalBudgetAmount || 0],
            ['Trips', 'Average Budget Per Trip', analyticsData.trips?.averageBudgetAmount || 0],
            ['Catalog', 'Total Indexed Cities', analyticsData.catalog?.totalCities || 0],
            ['Catalog', 'Total Indexed Activities', analyticsData.catalog?.totalActivities || 0],
            ['Financials', 'Total Expenses Recorded', analyticsData.financials?.totalExpensesRecorded || 0],
            ['Financials', 'Total Saved Destinations', analyticsData.financials?.totalSavedDestinations || 0],
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `globetrotter_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
