import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
    ChevronRight,
    Wallet,
    TrendingUp,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Calendar,
    MapPin,
    PieChart,
} from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useItinerary } from '../../itinerary/hooks/useItinerary';
import { useToast } from '@/components/Shared/Feedback/Toast';
import CategoryCostChart from '../components/CategoryCostChart';
import DailySpendChart from '../components/DailySpendChart';
import ExpenseTable from '../components/ExpenseTable';
import AddExpenseModal from '../components/AddExpenseModal';
import '../styles/budget-analytics-page.scss';

export function BudgetAnalyticsPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { budget, costs, loading, handleAddCost, handleDeleteCost } = useBudget(tripId);
    const { trip } = useItinerary();

    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

    const handleAddExpenseSubmit = async (costData) => {
        try {
            await handleAddCost(costData);
            toast({ type: 'success', message: 'Expense recorded successfully!' });
        } catch (err) {
            console.error('Failed to log expense:', err);
            toast({ type: 'error', message: err.message || 'Failed to log expense' });
        }
    };

    const handleDeleteExpenseSubmit = async (costId) => {
        try {
            await handleDeleteCost(costId);
            toast({ type: 'success', message: 'Expense deleted' });
        } catch (err) {
            console.error('Failed to delete expense:', err);
            toast({ type: 'error', message: 'Failed to delete expense' });
        }
    };

    const currency = budget?.currency || trip?.budgetCurrency || 'USD';
    const totalBudget = budget?.totalBudget || 0;
    const totalEstimated = budget?.totalEstimatedCost || 0;
    const remaining = budget?.remainingBudget || 0;
    const avgPerDay = budget?.averageCostPerDay || 0;
    const isOverBudget = budget?.isOverBudget;

    return (
        <div className="budget-analytics-container">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
                <Link to="/dashboard/user/home">Home</Link>
                <ChevronRight size={14} className="crumb-icon" />
                <Link to="/dashboard/user/trips">My Trips</Link>
                <ChevronRight size={14} className="crumb-icon" />
                <Link to={`/dashboard/user/trips/${tripId}/itinerary`}>
                    {trip?.name || 'Itinerary'}
                </Link>
                <ChevronRight size={14} className="crumb-icon" />
                <span className="current-page">Budget Analytics</span>
            </nav>

            {/* Header */}
            <div className="analytics-header-row">
                <div className="heading-group">
                    <h1 className="page-title">Budget & Cost Analytics</h1>
                    <p className="page-subtitle">
                        Real-time budget tracking, category breakdown, and over-budget projections.
                    </p>
                </div>

                <div className="header-actions">
                    <div className="view-tabs">
                        <button
                            type="button"
                            className="tab-btn"
                            onClick={() => navigate(`/dashboard/user/trips/${tripId}/itinerary`)}
                        >
                            <MapPin size={16} />
                            <span>Itinerary Builder</span>
                        </button>
                        <button
                            type="button"
                            className="tab-btn"
                            onClick={() => navigate(`/dashboard/user/trips/${tripId}/timeline`)}
                        >
                            <Calendar size={16} />
                            <span>Timeline View</span>
                        </button>
                        <button type="button" className="tab-btn active">
                            <PieChart size={16} />
                            <span>Budget</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        className="log-expense-btn"
                        onClick={() => setIsAddExpenseModalOpen(true)}
                    >
                        <Plus size={16} /> Log Expense
                    </button>
                </div>
            </div>

            {/* Over Budget Alert Warning */}
            {isOverBudget && (
                <div className="over-budget-alert-card">
                    <div className="alert-icon-wrapper">
                        <AlertTriangle size={28} />
                    </div>
                    <div className="alert-text">
                        <h3 className="alert-title">Budget Limit Exceeded!</h3>
                        <p className="alert-desc">
                            Total estimated costs ({currency} {totalEstimated.toLocaleString()})
                            exceed your baseline budget of {currency} {totalBudget.toLocaleString()}{' '}
                            by{' '}
                            <strong>
                                {currency} {(totalEstimated - totalBudget).toLocaleString()}
                            </strong>
                            .
                        </p>
                    </div>
                </div>
            )}

            {/* Metric StatCards Grid */}
            <div className="budget-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper">
                        <Wallet size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Target Budget</p>
                        <h3 className="stat-value">
                            {currency} {totalBudget.toLocaleString()}
                        </h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper purple">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Total Spend</p>
                        <h3 className="stat-value">
                            {currency} {totalEstimated.toLocaleString()}
                        </h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper green">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Remaining Balance</p>
                        <h3 className="stat-value">
                            {currency} {remaining.toLocaleString()}
                        </h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Avg. Daily Spend</p>
                        <h3 className="stat-value">
                            {currency} {avgPerDay.toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-two-column-grid">
                {/* Category Donut Chart */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3 className="chart-title">Expense Breakdown by Category</h3>
                        <p className="chart-subtitle">
                            Distribution across accommodation, transit, activities, and dining
                        </p>
                    </div>
                    <CategoryCostChart
                        categoryBreakdown={budget?.categoryBreakdown}
                        currency={currency}
                    />
                </div>

                {/* Daily Spend Bar Chart */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3 className="chart-title">Daily Expenditure Flow</h3>
                        <p className="chart-subtitle">
                            Chronological spend compared against daily budget target
                        </p>
                    </div>
                    <DailySpendChart
                        dailySpend={budget?.dailySpend}
                        dailyBudgetLimit={budget?.dailyBudgetLimit}
                        currency={currency}
                    />
                </div>
            </div>

            {/* Expenses Table */}
            <div className="expenses-table-section">
                <div className="section-header-row">
                    <h3 className="section-title">Recorded Expenses & Logs</h3>
                </div>
                <ExpenseTable
                    costs={costs}
                    currency={currency}
                    onDeleteCost={handleDeleteExpenseSubmit}
                />
            </div>

            {/* Modal */}
            <AddExpenseModal
                isOpen={isAddExpenseModalOpen}
                onClose={() => setIsAddExpenseModalOpen(false)}
                onAddExpense={handleAddExpenseSubmit}
                currency={currency}
            />
        </div>
    );
}

export default BudgetAnalyticsPage;
