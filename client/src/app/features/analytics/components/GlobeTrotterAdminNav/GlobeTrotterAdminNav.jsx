import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Search, Bell, User, Settings } from 'lucide-react';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import './GlobeTrotterAdminNav.scss';

export function GlobeTrotterAdminNav({ onSearchChange, searchValue = '' }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [localSearch, setLocalSearch] = useState(searchValue);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setLocalSearch(val);
        if (onSearchChange) {
            onSearchChange(val);
        }
    };

    return (
        <header className="globetrotter-admin-nav">
            <div className="nav-left">
                {/* Brand Logo */}
                <div
                    className="brand-logo"
                    onClick={() => navigate('/dashboard/admin/home')}
                    role="button"
                    tabIndex={0}
                >
                    <span className="brand-text">GlobeTrotter</span>
                </div>

                {/* Primary Nav Links */}
                <nav className="nav-links">
                    <NavLink
                        to="/dashboard/admin/home"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/analytics"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Analytics
                    </NavLink>
                    <NavLink
                        to="/dashboard/admin/users"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Users
                    </NavLink>
                    <NavLink
                        to="/dashboard/user/home"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Locations
                    </NavLink>
                    <NavLink
                        to="/dashboard/user/community"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Community
                    </NavLink>
                </nav>
            </div>

            <div className="nav-right">
                {/* Global Search Pill */}
                <div className="nav-search-wrapper">
                    <Search size={15} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={localSearch}
                        onChange={handleSearchInput}
                        className="search-input"
                    />
                </div>

                {/* Notification Bell */}
                <button
                    type="button"
                    className="icon-action-btn"
                    title="Notifications"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="bell-badge-dot" />
                </button>

                {/* User Avatar */}
                <button
                    type="button"
                    className="icon-action-btn avatar-btn"
                    title={user?.email || 'Admin Profile'}
                    onClick={() => navigate('/dashboard/admin/settings/account')}
                >
                    <User size={18} />
                </button>

                {/* Admin Settings Pill */}
                <button
                    type="button"
                    className="admin-settings-pill"
                    onClick={() => navigate('/dashboard/admin/settings/general')}
                >
                    <Settings size={14} className="settings-icon" />
                    <span>Admin Settings</span>
                </button>
            </div>
        </header>
    );
}

export default GlobeTrotterAdminNav;
