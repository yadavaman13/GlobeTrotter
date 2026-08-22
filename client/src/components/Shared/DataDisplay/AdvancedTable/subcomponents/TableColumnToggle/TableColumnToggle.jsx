import {
    Columns3 as ColumnsIcon,
    RotateCcw as ResetIcon,
    Search as SearchIcon,
    Lock as LockIcon,
    ChevronsLeftRight as CollapseIcon,
} from 'lucide-react';
import Checkbox from '@/components/Shared/Form/Checkbox/Checkbox';
import Tooltip from '../../../Tooltip/Tooltip';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import './TableColumnToggle.scss';

function TableColumnToggle({
    effectiveColumns = [],
    collapsedKeys = new Set(),
    columnToggleOpen = false,
    setColumnToggleOpen,
    columnSearchTerm = '',
    setColumnSearchTerm,
    columnToggleRef,
    columnToggleBtnRef,
    toggleCollapse,
    expandAllColumns,
    resetColumns,
}) {
    const collapsedCount = collapsedKeys.size;
    const totalCount = effectiveColumns.length;
    const expandedCount = totalCount - collapsedCount;

    const filteredColumns = effectiveColumns.filter((col) => {
        if (!columnSearchTerm.trim()) return true;
        const term = columnSearchTerm.toLowerCase();
        return (
            (col.label && String(col.label).toLowerCase().includes(term)) ||
            (col.key && String(col.key).toLowerCase().includes(term))
        );
    });

    const hasCollapsed = collapsedCount > 0;

    return (
        <div className="at-column-toggle-wrapper">
            <Tooltip
                content={
                    hasCollapsed ? `Manage columns (${collapsedCount} collapsed)` : 'Manage columns'
                }
                position="bottom"
            >
                <button
                    ref={columnToggleBtnRef}
                    type="button"
                    className={`at-column-toggle-btn ${columnToggleOpen ? 'is-open' : ''} ${hasCollapsed ? 'has-hidden' : 'icon-only'}`}
                    onClick={() => setColumnToggleOpen((prev) => !prev)}
                    aria-label="Manage column expand and collapse"
                >
                    <ColumnsIcon size={14} />
                    {hasCollapsed && <span className="at-column-badge">{collapsedCount}</span>}
                </button>
            </Tooltip>

            {columnToggleOpen && (
                <div className="at-column-toggle-panel" ref={columnToggleRef}>
                    {/* Header */}
                    <div className="at-ct-header">
                        <div className="at-ct-title-group">
                            <span className="at-ct-title">
                                <ColumnsIcon size={14} />
                                Columns
                            </span>
                            <span className="at-ct-count-chip">
                                {expandedCount} expanded, {collapsedCount} collapsed
                            </span>
                        </div>
                        <div className="at-ct-header-actions">
                            {collapsedCount > 0 && (
                                <button
                                    type="button"
                                    className="at-ct-action-btn"
                                    onClick={expandAllColumns}
                                >
                                    Expand all
                                </button>
                            )}
                            <button
                                type="button"
                                className="at-ct-action-btn reset"
                                onClick={resetColumns}
                                title="Reset default column layout"
                            >
                                <ResetIcon size={12} />
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Search box if more than 4 columns */}
                    {totalCount > 4 && (
                        <div className="at-ct-search-box">
                            <SearchIcon size={13} className="at-ct-search-icon" />
                            <input
                                type="text"
                                className="at-ct-search-input"
                                placeholder="Filter columns..."
                                value={columnSearchTerm}
                                onChange={(e) => setColumnSearchTerm(e.target.value)}
                            />
                            {columnSearchTerm && (
                                <button
                                    type="button"
                                    className="at-ct-search-clear"
                                    onClick={() => setColumnSearchTerm('')}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}

                    {/* Column checklist */}
                    <div className="at-ct-list">
                        {filteredColumns.length > 0 ? (
                            filteredColumns.map((col) => {
                                const isCollapsed = collapsedKeys.has(col.key);
                                const isLocked =
                                    col.collapsible === false ||
                                    col.hidable === false ||
                                    col.hideable === false;

                                return (
                                    <div
                                        key={col.key}
                                        className={`at-ct-item ${isCollapsed ? 'is-hidden' : 'is-visible'} ${isLocked ? 'is-locked' : ''}`}
                                        onClick={() => !isLocked && toggleCollapse(col.key)}
                                    >
                                        <div
                                            className="at-ct-item-checkbox"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                id={`at-col-toggle-${col.key}`}
                                                checked={!isCollapsed}
                                                disabled={isLocked}
                                                onChange={() =>
                                                    !isLocked && toggleCollapse(col.key)
                                                }
                                            />
                                        </div>
                                        <label
                                            htmlFor={`at-col-toggle-${col.key}`}
                                            className="at-ct-item-label"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="at-ct-item-name">
                                                {col.label || col.key}
                                            </span>
                                        </label>
                                        <div className="at-ct-item-status">
                                            {isLocked ? (
                                                <span
                                                    className="at-ct-lock-icon"
                                                    title="Required column (cannot collapse)"
                                                >
                                                    <LockIcon size={12} />
                                                </span>
                                            ) : (
                                                <span
                                                    className={`at-ct-collapse-badge ${isCollapsed ? 'collapsed' : 'expanded'}`}
                                                >
                                                    <CollapseIcon size={12} />
                                                    {isCollapsed ? 'Collapsed' : 'Expanded'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <EmptyState variant="minimal" title="No matching columns" size="sm" />
                        )}
                    </div>

                    {/* Footer info */}
                    <div className="at-ct-footer">
                        <span className="at-ct-footer-hint">
                            {collapsedCount === 0
                                ? 'All columns expanded'
                                : `${collapsedCount} column${collapsedCount > 1 ? 's' : ''} collapsed`}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableColumnToggle;
