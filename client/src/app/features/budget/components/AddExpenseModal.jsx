import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export function AddExpenseModal({ isOpen, onClose, onAddExpense, currency = 'USD' }) {
    const [category, setCategory] = useState('stay');
    const [amount, setAmount] = useState('');
    const [costDate, setCostDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        onAddExpense({
            category,
            amount: parseFloat(amount),
            currency,
            costDate,
            description,
        });

        // Reset
        setAmount('');
        setDescription('');
        onClose();
    };

    return (
        <div className="modal-backdrop-scrim" onClick={onClose}>
            <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-dialog-header">
                    <h3 className="modal-dialog-title">Log Trip Expense</h3>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-dialog-body">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="field-label">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="stay">Stay & Lodging</option>
                                <option value="transport">Transport & Flights</option>
                                <option value="activity">Activities & Tours</option>
                                <option value="meal">Food & Dining</option>
                                <option value="other">Other / Incidental</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="field-label">Amount ({currency})</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="field-label">Expense Date</label>
                        <input
                            type="date"
                            value={costDate}
                            onChange={(e) => setCostDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="field-label">Description / Merchant</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Shinkansen bullet train ticket, Ryokan reservation"
                        />
                    </div>

                    <div className="modal-dialog-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!amount || parseFloat(amount) <= 0}
                        >
                            <Plus size={16} /> Save Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddExpenseModal;
