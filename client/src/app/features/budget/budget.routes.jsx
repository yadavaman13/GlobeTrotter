import BudgetAnalyticsPage from './pages/BudgetAnalyticsPage';
import TripProvider from '../trips/context/TripContext';
import ItineraryProvider from '../itinerary/context/ItineraryContext';

export default {
    userRoutes: [
        {
            path: 'trips/:tripId/budget',
            element: (
                <TripProvider>
                    <ItineraryProvider>
                        <BudgetAnalyticsPage />
                    </ItineraryProvider>
                </TripProvider>
            ),
        },
    ],
};
