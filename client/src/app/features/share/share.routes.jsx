import PublicTripPage from './pages/PublicTripPage';
import TripProvider from '../trips/context/TripContext';

export default {
    publicRoutes: [
        {
            path: 'share/:slug',
            element: (
                <TripProvider>
                    <PublicTripPage />
                </TripProvider>
            ),
        },
    ],
};
