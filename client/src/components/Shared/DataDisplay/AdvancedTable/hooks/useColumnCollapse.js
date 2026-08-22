import { useState, useMemo, useCallback, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

/**
 * Custom hook to manage column expand & collapse in AdvancedTable
 */
export function useColumnCollapse({
    effectiveColumns = [],
    defaultCollapsedColumns = [],
    controlledCollapsedColumns = null,
    onColumnCollapseChange,
}) {
    const [columnToggleOpen, setColumnToggleOpen] = useState(false);
    const [columnSearchTerm, setColumnSearchTerm] = useState('');
    const columnToggleRef = useRef(null);
    const columnToggleBtnRef = useRef(null);

    // Internal state of collapsed column keys
    const [collapsedKeys, setCollapsedKeys] = useState(() => {
        if (Array.isArray(defaultCollapsedColumns) && defaultCollapsedColumns.length > 0) {
            return new Set(defaultCollapsedColumns);
        }
        return new Set();
    });

    // Synchronize when controlledCollapsedColumns is provided
    const effectiveCollapsedKeys = useMemo(() => {
        if (Array.isArray(controlledCollapsedColumns)) {
            return new Set(controlledCollapsedColumns);
        }
        return collapsedKeys;
    }, [controlledCollapsedColumns, collapsedKeys]);

    const notifyChange = useCallback(
        (newCollapsedSet) => {
            if (onColumnCollapseChange) {
                const collapsedArr = Array.from(newCollapsedSet);
                const expandedArr = effectiveColumns
                    .map((c) => c.key)
                    .filter((k) => !newCollapsedSet.has(k));
                onColumnCollapseChange(collapsedArr, expandedArr);
            }
        },
        [effectiveColumns, onColumnCollapseChange],
    );

    // Toggle collapse state for a column
    const toggleCollapse = useCallback(
        (colKey) => {
            const targetCol = effectiveColumns.find((c) => c.key === colKey);
            if (
                targetCol &&
                (targetCol.collapsible === false ||
                    targetCol.hidable === false ||
                    targetCol.hideable === false)
            ) {
                return; // Non-collapsible column
            }

            setCollapsedKeys((prev) => {
                const next = new Set(prev);
                if (next.has(colKey)) {
                    next.delete(colKey);
                } else {
                    next.add(colKey);
                }
                notifyChange(next);
                return next;
            });
        },
        [effectiveColumns, notifyChange],
    );

    // Expand all columns
    const expandAllColumns = useCallback(() => {
        const next = new Set();
        setCollapsedKeys(next);
        notifyChange(next);
    }, [notifyChange]);

    // Reset to default collapsed columns
    const resetColumns = useCallback(() => {
        const next = new Set(Array.isArray(defaultCollapsedColumns) ? defaultCollapsedColumns : []);
        setCollapsedKeys(next);
        notifyChange(next);
    }, [defaultCollapsedColumns, notifyChange]);

    // Click outside to close column popover
    useClickOutside([columnToggleRef, columnToggleBtnRef], () => setColumnToggleOpen(false), {
        enabled: columnToggleOpen,
    });

    return {
        collapsedKeys: effectiveCollapsedKeys,
        columnToggleOpen,
        setColumnToggleOpen,
        columnSearchTerm,
        setColumnSearchTerm,
        columnToggleRef,
        columnToggleBtnRef,
        toggleCollapse,
        expandAllColumns,
        resetColumns,
    };
}
