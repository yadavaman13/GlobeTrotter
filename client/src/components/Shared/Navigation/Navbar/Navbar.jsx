import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import { getAvatarUrl } from '@/utils/avatar';
import { Compass, Bell, Heart, User, Settings, LogOut, Menu, X, MapPin } from 'lucide-react';
import Dialog from '@/components/Shared/Feedback/Dialog';
import { useToast } from '@/components/Shared/Feedback/Toast';
import './Navbar.scss';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { success } = useToast();
    const { user, handleLogout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleConfirmLogout = async () => {
        setShowLogoutModal(false);
        try {
            await handleLogout();
            success('Logged out successfully.');
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleMenuNavigation = (path) => {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    const handleDiscoverClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const searchEl = document.getElementById('search-anchor');
            if (searchEl) {
                searchEl.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/dashboard/user/analytics/insight');
        }
        setIsMobileMenuOpen(false);
    };

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Traveler';
    const avatarUrl = user ? getAvatarUrl(user.profileImage) : null;
    const roleSegment = user?.role?.toLowerCase() === 'admin' ? 'admin' : 'user';

    return (
        <nav className="global-navbar">
            <div className="navbar-container">
                {/* Left: Brand Logo */}
                <div className="brand-logo-area" onClick={() => navigate('/')}>
                    <span className="brand-text">GlobeTrotter</span>
                    <Compass className="brand-icon" size={24} />
                </div>

                {/* Center: Navigation Links */}
                <div className="nav-links-links">
                    <a
                        className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                    >
                        Explore
                    </a>
                    <a
                        className={`nav-link-item ${location.pathname === '/me/trips' ? 'active' : ''}`}
                        href="/me/trips"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/me/trips');
                        }}
                    >
                        My Trips
                    </a>
                    <a
                        className={`nav-link-item ${
                            location.pathname.startsWith('/dashboard/user/analytics')
                                ? 'active'
                                : ''
                        }`}
                        href="#search-anchor"
                        onClick={handleDiscoverClick}
                    >
                        Discover Experiences
                    </a>
                </div>

                {/* Right: Actions and User Dropdown */}
                <div className="nav-actions-area">
                    {user ? (
                        <>
                            <button className="navbar-action-btn" title="Notifications">
                                <Bell size={20} />
                            </button>
                            <button className="navbar-action-btn" title="Favorites">
                                <Heart size={20} />
                            </button>

                            {/* Profile Dropdown Trigger */}
                            <div className="user-dropdown-relative-container">
                                <button
                                    className="navbar-profile-trigger-btn"
                                    onClick={handleToggleMenu}
                                    aria-label="User menu"
                                >
                                    <img
                                        src={avatarUrl}
                                        alt={fullName}
                                        className="navbar-user-avatar"
                                    />
                                </button>

                                {isMenuOpen && (
                                    <div className="user-menu-dropdown-card">
                                        <div className="dropdown-user-header border-b">
                                            <p className="user-name-text">{fullName}</p>
                                            <p className="user-email-text">{user?.email}</p>
                                        </div>
                                        <div className="dropdown-links-list">
                                            <button
                                                className="dropdown-link-btn"
                                                onClick={() => handleMenuNavigation('/me/profile')}
                                            >
                                                <User size={16} />
                                                <span>My Profile</span>
                                            </button>
                                            <button
                                                className="dropdown-link-btn"
                                                onClick={() => handleMenuNavigation('/me/trips')}
                                            >
                                                <MapPin size={16} />
                                                <span>My Trips</span>
                                            </button>
                                            <button
                                                className="dropdown-link-btn"
                                                onClick={() =>
                                                    handleMenuNavigation(
                                                        `/dashboard/${roleSegment}/settings/general`,
                                                    )
                                                }
                                            >
                                                <Settings size={16} />
                                                <span>Account Settings</span>
                                            </button>
                                            <div className="dropdown-divider border-t" />
                                            <button
                                                className="dropdown-link-btn logout-link text-danger"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setShowLogoutModal(true);
                                                }}
                                            >
                                                <LogOut size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button className="navbar-login-btn" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    )}

                    {/* Mobile Menu Icon */}
                    <button
                        className="mobile-menu-toggle-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation drawer"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="mobile-navigation-drawer">
                    <div className="mobile-links-stack">
                        <button className="mobile-link" onClick={() => handleMenuNavigation('/')}>
                            Explore
                        </button>
                        <button
                            className="mobile-link"
                            onClick={() => handleMenuNavigation('/me/trips')}
                        >
                            My Trips
                        </button>
                        <button className="mobile-link" onClick={handleDiscoverClick}>
                            Discover Experiences
                        </button>
                        <div className="mobile-divider border-t" />
                        {user ? (
                            <>
                                <button
                                    className="mobile-link"
                                    onClick={() => handleMenuNavigation('/me/profile')}
                                >
                                    My Profile
                                </button>
                                <button
                                    className="mobile-link"
                                    onClick={() =>
                                        handleMenuNavigation(
                                            `/dashboard/${roleSegment}/settings/general`,
                                        )
                                    }
                                >
                                    Account Settings
                                </button>
                                <button
                                    className="mobile-link text-danger"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setShowLogoutModal(true);
                                    }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                className="mobile-link text-primary"
                                onClick={() => handleMenuNavigation('/login')}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Logout Modal dialog */}
            <Dialog
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirm Sign Out"
                variant="danger"
                size="sm"
                confirmText="Sign Out"
                cancelText="Cancel"
                onConfirm={handleConfirmLogout}
            >
                <p>
                    Are you sure you want to sign out of your GlobeTrotter account? Any unsaved
                    travel notes may be lost.
                </p>
            </Dialog>
        </nav>
    );
}
