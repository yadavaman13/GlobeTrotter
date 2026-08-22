import { Outlet } from 'react-router';
import Navbar from '@/components/Shared/Navigation/Navbar/Navbar';
import './UserProfileLayout.scss';

export default function UserProfileLayout() {
    return (
        <div className="user-profile-layout-root">
            {/* Top Navigation Bar */}
            <Navbar />

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
        </div>
    );
}
