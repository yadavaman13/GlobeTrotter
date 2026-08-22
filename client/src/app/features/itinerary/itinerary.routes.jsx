import ItineraryPage from './pages/ItineraryPage';
import TripTimelinePage from './pages/TripTimelinePage';
import ItineraryProvider from './context/ItineraryContext';
import TripProvider from '../trips/context/TripContext';

export default {
    userRoutes: [
        {
            path: 'trips/:tripId/itinerary',
            element: (
                <TripProvider>
                    <ItineraryProvider>
                        <ItineraryPage />
                    </ItineraryProvider>
                </TripProvider>
            ),
        },
        {
            path: 'trips/:tripId/timeline',
            element: (
                <TripProvider>
                    <ItineraryProvider>
                        <TripTimelinePage />
                    </ItineraryProvider>
                </TripProvider>
            ),
        },
    ],
};
