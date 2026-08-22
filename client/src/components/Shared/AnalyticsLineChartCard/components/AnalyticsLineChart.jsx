import { useState } from 'react';

function AnalyticsLineChart({
    dataPrimary = [],
    dataSecondary = [],
    labels = [],
    yTicks = [0, 500, 1000, 1500],
    yMax = 1500,
}) {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    // SVG dimensions
    const viewWidth = 320;
    const viewHeight = 130;
    const paddingLeft = 36;
    const paddingRight = 10;
    const paddingTop = 10;
    const paddingBottom = 20;

    const chartWidth = viewWidth - paddingLeft - paddingRight;
    const chartHeight = viewHeight - paddingTop - paddingBottom;
    const yBottom = viewHeight - paddingBottom;

    const getX = (idx) => paddingLeft + idx * (chartWidth / (labels.length - 1));
    const getY = (val) => yBottom - (val / yMax) * chartHeight;

    const makeSmoothPath = (points) => {
        if (points.length === 0) return '';
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const dx = (p1.x - p0.x) * 0.4;
            const cp1x = p0.x + dx;
            const cp1y = p0.y;
            const cp2x = p1.x - dx;
            const cp2y = p1.y;
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
        }
        return d;
    };

    const pointsPrimary = dataPrimary.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    const pointsSecondary = dataSecondary.map((val, idx) => ({ x: getX(idx), y: getY(val) }));

    const pathPrimary = makeSmoothPath(pointsPrimary);
    const pathSecondary = makeSmoothPath(pointsSecondary);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const scaleX = viewWidth / rect.width;
        const svgX = mouseX * scaleX;

        let closestIdx = 0;
        let minDiff = Infinity;
        for (let i = 0; i < labels.length; i++) {
            const diff = Math.abs(getX(i) - svgX);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = i;
            }
        }
        setHoveredIdx(closestIdx);
    };

    return (
        <div
            className="card-chart-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIdx(null)}
        >
            <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="svg-line-chart">
                {/* Grid lines */}
                {yTicks.map((val) => {
                    const yCoord = getY(val);
                    return (
                        <g key={val} className="y-grid-line-group">
                            <text x={paddingLeft - 8} y={yCoord + 3} className="y-tick-label">
                                {val}
                            </text>
                            <line
                                x1={paddingLeft}
                                y1={yCoord}
                                x2={viewWidth - paddingRight}
                                y2={yCoord}
                                className="grid-line"
                            />
                        </g>
                    );
                })}

                {/* X axis Day Ticks */}
                {labels.map((lbl, idx) => (
                    <text key={lbl} x={getX(idx)} y={yBottom + 14} className="x-tick-label">
                        {lbl}
                    </text>
                ))}

                {/* Hover highlight line */}
                {hoveredIdx !== null && (
                    <line
                        x1={getX(hoveredIdx)}
                        y1={paddingTop}
                        x2={getX(hoveredIdx)}
                        y2={yBottom}
                        className="chart-hover-line"
                    />
                )}

                {/* Chart Paths */}
                {dataSecondary.length > 0 && (
                    <path d={pathSecondary} className="chart-path-line secondary-dashed" />
                )}
                {dataPrimary.length > 0 && (
                    <path d={pathPrimary} className="chart-path-line primary-solid" />
                )}

                {/* Hover Anchors */}
                {hoveredIdx !== null && (
                    <g>
                        {dataSecondary.length > 0 && pointsSecondary[hoveredIdx] && (
                            <>
                                <circle
                                    cx={pointsSecondary[hoveredIdx].x}
                                    cy={pointsSecondary[hoveredIdx].y}
                                    r="4"
                                    className="anchor-circle outer secondary"
                                />
                                <circle
                                    cx={pointsSecondary[hoveredIdx].x}
                                    cy={pointsSecondary[hoveredIdx].y}
                                    r="1.5"
                                    className="anchor-circle inner secondary"
                                />
                            </>
                        )}

                        {dataPrimary.length > 0 && pointsPrimary[hoveredIdx] && (
                            <>
                                <circle
                                    cx={pointsPrimary[hoveredIdx].x}
                                    cy={pointsPrimary[hoveredIdx].y}
                                    r="4"
                                    className="anchor-circle outer primary"
                                />
                                <circle
                                    cx={pointsPrimary[hoveredIdx].x}
                                    cy={pointsPrimary[hoveredIdx].y}
                                    r="1.5"
                                    className="anchor-circle inner primary"
                                />
                            </>
                        )}
                    </g>
                )}
            </svg>

            {/* Legend */}
            <div className="chart-legend-row">
                <div className="legend-item">
                    <span className="legend-line solid-purple"></span>
                    <span className="legend-label">14 - 21 Sep 2023</span>
                </div>
                {dataSecondary.length > 0 && (
                    <div className="legend-item">
                        <span className="legend-line dashed-blue"></span>
                        <span className="legend-label">6 - 13 Sep 2023</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalyticsLineChart;
