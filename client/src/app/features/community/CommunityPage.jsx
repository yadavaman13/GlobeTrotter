import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCommunityData } from './hooks/useCommunityData';
import { CommunityProvider } from './context/CommunityContext';
import CreatePostModal from './components/CreatePostModal';
import './CommunityPage.scss';

export default function CommunityPage() {
    const navigate = useNavigate();
    const communityData = useCommunityData();
    const {
        user,
        searchQuery,
        setSearchQuery,
        activeTypeFilter,
        setActiveTypeFilter,
        sortBy,
        setSortBy,
        posts,
        loading,
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
    } = communityData;

    const [commentInputs, setCommentInputs] = useState({});
    const [postToDelete, setPostToDelete] = useState(null);

    // Load Material Symbols Outlined font
    useEffect(() => {
        const link = document.createElement('link');
        link.href =
            'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, []);

    const trendingHashtags = ['#JapanAutumn', '#BaliEscape', '#SoloTravelGirl', '#EuropeanSummer'];

    const categories = ['Adventure', 'Cultural', 'Foodie', 'Relaxation'];

    const handleShareTripClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setIsCreateModalOpen(true);
        }
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const text = commentInputs[postId] || '';
        if (!text.trim()) return;

        if (!user) {
            navigate('/login');
            return;
        }

        const success = await postComment(postId, text);
        if (success) {
            setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
        }
    };

    return (
        <CommunityProvider value={communityData}>
            <div className="community-page-root">
                {/* Share Notification Toast */}
                {shareNotification && <div className="toast-notification">{shareNotification}</div>}

                {/* Delete Confirmation Modal */}
                {postToDelete && (
                    <div className="modal-backdrop">
                        <div className="modal-card-box confirmation-modal-box">
                            <span className="material-symbols-outlined warning-trash-icon">
                                delete_forever
                            </span>
                            <h3 className="modal-title-confirm">Delete Post?</h3>
                            <p className="modal-subtitle-confirm">
                                Are you sure you want to delete &quot;
                                {postToDelete.title || 'this post'}&quot;? This action cannot be
                                undone.
                            </p>
                            <div className="modal-confirm-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setPostToDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-submit-danger"
                                    onClick={async () => {
                                        await deletePost(postToDelete.id);
                                        setPostToDelete(null);
                                    }}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Navigation Bar */}
                <nav className="community-top-nav">
                    <div className="nav-container">
                        <a className="brand-logo" onClick={() => navigate('/')}>
                            GlobeTrotter
                        </a>
                        <div className="nav-links-center">
                            <span className="nav-item" onClick={() => navigate('/')}>
                                Explore
                            </span>
                            <span className="nav-item active">Community</span>
                            <span
                                className="nav-item"
                                onClick={() =>
                                    navigate(user ? '/dashboard/user/analytics/insight' : '/login')
                                }
                            >
                                Trips
                            </span>
                        </div>
                        <div className="nav-actions-right">
                            <button type="button" className="icon-btn" aria-label="Notifications">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button type="button" className="icon-btn" aria-label="Settings">
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                            <div
                                className="user-avatar-pill"
                                onClick={() =>
                                    navigate(user ? '/dashboard/user/analytics/insight' : '/login')
                                }
                            >
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} />
                                ) : (
                                    <span className="material-symbols-outlined fallback-avatar">
                                        account_circle
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="community-main-canvas">
                    {/* Hero Section */}
                    <section className="community-hero-section">
                        <div className="hero-bg-collage" />
                        <div className="hero-backdrop-scrim" />
                        <div className="hero-text-content">
                            <h1 className="hero-title">
                                Explore trips shared by travelers around the world.
                            </h1>
                            <button
                                type="button"
                                className="hero-share-btn"
                                onClick={handleShareTripClick}
                            >
                                Share Your Trip
                            </button>
                        </div>
                    </section>

                    {/* Search & Filter Toolbar */}
                    <section className="search-filter-toolbar">
                        <div className="search-pill-input-box">
                            <span className="material-symbols-outlined search-icon">search</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search communities, hashtags, or destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="toolbar-filter-buttons">
                            <button type="button" className="toolbar-btn">
                                Group by
                                <span className="material-symbols-outlined icon-sm">
                                    expand_more
                                </span>
                            </button>
                            <button type="button" className="toolbar-btn">
                                <span className="material-symbols-outlined icon-sm">tune</span>
                                Filter
                            </button>
                            <button
                                type="button"
                                className="toolbar-btn"
                                onClick={() => setSortBy(sortBy === 'recent' ? 'oldest' : 'recent')}
                            >
                                Sort by: {sortBy === 'recent' ? 'Recent' : 'Oldest'}
                                <span className="material-symbols-outlined icon-sm">
                                    expand_more
                                </span>
                            </button>
                        </div>
                    </section>

                    {/* Layout Grid */}
                    <div className="community-three-column-grid">
                        {/* Left Sidebar (Sticky) */}
                        <aside className="left-sidebar-sticky">
                            <div className="sidebar-card">
                                <h3 className="card-title">
                                    <span className="material-symbols-outlined title-icon">
                                        trending_up
                                    </span>
                                    Trending Now
                                </h3>
                                <ul className="hashtags-list">
                                    {trendingHashtags.map((tag) => (
                                        <li key={tag}>
                                            <a
                                                className="hashtag-link"
                                                onClick={() => setSearchQuery(tag)}
                                            >
                                                {tag}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="sidebar-card">
                                <h3 className="card-title">Explore Categories</h3>
                                <div className="categories-chips-wrap">
                                    {categories.map((cat) => (
                                        <span
                                            key={cat}
                                            className={`category-chip ${
                                                activeTypeFilter === cat ? 'active' : ''
                                            }`}
                                            onClick={() =>
                                                setActiveTypeFilter(
                                                    activeTypeFilter === cat ? 'all' : cat,
                                                )
                                            }
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Center Column: Feed */}
                        <div className="center-feed-column">
                            <h2 className="feed-heading">Community Feed</h2>

                            <div className="posts-feed-list">
                                {loading && posts.length === 0 ? (
                                    <div className="loading-state-card">Loading experiences...</div>
                                ) : posts.length > 0 ? (
                                    posts.map((post) => {
                                        const isAuthor = user && user.id === post.authorId;
                                        const commentsForPost = commentsMap[post.id] || [];
                                        const isCommentsOpen = activeCommentsPostId === post.id;

                                        return (
                                            <article key={post.id} className="community-post-card">
                                                <div className="card-inner-padding">
                                                    {/* Header */}
                                                    <div className="post-author-row">
                                                        <div className="author-info-group">
                                                            {post.author.profileImage ? (
                                                                <img
                                                                    src={post.author.profileImage}
                                                                    alt={post.author.name}
                                                                    className="author-avatar-img"
                                                                />
                                                            ) : (
                                                                <div className="author-avatar-placeholder">
                                                                    <span className="material-symbols-outlined icon-person">
                                                                        person
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="author-name-line">
                                                                    <h4 className="author-name">
                                                                        {post.author.name}
                                                                    </h4>
                                                                    {post.author.verified && (
                                                                        <span className="material-symbols-outlined verified-icon">
                                                                            verified
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="post-timestamp-location">
                                                                    {post.author.location ||
                                                                        'Traveler'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="post-header-actions">
                                                            {isAuthor && (
                                                                <button
                                                                    type="button"
                                                                    className="more-options-btn delete-btn"
                                                                    onClick={() =>
                                                                        setPostToDelete(post)
                                                                    }
                                                                    title="Delete your post"
                                                                >
                                                                    <span className="material-symbols-outlined">
                                                                        delete
                                                                    </span>
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="more-options-btn"
                                                            >
                                                                <span className="material-symbols-outlined">
                                                                    more_horiz
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Title & Content */}
                                                    {post.title && (
                                                        <h3 className="post-item-title">
                                                            {post.title}
                                                        </h3>
                                                    )}
                                                    <p className="post-content-text">
                                                        {post.content}
                                                    </p>

                                                    {/* Image Gallery */}
                                                    {post.images && post.images.length > 0 && (
                                                        <div className="post-images-grid">
                                                            {post.images
                                                                .slice(0, 2)
                                                                .map((imgUrl, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="image-item-wrap"
                                                                    >
                                                                        <img
                                                                            src={imgUrl}
                                                                            alt={`Post image ${idx + 1}`}
                                                                            className="grid-photo"
                                                                        />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}

                                                    {/* Target Preview */}
                                                    {post.trip && (
                                                        <div
                                                            className="mini-itinerary-preview-box"
                                                            onClick={() =>
                                                                navigate(
                                                                    user
                                                                        ? '/dashboard/user/analytics/insight'
                                                                        : '/login',
                                                                )
                                                            }
                                                        >
                                                            <div className="preview-left-info">
                                                                <div className="map-badge-icon">
                                                                    <span className="material-symbols-outlined">
                                                                        map
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h5 className="trip-name-title">
                                                                        {post.trip.name}
                                                                    </h5>
                                                                    <p className="trip-meta-subtitle">
                                                                        Trip Experience
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="material-symbols-outlined chevron-icon">
                                                                chevron_right
                                                            </span>
                                                        </div>
                                                    )}

                                                    {post.activity && (
                                                        <div className="mini-itinerary-preview-box">
                                                            <div className="preview-left-info">
                                                                <div className="map-badge-icon">
                                                                    <span className="material-symbols-outlined">
                                                                        hiking
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h5 className="trip-name-title">
                                                                        {post.activity.name}
                                                                    </h5>
                                                                    <p className="trip-meta-subtitle">
                                                                        Activity Experience
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Engagement Bar */}
                                                    <div className="post-engagement-bar">
                                                        <div className="counters-left">
                                                            <button
                                                                type="button"
                                                                className="action-counter-btn"
                                                                onClick={() => {
                                                                    if (!user) navigate('/login');
                                                                    else toggleLike(post.id);
                                                                }}
                                                                title="Like this post"
                                                            >
                                                                <span
                                                                    className={`material-symbols-outlined heart-icon ${post.isLiked ? 'liked' : ''}`}
                                                                >
                                                                    {post.isLiked
                                                                        ? 'favorite'
                                                                        : 'favorite_border'}
                                                                </span>
                                                                {post.likesCount || 0}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="action-counter-btn"
                                                                onClick={() =>
                                                                    toggleCommentsDrawer(post.id)
                                                                }
                                                                title="Comments"
                                                            >
                                                                <span className="material-symbols-outlined">
                                                                    chat_bubble
                                                                </span>
                                                                {post.commentsCount || 0}
                                                            </button>
                                                        </div>
                                                        <div className="actions-right">
                                                            <button
                                                                type="button"
                                                                className="icon-action-btn"
                                                                onClick={() => sharePost(post)}
                                                                title="Share Link"
                                                            >
                                                                <span className="material-symbols-outlined">
                                                                    share
                                                                </span>
                                                            </button>
                                                            {post.trip && (
                                                                <button
                                                                    type="button"
                                                                    className="copy-trip-btn"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            user
                                                                                ? '/dashboard/user/analytics/insight'
                                                                                : '/login',
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="material-symbols-outlined icon-sm">
                                                                        content_copy
                                                                    </span>
                                                                    Copy Trip
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Inline Comments Section */}
                                                    {isCommentsOpen && (
                                                        <div className="inline-comments-section">
                                                            <h4 className="comments-section-title">
                                                                Comments
                                                            </h4>
                                                            <div className="comments-list-box">
                                                                {commentsForPost.length > 0 ? (
                                                                    commentsForPost.map((c) => (
                                                                        <div
                                                                            key={c.id}
                                                                            className="comment-bubble-item"
                                                                        >
                                                                            <strong className="comment-author-name">
                                                                                {
                                                                                    c.author
                                                                                        ?.firstName
                                                                                }{' '}
                                                                                {c.author?.lastName}
                                                                                :
                                                                            </strong>{' '}
                                                                            <span className="comment-content-text">
                                                                                {c.content}
                                                                            </span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="no-comments-text">
                                                                        No comments yet. Write a
                                                                        comment below!
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <form
                                                                onSubmit={(e) =>
                                                                    handleCommentSubmit(e, post.id)
                                                                }
                                                                className="comment-input-form"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder="Write a comment..."
                                                                    className="comment-text-input"
                                                                    value={
                                                                        commentInputs[post.id] || ''
                                                                    }
                                                                    onChange={(e) =>
                                                                        setCommentInputs({
                                                                            ...commentInputs,
                                                                            [post.id]:
                                                                                e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    className="comment-submit-btn"
                                                                >
                                                                    Post
                                                                </button>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })
                                ) : (
                                    <div className="empty-feed-card">
                                        <div className="empty-icon-badge">
                                            <span className="material-symbols-outlined">forum</span>
                                        </div>
                                        <h3 className="empty-card-title">
                                            No community experiences shared yet
                                        </h3>
                                        <p className="empty-card-subtitle">
                                            Be the first traveler to share a trip or activity
                                            experience with the community!
                                        </p>
                                        <button
                                            type="button"
                                            className="empty-state-action-btn"
                                            onClick={handleShareTripClick}
                                        >
                                            <span className="material-symbols-outlined icon-sm">
                                                add
                                            </span>
                                            Share Your Experience
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Floating CTA */}
                <button
                    type="button"
                    className="floating-publish-fab shadow-lg"
                    onClick={handleShareTripClick}
                    title="Publish Itinerary"
                >
                    <span className="material-symbols-outlined">edit_square</span>
                    <span className="fab-label">Publish Itinerary</span>
                </button>

                {/* Create Post Modal */}
                <CreatePostModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={publishPost}
                />

                {/* Footer */}
                <footer className="community-footer">
                    <div className="footer-container">
                        <div className="footer-brand-wrap">
                            <h2 className="footer-logo">GlobeTrotter</h2>
                            <p className="footer-copy-text">
                                © 2024 GlobeTrotter Community. All rights reserved.
                            </p>
                        </div>
                        <nav className="footer-links-list">
                            <a href="#" className="footer-link">
                                Explore
                            </a>
                            <a href="#" className="footer-link active">
                                Community
                            </a>
                            <a href="#" className="footer-link">
                                My Trips
                            </a>
                            <a href="#" className="footer-link">
                                Support
                            </a>
                            <a href="#" className="footer-link">
                                Privacy
                            </a>
                            <a href="#" className="footer-link">
                                Terms
                            </a>
                        </nav>
                    </div>
                </footer>
            </div>
        </CommunityProvider>
    );
}
