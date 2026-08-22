import { Navigate } from 'react-router';
import ProtectedRoute from '@/app/features/auth/components/ProtectedRoute';
import UserProfileLayout from '../userProfile/pages/UserProfileLayout';
import { UserProfileProvider } from '../userProfile/context/userProfile.context';
import CreateTripPage from './pages/CreateTripPage';
import TripProvider from './context/TripContext';
import ItineraryProvider from '../itinerary/context/ItineraryContext';
import ItineraryPage from '../itinerary/pages/ItineraryPage';
import TripTimelinePage from '../itinerary/pages/TripTimelinePage';
import BudgetAnalyticsPage from '../budget/pages/BudgetAnalyticsPage';

export default {
    publicRoutes: [
        {
            path: 'trips',
            element: (
                <ProtectedRoute>
                    <UserProfileProvider>
                        <UserProfileLayout />
                    </UserProfileProvider>
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to="/me/trips" replace />,
                },
                {
                    path: 'new',
                    element: (
                        <TripProvider>
                            <CreateTripPage />
                        </TripProvider>
                    ),
                },
                {
                    path: ':tripId',
                    children: [
                        {
                            index: true,
                            element: (
                                <TripProvider>
                                    <ItineraryProvider>
                                        <ItineraryPage />
                                    </ItineraryProvider>
                                </TripProvider>
                            ),
                        },
                        {
                            path: 'itinerary',
                            element: (
                                <TripProvider>
                                    <ItineraryProvider>
                                        <ItineraryPage />
                                    </ItineraryProvider>
                                </TripProvider>
                            ),
                        },
                        {
                            path: 'timeline',
                            element: (
                                <TripProvider>
                                    <ItineraryProvider>
                                        <TripTimelinePage />
                                    </ItineraryProvider>
                                </TripProvider>
                            ),
                        },
                        {
                            path: 'budget',
                            element: (
                                <TripProvider>
                                    <ItineraryProvider>
                                        <BudgetAnalyticsPage />
                                    </ItineraryProvider>
                                </TripProvider>
                            ),
                        },
                    ],
                },
            ],
        },
    ],
};
