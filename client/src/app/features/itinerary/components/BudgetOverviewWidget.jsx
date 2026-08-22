import { AlertTriangle, ArrowUpRight, Share2, FileText, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router';

export function BudgetOverviewWidget({
    tripId,
    totalBudget = 0,
    totalEstimated = 0,
    currency = 'USD',
    onOpenShare,
}) {
    const navigate = useNavigate();

    const baseline = Number(totalBudget) || 0;
    const estimated = Number(totalEstimated) || 0;
    const percentage = baseline > 0 ? Math.min(100, Math.round((estimated / baseline) * 100)) : 0;
    const isOverBudget = baseline > 0 && estimated > baseline;
    const remaining = Math.max(0, baseline - estimated);

    // SVG Circular Progress calculation
    const radius = 46;
    const circumference = 2 * Math.PI * radius; // ~289
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="budget-overview-widget">
            <div className="widget-header">
                <h3 className="widget-title">Budget Overview</h3>
                <button
                    type="button"
                    className="analytics-link-btn"
                    onClick={() => navigate(`/trips/${tripId}/budget`)}
                    title="View Analytics"
                >
                    <PieChart size={16} />
                </button>
            </div>

            {/* Circular Gauge */}
            <div className="gauge-container">
                <div className="gauge-circle">
                    <svg viewBox="0 0 100 100" className="gauge-svg">
                        <circle cx="50" cy="50" r={radius} className="gauge-track" />
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            className={`gauge-progress ${isOverBudget ? 'over-budget' : ''}`}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className="gauge-center-text">
                        <span className="gauge-percentage">{percentage}%</span>
                        <span className="gauge-label">
                            {isOverBudget ? 'EXCEEDED' : 'ALLOCATED'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Over Budget Warning Alert */}
            {isOverBudget && (
                <div className="over-budget-banner">
                    <AlertTriangle size={16} />
                    <span>
                        Exceeds budget by {currency} {(estimated - baseline).toLocaleString()}
                    </span>
                </div>
            )}

            {/* Metric Summary Rows */}
            <div className="budget-metrics">
                <div className="metric-row">
                    <span className="metric-label">Total Est.</span>
                    <span className="metric-value font-bold">
                        {currency} {estimated.toLocaleString()}
                    </span>
                </div>
                <div className="metric-row">
                    <span className="metric-label">Target Budget</span>
                    <span className="metric-value">
                        {currency} {baseline.toLocaleString()}
                    </span>
                </div>
                <div className="metric-row">
                    <span className="metric-label">Remaining</span>
                    <span className="metric-value remaining-text">
                        {currency} {remaining.toLocaleString()}
                    </span>
                </div>
            </div>

            <hr className="widget-divider" />

            {/* Quick Action Buttons */}
            <div className="quick-actions-list">
                <button
                    type="button"
                    className="quick-action-btn"
                    onClick={() => navigate(`/trips/${tripId}/budget`)}
                >
                    <PieChart size={16} />
                    <span>Cost Breakdown</span>
                    <ArrowUpRight size={14} className="arrow-icon" />
                </button>
                <button
                    type="button"
                    className="quick-action-btn"
                    onClick={() => navigate(`/trips/${tripId}/timeline`)}
                >
                    <FileText size={16} />
                    <span>View Timeline</span>
                    <ArrowUpRight size={14} className="arrow-icon" />
                </button>
                <button
                    type="button"
                    className="quick-action-btn share-action"
                    onClick={onOpenShare}
                >
                    <Share2 size={16} />
                    <span>Share Public Link</span>
                    <ArrowUpRight size={14} className="arrow-icon" />
                </button>
            </div>
        </div>
    );
}

export default BudgetOverviewWidget;
