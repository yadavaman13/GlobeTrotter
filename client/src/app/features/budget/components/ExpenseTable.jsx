import { Trash2 } from 'lucide-react';

export function ExpenseTable({ costs = [], currency = 'USD', onDeleteCost }) {
    const getCategoryBadgeClass = (category) => {
        const cat = category?.toLowerCase();
        switch (cat) {
            case 'stay':
            case 'accommodation':
                return 'badge-stay';
            case 'transport':
                return 'badge-transport';
            case 'activity':
            case 'activities':
                return 'badge-activity';
            case 'meal':
            case 'food':
                return 'badge-food';
            default:
                return 'badge-other';
        }
    };

    const getCategoryLabel = (category) => {
        const cat = category?.toLowerCase();
        switch (cat) {
            case 'stay':
            case 'accommodation':
                return 'Stay';
            case 'transport':
                return 'Transport';
            case 'activity':
            case 'activities':
                return 'Activity';
            case 'meal':
            case 'food':
                return 'Food & Dining';
            default:
                return 'Other';
        }
    };

    return (
        <div className="expense-table-container">
            {costs.length === 0 ? (
                <div className="empty-expenses-state">
                    <p>No manual expenses logged yet.</p>
                </div>
            ) : (
                <div className="table-responsive-wrapper">
                    <table className="expenses-data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th className="text-right">Amount</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {costs.map((item) => (
                                <tr key={item.id}>
                                    <td className="expense-date">
                                        {item.costDate || 'Unscheduled'}
                                    </td>
                                    <td>
                                        <span
                                            className={`category-chip ${getCategoryBadgeClass(
                                                item.category,
                                            )}`}
                                        >
                                            {getCategoryLabel(item.category)}
                                        </span>
                                    </td>
                                    <td className="expense-desc">
                                        {item.description || 'General Expense'}
                                    </td>
                                    <td className="expense-amount text-right">
                                        {item.currency || currency}{' '}
                                        {parseFloat(item.amount || '0').toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="delete-row-btn"
                                            onClick={() => onDeleteCost(item.id)}
                                            title="Delete Expense"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ExpenseTable;
