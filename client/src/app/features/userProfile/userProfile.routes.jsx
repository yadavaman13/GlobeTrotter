import { UserProfileProvider } from './context/userProfile.context';
import MyTripsPage from './pages/MyTripsPage/MyTripsPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import UserProfileLayout from './pages/UserProfileLayout';
import ProtectedRoute from '@/app/features/auth/components/ProtectedRoute';

export default {
    publicRoutes: [
        {
            path: 'me',
            element: (
                <ProtectedRoute>
                    <UserProfileProvider>
                        <UserProfileLayout />
                    </UserProfileProvider>
                </ProtectedRoute>
            ),
            children: [
                {
                    path: 'trips',
                    element: <MyTripsPage />,
                },
                {
                    path: 'profile',
                    element: <UserProfilePage />,
                },
            ],
        },
    ],
};
