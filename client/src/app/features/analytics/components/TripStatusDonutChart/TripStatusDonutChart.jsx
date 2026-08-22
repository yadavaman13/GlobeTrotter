import { useMemo, useState } from 'react';
import './TripStatusDonutChart.scss';

const STATUS_CONFIG = {
    draft: { label: 'Draft', color: '#94a3b8' },
    planned: { label: 'Planned', color: '#3b82f6' },
    ongoing: { label: 'Ongoing', color: '#10b981' },
    completed: { label: 'Completed', color: '#8b5cf6' },
    cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export function TripStatusDonutChart({ byStatus = {}, total = 0 }) {
    const [hoveredStatus, setHoveredStatus] = useState(null);

    const segments = useMemo(() => {
        const entries = Object.entries(byStatus);
        const statusTotal = entries.reduce((sum, [, count]) => sum + Number(count), 0) || total || 0;

        if (statusTotal === 0) {
            return [];
        }

        let cumulativeAngle = 0;
        return entries.map(([status, count]) => {
            const countNum = Number(count);
            const percentage = (countNum / statusTotal) * 100;
            const angle = (countNum / statusTotal) * 360;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;

            return {
                status,
                label: STATUS_CONFIG[status]?.label || status,
                color: STATUS_CONFIG[status]?.color || '#cbd5e1',
                count: countNum,
                percentage: percentage.toFixed(1),
                startAngle,
                angle,
            };
        });
    }, [byStatus, total]);

    // Calculate SVG donut stroke-dasharray values
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;

    return (
        <div className="trip-status-chart-card">
            <div className="card-header">
                <h3 className="chart-title">Itinerary Status Distribution</h3>
                <span className="chart-caption">Active, planned, and archived trips</span>
            </div>

            <div className="chart-body">
                <div className="donut-svg-wrapper">
                    <svg viewBox="0 0 200 200" className="donut-svg">
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="transparent"
                            stroke="var(--bg-canvas, #f1f5f9)"
                            strokeWidth="24"
                        />
                        {segments.map((seg) => {
                            const strokeDasharray = `${(seg.angle / 360) * circumference} ${circumference}`;
                            const strokeDashoffset = -accumulatedOffset;
                            accumulatedOffset += (seg.angle / 360) * circumference;

                            const isHovered = hoveredStatus === seg.status;

                            return (
                                <circle
                                    key={seg.status}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="transparent"
                                    stroke={seg.color}
                                    strokeWidth={isHovered ? 28 : 24}
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="donut-segment"
                                    onMouseEnter={() => setHoveredStatus(seg.status)}
                                    onMouseLeave={() => setHoveredStatus(null)}
                                />
                            );
                        })}
                    </svg>

                    <div className="donut-center-label">
                        <span className="center-number">
                            {hoveredStatus
                                ? (byStatus[hoveredStatus] ?? 0)
                                : total}
                        </span>
                        <span className="center-text">
                            {hoveredStatus ? STATUS_CONFIG[hoveredStatus]?.label : 'Total Trips'}
                        </span>
                    </div>
                </div>

                <div className="donut-legend-list">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                        const count = Number(byStatus[key] || 0);
                        const isHovered = hoveredStatus === key;

                        return (
                            <div
                                key={key}
                                className={`legend-item ${isHovered ? 'active' : ''}`}
                                onMouseEnter={() => setHoveredStatus(key)}
                                onMouseLeave={() => setHoveredStatus(null)}
                            >
                                <span className="legend-dot" style={{ backgroundColor: config.color }} />
                                <span className="legend-name">{config.label}</span>
                                <span className="legend-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default TripStatusDonutChart;
