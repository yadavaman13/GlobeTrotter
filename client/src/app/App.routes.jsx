import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import App from './App';
import DashboardLayout from '@/app/features/dashboard/DashboardLayout/DashboardLayout';
import DashboardIndex from '@/app/features/dashboard/DashboardIndex';
import ProtectedRoute from '@/app/features/auth/components/ProtectedRoute';
import NotFoundPage from '@/components/Shared/ErrorPages/NotFoundPage/NotFoundPage';
import { loadFeatureRoutes } from './routes.loader';
import LandingPage from '@/app/features/landing/LandingPage';

// Auto-discover all *.routes.jsx across all feature modules
const { userRoutes, adminRoutes, publicRoutes } = loadFeatureRoutes();

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            // Auto-discovered public feature routes (auth, showcase, etc.)
            ...publicRoutes,
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <DashboardIndex />,
                    },
                    {
                        path: 'user',
                        element: (
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Outlet />
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                index: true,
                                element: <Navigate to="analytics" replace />,
                            },
                            // Auto-discovered user feature routes
                            ...userRoutes,
                        ],
                    },
                    {
                        path: 'admin',
                        element: (
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Outlet />
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                index: true,
                                element: <Navigate to="home" replace />,
                            },
                            // Auto-discovered admin feature routes
                            ...adminRoutes,
                        ],
                    },
                ],
            },
            {
                path: '*',
                element: <NotFoundPage onActionClick={() => window.location.replace('/')} />,
            },
        ],
    },
]);

