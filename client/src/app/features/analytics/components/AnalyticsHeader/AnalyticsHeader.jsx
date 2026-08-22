import { RefreshCw, Download, Calendar, Activity } from 'lucide-react';
import Button from '@/components/Shared/Buttons/Button/Button';
import './AnalyticsHeader.scss';

export function AnalyticsHeader({
    title = 'Platform Analytics & Intelligence',
    subtitle = 'Real-time performance KPIs, travel itinerary trends, and budget tracking across GlobeTrotter.',
    lastUpdated,
    onRefresh,
    onExport,
    refreshing = false,
}) {
    const formattedLastUpdated = lastUpdated
        ? lastUpdated.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
          })
        : 'Just now';

    return (
        <div className="analytics-header-container">
            <div className="header-titles">
                <div className="title-row">
                    <Activity className="header-icon" size={24} />
                    <h1 className="header-main-title">{title}</h1>
                </div>
                <p className="header-subtitle">{subtitle}</p>
            </div>

            <div className="header-actions">
                <span className="last-sync-badge">
                    <span className="live-dot" /> Live Data (Updated {formattedLastUpdated})
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="refresh-btn"
                >
                    <RefreshCw size={14} className={refreshing ? 'spin-animation' : ''} />
                    Refresh
                </Button>

                <Button variant="primary" size="sm" onClick={() => onExport('csv')} className="export-btn">
                    <Download size={14} />
                    Export CSV
                </Button>
            </div>
        </div>
    );
}

export default AnalyticsHeader;
