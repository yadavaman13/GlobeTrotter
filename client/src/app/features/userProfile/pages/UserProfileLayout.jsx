import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import { getAvatarUrl } from '@/utils/avatar';
import { Compass, Bell, Heart, User, Settings, LogOut, Menu, X, MapPin } from 'lucide-react';
import Dialog from '@/components/Shared/Feedback/Dialog';
import { useToast } from '@/components/Shared/Feedback/Toast';
import './UserProfileLayout.scss';

export default function UserProfileLayout() {
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

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Traveler';
    const avatarUrl = getAvatarUrl(user?.profileImage);
    const roleSegment = user?.role?.toLowerCase() === 'admin' ? 'admin' : 'user';

    return (
        <div className="user-profile-layout-root">
            {/* Top Navigation Bar */}
            <nav className="profile-global-navbar">
                <div className="navbar-container">
                    {/* Left: Brand Logo */}
                    <div className="brand-logo-area" onClick={() => navigate('/')}>
                        <span className="brand-text">GlobeTrotter</span>
                        <Compass className="brand-icon text-primary" size={24} />
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="nav-links-links">
                        <a
                            className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
                            href="/"
                        >
                            Explore
                        </a>
                        <a
                            className={`nav-link-item ${location.pathname === '/me/trips' || (location.pathname.startsWith('/trips') && location.pathname !== '/trips/new') ? 'active' : ''}`}
                            href="/me/trips"
                        >
                            My Trips
                        </a>
                        <a
                            className={`nav-link-item ${location.pathname === '/trips/new' ? 'active' : ''}`}
                            href="/trips/new"
                        >
                            Plan a Trip
                        </a>
                    </div>

                    {/* Right: Actions and User Dropdown */}
                    <div className="nav-actions-area">
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

                        {/* Mobile Menu Icon */}
                        <button
                            className="mobile-menu-toggle-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="mobile-navigation-drawer">
                        <div className="mobile-links-stack">
                            <button
                                className="mobile-link"
                                onClick={() => handleMenuNavigation('/')}
                            >
                                Explore
                            </button>
                            <button
                                className="mobile-link"
                                onClick={() => handleMenuNavigation('/me/trips')}
                            >
                                My Trips
                            </button>
                            <button
                                className="mobile-link"
                                onClick={() => handleMenuNavigation('/trips/new')}
                            >
                                Plan a Trip
                            </button>
                            <div className="mobile-divider border-t" />
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
                        </div>
                    </div>
                )}
            </nav>

            {/* Layout Main Content Wrapper */}
            <main className="profile-layout-main-pane">
                <Outlet />
            </main>

            {/* Global Footer */}
            <footer className="profile-global-footer border-t">
                <div className="footer-container">
                    <div className="brand-copyright">
                        <span className="brand-text">GlobeTrotter</span>
                        <span className="copyright-text">
                            © 2026 GlobeTrotter, Inc. All rights reserved.
                        </span>
                    </div>
                    <nav className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Sitemap</a>
                        <a href="#">Company details</a>
                        <a href="#">Destinations</a>
                    </nav>
                </div>
            </footer>

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
        </div>
    );
}
