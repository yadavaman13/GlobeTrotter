import AdminUsersPage from './pages/AdminUsersPage';

export default {
    adminRoutes: [
        {
            path: 'users',
            element: <AdminUsersPage />,
        },
    ],
    navItem: {
        label: 'Users',
        path: '/dashboard/admin/users',
        icon: 'Users',
        roles: ['admin'],
    },
};
