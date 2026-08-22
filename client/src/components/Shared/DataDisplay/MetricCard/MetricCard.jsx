import React from 'react';
import './MetricCard.scss';

function MetricCard({
    label = '',
    value = '',
    icon: IconComponent = null,
    iconColor = '#f87171',
    variant = 'default',
    subValue = null,
    onClick = null,
    className = '',
}) {
    const isClickable = typeof onClick === 'function';

    return (
        <div
            className={`shared-metric-card variant-${variant} ${isClickable ? 'is-clickable' : ''} ${className}`}
            onClick={isClickable ? onClick : undefined}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
        >
            <div className="metric-card-top">
                <span className="metric-card-label">{label}</span>
                {IconComponent && (
                    <div className="metric-card-icon" style={{ color: iconColor }}>
                        {React.isValidElement(IconComponent) ? (
                            IconComponent
                        ) : (
                            <IconComponent size={20} />
                        )}
                    </div>
                )}
            </div>

            <div className="metric-card-bottom">
                <div className="metric-card-value">{value}</div>
                {subValue && <div className="metric-card-subvalue">{subValue}</div>}
            </div>
        </div>
    );
}

export function MetricCardGrid({ children, columns = 4, className = '' }) {
    return <div className={`shared-metric-grid cols-${columns} ${className}`}>{children}</div>;
}

export default MetricCard;
