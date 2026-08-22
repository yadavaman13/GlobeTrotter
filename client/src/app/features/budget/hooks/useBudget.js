import { useState, useCallback, useEffect } from 'react';
import * as budgetApi from '../services/budget.api';

export function useBudget(tripId) {
    const [budget, setBudget] = useState(null);
    const [costs, setCosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshBudget = useCallback(async () => {
        if (!tripId) return;
        setLoading(true);
        setError(null);
        try {
            const [budgetRes, costsRes] = await Promise.all([
                budgetApi.getBudgetSummary(tripId),
                budgetApi.listCosts(tripId),
            ]);

            if (budgetRes?.success && budgetRes.budget) {
                setBudget(budgetRes.budget);
            }
            if (costsRes?.success && costsRes.costs) {
                setCosts(costsRes.costs);
            }
        } catch (err) {
            console.error('useBudget refresh error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load budget');
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        if (tripId) {
            refreshBudget();
        }
    }, [tripId, refreshBudget]);

    const handleAddCost = useCallback(
        async (costData) => {
            if (!tripId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await budgetApi.createCost(tripId, costData);
                if (res?.success) {
                    await refreshBudget();
                    return res.cost;
                }
                throw new Error(res?.message || 'Failed to add expense');
            } catch (err) {
                console.error('handleAddCost error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to add expense');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [tripId, refreshBudget],
    );

    const handleUpdateCost = useCallback(
        async (costId, updates) => {
            if (!tripId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await budgetApi.updateCost(tripId, costId, updates);
                if (res?.success) {
                    await refreshBudget();
                    return res.cost;
                }
                throw new Error(res?.message || 'Failed to update expense');
            } catch (err) {
                console.error('handleUpdateCost error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to update expense');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [tripId, refreshBudget],
    );

    const handleDeleteCost = useCallback(
        async (costId) => {
            if (!tripId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await budgetApi.deleteCost(tripId, costId);
                if (res?.success) {
                    await refreshBudget();
                    return true;
                }
                throw new Error(res?.message || 'Failed to delete expense');
            } catch (err) {
                console.error('handleDeleteCost error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to delete expense');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [tripId, refreshBudget],
    );

    return {
        budget,
        costs,
        loading,
        error,
        refreshBudget,
        handleAddCost,
        handleUpdateCost,
        handleDeleteCost,
    };
}

export default useBudget;
