import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

/**
 * Fetch list of community posts with search, type, and sorting filters
 */
export async function getCommunityPosts(params = {}) {
    const response = await api.get('/community/posts', {
        params: {
            limit: 10,
            sortBy: 'recent',
            ...params,
        },
    });
    return response.data;
}

/**
 * Fetch details of a single community post by ID
 */
export async function getCommunityPostById(postId) {
    const response = await api.get(`/community/posts/${postId}`);
    return response.data;
}

/**
 * Create a new community experience post (trip or activity)
 */
export async function createCommunityPost(postData) {
    const response = await api.post('/community/posts', postData);
    return response.data;
}

/**
 * Update an existing community post
 */
export async function updateCommunityPost(postId, updateData) {
    const response = await api.patch(`/community/posts/${postId}`, updateData);
    return response.data;
}

/**
 * Delete a community post
 */
export async function deleteCommunityPost(postId) {
    const response = await api.delete(`/community/posts/${postId}`);
    return response.data;
}

/**
 * Toggle like on a community post
 */
export async function toggleLikePost(postId) {
    const response = await api.post(`/community/posts/${postId}/like`);
    return response.data;
}

/**
 * Fetch comments for a post
 */
export async function getComments(postId) {
    const response = await api.get(`/community/posts/${postId}/comments`);
    return response.data;
}

/**
 * Add a comment to a post
 */
export async function addComment(postId, content) {
    const response = await api.post(`/community/posts/${postId}/comments`, { content });
    return response.data;
}
