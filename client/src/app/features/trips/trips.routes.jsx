import MyTripsPage from './pages/MyTripsPage';
import CreateTripPage from './pages/CreateTripPage';
import TripProvider from './context/TripContext';
import ItineraryProvider from '../itinerary/context/ItineraryContext';
import ItineraryPage from '../itinerary/pages/ItineraryPage';

export default {
    userRoutes: [
        {
            path: 'trips',
            element: (
                <TripProvider>
                    <MyTripsPage />
                </TripProvider>
            ),
        },
        {
            path: 'trips/new',
            element: (
                <TripProvider>
                    <CreateTripPage />
                </TripProvider>
            ),
        },
        {
            path: 'trips/:tripId',
            element: (
                <TripProvider>
                    <ItineraryProvider>
                        <ItineraryPage />
                    </ItineraryProvider>
                </TripProvider>
            ),
        },
    ],
};
