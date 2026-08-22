import { MoreVertical as ThreeDotIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

function AnalyticsCardHeader({ title, icon, showInfo }) {
    return (
        <div className="card-top-header">
            <div className="header-left">
                {icon && <span className="card-header-icon">{icon}</span>}
                <span className="card-title-text">{title}</span>
                {showInfo && (
                    <span className="info-icon" title={`${title} details`}>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </span>
                )}
            </div>
            <div className="header-right">
                <button type="button" className="action-dot-btn">
                    <ThreeDotIcon size={14} />
                </button>
                <button type="button" className="action-link-btn">
                    <ChevronRightIcon size={12} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

export default AnalyticsCardHeader;
