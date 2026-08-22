import { useMemo } from 'react';
import { Plane, Hotel, Compass, Utensils } from 'lucide-react';
import './ExpenseCategoryChart.scss';

const CATEGORY_META = {
    transport: { label: 'Transport & Travel', icon: Plane, color: '#3b82f6' },
    stay: { label: 'Hotels & Stays', icon: Hotel, color: '#8b5cf6' },
    activity: { label: 'Tours & Activities', icon: Compass, color: '#10b981' },
    meal: { label: 'Dining & Meals', icon: Utensils, color: '#f59e0b' },
};

export function ExpenseCategoryChart({ expensesByCategory = [], totalExpenses = 0 }) {
    const categoriesData = useMemo(() => {
        const total = totalExpenses || expensesByCategory.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

        return ['transport', 'stay', 'activity', 'meal'].map((catKey) => {
            const found = expensesByCategory.find((e) => e.category === catKey);
            const amount = found ? Number(found.totalAmount || 0) : 0;
            const itemCount = found ? Number(found.itemCount || 0) : 0;
            const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;

            const meta = CATEGORY_META[catKey];

            return {
                key: catKey,
                label: meta.label,
                Icon: meta.icon,
                color: meta.color,
                amount,
                itemCount,
                percentage,
            };
        });
    }, [expensesByCategory, totalExpenses]);

    return (
        <div className="expense-category-chart-card">
            <div className="card-header">
                <div>
                    <h3 className="chart-title">Budget Allocation by Category</h3>
                    <span className="chart-caption">Expense breakdown across travel logistics</span>
                </div>
            </div>

            <div className="category-progress-bars">
                {categoriesData.map((cat) => {
                    const formattedAmount = new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                    }).format(cat.amount);

                    const IconComp = cat.Icon;

                    return (
                        <div key={cat.key} className="category-item-row">
                            <div className="category-header">
                                <div className="category-title-icon">
                                    <div
                                        className="cat-icon-badge"
                                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                    >
                                        <IconComp size={16} />
                                    </div>
                                    <span className="category-label">{cat.label}</span>
                                </div>

                                <div className="category-amounts">
                                    <span className="amount-val">{formattedAmount}</span>
                                    <span className="percentage-val">{cat.percentage}%</span>
                                </div>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.max(2, cat.percentage)}%`,
                                        backgroundColor: cat.color,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ExpenseCategoryChart;
