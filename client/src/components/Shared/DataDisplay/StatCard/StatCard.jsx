import { isValidElement } from 'react';
import './StatCard.scss';

function StatCard({ title, value, trend, isPositive, icon, className = '' }) {
    const renderIcon = () => {
        if (!icon) return null;
        if (isValidElement(icon)) return icon;
        if (typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof)) {
            const IconComp = icon;
            return <IconComp size={20} />;
        }
        return null;
    };

    const trendText = typeof trend === 'object' && trend !== null ? trend.label : trend;
    const isTrendPositive =
        typeof trend === 'object' && trend !== null
            ? trend.direction === 'up'
            : isPositive !== undefined
              ? isPositive
              : true;

    return (
        <div className={`stat-card-container ${className}`}>
            <div className="stat-icon-wrapper">{renderIcon()}</div>
            <div className="stat-details">
                <span className="stat-title">{title}</span>
                <div className="stat-value-row">
                    <span className="stat-value">{value}</span>
                    {trendText && (
                        <span className={`stat-trend ${isTrendPositive ? 'positive' : 'negative'}`}>
                            <span className="trend-arrow">
                                {isTrendPositive ? (
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="19" x2="12" y2="5" />
                                        <polyline points="5 12 12 5 19 12" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <polyline points="19 12 12 19 5 12" />
                                    </svg>
                                )}
                            </span>
                            <span className="trend-text">{trendText}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
