import { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import './KpiLineChartCard.scss';

/**
 * ======================================================================================
 * SERVER-SIDE INTEGRATION GUIDE:
 * ======================================================================================
 * In production, the dataset for each period selection should be fetched dynamically
 * from the database or mapped using a state hook loaded from a backend query.
 *
 * Example Integration:
 *
 * const [periodData, setPeriodData] = useState({})
 *
 * useEffect(() => {
 *   async function loadKPIs() {
 *     const response = await fetch(`/api/kpis?period=${activePeriod}`)
 *     const json = await response.json()
 *     setPeriodData(prev => ({ ...prev, [activePeriod]: json }))
 *   }
 *   loadKPIs()
 * }, [activePeriod])
 * ======================================================================================
 */

const DEFAULT_PERIODS = ['Last 6 Month', 'Last 12 Month', 'Year to Date', 'This Month'];

function KpiLineChartCard({
    title = 'KPI',
    data = null,
    periodDataMap = null,
    periodOptions = DEFAULT_PERIODS,
    selectedPeriod = 'Last 6 Month',
    onPeriodChange = null,
    onExpand = null,
    unit = 'h',
    currentLabel = null,
    previousLabel = 'Previous Period',
    currentColor = '#0066FF',
    previousColor = '#cbd5e1',
    height = 240,
    className = '',
    style = {},
}) {
    const [activePeriod, setActivePeriod] = useState(selectedPeriod);

    const handlePeriodSelect = (val) => {
        setActivePeriod(val);
        if (onPeriodChange) onPeriodChange(val);
    };

    // Resolve dataset based on active period filter selection
    const displayData = useMemo(() => {
        // 1. Explicit periodDataMap prop (e.g. { 'Last 6 Month': [...], 'Last 12 Month': [...] })
        if (periodDataMap && periodDataMap[activePeriod]) {
            return periodDataMap[activePeriod];
        }
        // 2. Data prop passed as a period-indexed object
        if (data && typeof data === 'object' && !Array.isArray(data) && data[activePeriod]) {
            return data[activePeriod];
        }
        // 3. Explicit static data array passed by parent
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }

        // No data matched: default to empty array placeholder
        return [];
    }, [data, periodDataMap, activePeriod]);

    return (
        <div className={`kpi-line-chart-card ${className}`} style={style}>
            {/* Header Row */}
            <div className="kpi-card-header">
                <h3 className="kpi-card-title">{title}</h3>

                <div className="kpi-header-actions">
                    {/* Time Period Filter Dropdown */}
                    <Dropdown
                        options={periodOptions}
                        value={activePeriod}
                        onChange={handlePeriodSelect}
                        className="kpi-period-dropdown"
                        size="small"
                    />

                    {/* Expand / Action Button */}
                    <button
                        type="button"
                        className="kpi-expand-btn"
                        onClick={onExpand}
                        aria-label="Expand KPI chart"
                    >
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>

            {/* Chart Canvas (Disabled) */}
            <div
                className="kpi-chart-body"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: height,
                    border: '1px dashed #e2e8f0',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                }}
            >
                <span>Chart preview currently disabled</span>
            </div>

            {/* Bottom Custom Legend */}
            <div className="kpi-card-legend">
                <div className="kpi-legend-item">
                    <span className="legend-solid-line" style={{ backgroundColor: currentColor }} />
                    <span className="legend-text">{currentLabel || activePeriod}</span>
                </div>

                <div className="kpi-legend-item">
                    <span className="legend-dashed-line" />
                    <span className="legend-text">{previousLabel}</span>
                </div>
            </div>
        </div>
    );
}

export default KpiLineChartCard;
