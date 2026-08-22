import { useAnalyticsContext } from '../context/AnalyticsContext';

/**
 * Custom Hook: Access platform analytics and export actions
 */
export function usePlatformAnalytics() {
    return useAnalyticsContext();
}
