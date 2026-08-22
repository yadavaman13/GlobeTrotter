import AdminDashboardPage from '@/app/features/admin/pages/AdminDashboardPage';

export default {
    userRoutes: [
        {
            path: 'home',
            element: <div className="main-dashboard-placeholder">This is main dashboard</div>,
        },
    ],
    adminRoutes: [
        {
            path: 'home',
            element: <AdminDashboardPage />,
        },
    ],
};
