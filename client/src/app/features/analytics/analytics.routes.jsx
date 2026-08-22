import { Navigate } from 'react-router';
import InsightsPage from './Insights/InsightsPage';
import ReportsPage from './Reports/ReportsPage';

export default {
    userRoutes: [
        {
            path: 'analytics',
            children: [
                {
                    index: true,
                    element: <Navigate to="insight" replace />,
                },
                {
                    path: 'insight',
                    element: <InsightsPage />,
                },
                {
                    path: 'reports',
                    element: <ReportsPage />,
                },
            ],
        },
    ],
    adminRoutes: [
        {
            path: 'analytics',
            children: [
                {
                    index: true,
                    element: <Navigate to="insight" replace />,
                },
                {
                    path: 'insight',
                    element: <InsightsPage />,
                },
                {
                    path: 'reports',
                    element: <ReportsPage />,
                },
            ],
        },
    ],
};
