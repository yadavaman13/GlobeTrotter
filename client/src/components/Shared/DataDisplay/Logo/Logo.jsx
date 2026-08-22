import './Logo.scss';

function Logo({ variant = 'login', text }) {
    const isDashboard = variant === 'dashboard';
    const logoText = text || (isDashboard ? 'Name' : 'Logo Here');

    return (
        <div className={`logo-container ${isDashboard ? 'logo-dashboard' : 'logo-login'}`}>
            {isDashboard ? (
                <svg
                    className="logo-icon-svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* A modern network-node structure matching the logo in the design */}
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <circle cx="6" cy="6" r="2.5" />
                    <circle cx="18" cy="6" r="2.5" />
                    <circle cx="6" cy="18" r="2.5" />
                    <circle cx="18" cy="18" r="2.5" />
                    <line x1="8.5" y1="8.5" x2="9.8" y2="9.8" />
                    <line x1="15.5" y1="8.5" x2="14.2" y2="9.8" />
                    <line x1="8.5" y1="15.5" x2="9.8" y2="14.2" />
                    <line x1="15.5" y1="15.5" x2="14.2" y2="14.2" />
                </svg>
            ) : (
                <div className="logo-icon"></div>
            )}
            <span className="logo-text">{logoText}</span>
        </div>
    );
}

export default Logo;
