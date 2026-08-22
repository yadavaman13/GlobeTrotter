import { AnalyticsProvider, useAnalyticsContext } from '../context/AnalyticsContext';
import Button from '@/components/Shared/Buttons/Button/Button';
import { FileText, Download, CheckCircle, Database } from 'lucide-react';
import './ReportsPage.scss';

function ReportsContent() {
    const { analytics, loading, exportReport } = useAnalyticsContext();

    const reportSummaries = [
        {
            title: 'Platform Summary & KPIs',
            description:
                'Overview of all active users, trip statuses, budgets, and destination catalogs.',
            recordsCount: `${analytics?.users?.total ?? 0} Users, ${analytics?.trips?.total ?? 0} Trips`,
            type: 'csv',
        },
        {
            title: 'Travel Financial Ledger',
            description:
                'Itemized expense distribution categorized by Transport, Stay, Activity, and Meals.',
            recordsCount: `${analytics?.financials?.expensesByCategory?.length ?? 0} Categories`,
            type: 'csv',
        },
        {
            title: 'Full Raw Telemetry Export',
            description: 'Complete uncompressed JSON payload of all live database KPI aggregates.',
            recordsCount: 'Complete Platform JSON',
            type: 'json',
        },
    ];

    return (
        <div className="analytics-reports-page">
            <div className="reports-header">
                <div className="header-titles">
                    <div className="title-row">
                        <FileText className="header-icon" size={24} />
                        <h1 className="header-main-title">Reports & Data Exports</h1>
                    </div>
                    <p className="header-subtitle">
                        Generate and download audit reports, travel financial summaries, and
                        platform metrics.
                    </p>
                </div>
            </div>

            <div className="reports-list-grid">
                {reportSummaries.map((rep, idx) => (
                    <div key={idx} className="report-export-card">
                        <div className="card-top">
                            <div className="doc-icon-wrapper">
                                <Database size={20} />
                            </div>
                            <div className="report-info">
                                <h3 className="report-name">{rep.title}</h3>
                                <p className="report-desc">{rep.description}</p>
                            </div>
                        </div>

                        <div className="card-bottom">
                            <span className="record-count-badge">
                                <CheckCircle size={13} /> {rep.recordsCount}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportReport(rep.type)}
                                disabled={loading}
                                className="download-btn"
                            >
                                <Download size={14} /> Export {rep.type.toUpperCase()}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ReportsPage() {
    return (
        <AnalyticsProvider>
            <ReportsContent />
        </AnalyticsProvider>
    );
}

export default ReportsPage;
