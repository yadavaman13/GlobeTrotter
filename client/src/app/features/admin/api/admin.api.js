import axios from 'axios';

const adminApiInstance = axios.create({
    baseURL: '/api/admin',
    withCredentials: true,
});

/**
 * Fetch paginated list of users with search and filtering
 * @param {object} params
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.search='']
 * @param {string} [params.role]
 * @param {boolean|string} [params.isActive]
 * @param {boolean|string} [params.isDeleted]
 * @param {string} [params.sortBy='createdAt']
 * @param {string} [params.sortOrder='desc']
 */
export async function fetchAdminUsers({
    page = 1,
    limit = 20,
    search = '',
    role = '',
    isActive = '',
    isDeleted = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
} = {}) {
    const params = { page, limit, sortBy, sortOrder };
    if (search && search.trim()) params.search = search.trim();
    if (role) params.role = role;
    if (isActive !== '' && isActive !== undefined) params.isActive = isActive;
    if (isDeleted !== '' && isDeleted !== undefined) params.isDeleted = isDeleted;

    const response = await adminApiInstance.get('/users', { params });
    return response.data;
}

/**
 * Fetch detailed user record and engagement statistics by ID
 * @param {string} userId
 */
export async function fetchAdminUserById(userId) {
    const response = await adminApiInstance.get(`/users/${userId}`);
    return response.data;
}

/**
 * Update user status flags or role
 * @param {string} userId
 * @param {object} updates
 * @param {boolean} [updates.isActive]
 * @param {boolean} [updates.isDeleted]
 * @param {'user'|'admin'} [updates.role]
 */
export async function updateAdminUserStatus(userId, updates) {
    const response = await adminApiInstance.patch(`/users/${userId}/status`, updates);
    return response.data;
}

/**
 * Permanently delete expired soft-deleted users
 */
export async function cleanupExpiredUsers() {
    const response = await adminApiInstance.post('/users/cleanup');
    return response.data;
}
