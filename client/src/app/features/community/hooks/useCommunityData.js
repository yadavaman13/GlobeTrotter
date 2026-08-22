import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import * as communityService from '../services/community.service';

export function useCommunityData() {
    // ── All useState hooks must be declared unconditionally at the top ──
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTypeFilter, setActiveTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [posts, setPosts] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [shareNotification, setShareNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch community feed directly from database
    const fetchPosts = useCallback(async (query, type, sort) => {
        try {
            setLoading(true);
            setError(null);
            const params = { sortBy: sort };
            if (query && query.trim()) params.search = query.trim();
            if (type && type !== 'all') params.type = type;

            const res = await communityService.getCommunityPosts(params);
            const items = res.data?.items || res.items || [];

            setPosts(
                items.map((post) => {
                    const firstName = post.author?.firstName || '';
                    const lastName = post.author?.lastName || '';
                    const fullName = `${firstName} ${lastName}`.trim() || 'Community Traveler';
                    return {
                        id: post.id,
                        authorId: post.author?.id || post.authorId,
                        postType: post.postType,
                        title: post.title,
                        content: post.content,
                        createdAt: post.createdAt,
                        author: {
                            id: post.author?.id || post.authorId,
                            name: fullName,
                            profileImage: post.author?.profileImage || null,
                            verified: true,
                            location: 'Traveler',
                        },
                        images: post.images || [],
                        trip: post.trip || null,
                        activity: post.activity || null,
                        likesCount: post.likesCount || 0,
                        commentsCount: post.commentsCount || 0,
                        isLiked: false,
                    };
                }),
            );
        } catch (err) {
            console.error('Failed to fetch community feed from database:', err);
            setError(err.message || 'Failed to fetch community feed');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on filter/sort change
    useEffect(() => {
        fetchPosts(searchQuery, activeTypeFilter, sortBy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTypeFilter, sortBy, fetchPosts]);

    // 300ms debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchPosts(searchQuery, activeTypeFilter, sortBy);
        }, 300);
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    // Publish new post
    const publishPost = async (postPayload) => {
        try {
            setLoading(true);
            const res = await communityService.createCommunityPost(postPayload);
            const newPost = res.data?.post || res.post || res.data;
            if (newPost) {
                await fetchPosts(searchQuery, activeTypeFilter, sortBy);
            }
            setIsCreateModalOpen(false);
            return true;
        } catch (err) {
            console.error('Failed to publish post:', err);
            setError(err.message || 'Failed to publish post');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Toggle like on a post
    const toggleLike = async (postId) => {
        if (!user) return false;
        try {
            const res = await communityService.toggleLikePost(postId);
            const data = res.data || res;
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount }
                        : p,
                ),
            );
            return true;
        } catch (err) {
            console.error('Failed to toggle like:', err);
            return false;
        }
    };

    // Delete post (author only)
    const deletePost = async (postId) => {
        if (!user) return false;
        try {
            await communityService.deleteCommunityPost(postId);
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            return true;
        } catch (err) {
            console.error('Failed to delete post:', err);
            return false;
        }
    };

    // Toggle / Fetch comments drawer
    const toggleCommentsDrawer = async (postId) => {
        if (activeCommentsPostId === postId) {
            setActiveCommentsPostId(null);
            return;
        }
        setActiveCommentsPostId(postId);
        try {
            const res = await communityService.getComments(postId);
            const commentsList = res.data?.comments || res.comments || [];
            setCommentsMap((prev) => ({ ...prev, [postId]: commentsList }));
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    };

    // Post a comment
    const postComment = async (postId, commentText) => {
        if (!user || !commentText.trim()) return false;
        try {
            const res = await communityService.addComment(postId, commentText);
            const newComment = res.data?.comment || res.comment;
            if (newComment) {
                setCommentsMap((prev) => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), newComment],
                }));
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p,
                    ),
                );
            }
            return true;
        } catch (err) {
            console.error('Failed to post comment:', err);
            return false;
        }
    };

    // Share post — copy link to clipboard
    const sharePost = (post) => {
        const shareUrl = `${window.location.origin}/community?post=${post.id}`;
        navigator.clipboard.writeText(shareUrl);
        setShareNotification(`Link copied to clipboard for "${post.title}"`);
        setTimeout(() => setShareNotification(null), 3000);
    };

    return {
        user,
        searchQuery,
        setSearchQuery,
        activeTypeFilter,
        setActiveTypeFilter,
        sortBy,
        setSortBy,
        posts,
        isCreateModalOpen,
        setIsCreateModalOpen,
        publishPost,
        toggleLike,
        deletePost,
        activeCommentsPostId,
        commentsMap,
        toggleCommentsDrawer,
        postComment,
        sharePost,
        shareNotification,
        loading,
        error,
    };
}
