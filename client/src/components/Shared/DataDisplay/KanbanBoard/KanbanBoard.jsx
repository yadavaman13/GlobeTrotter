import { useState, useEffect, useRef, useMemo } from 'react';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
import {
    Plus as PlusIcon,
    MoreHorizontal as MoreIcon,
    RotateCw as RefreshIcon,
    MessageSquare as CommentIcon,
    Users as UserIcon,
    ChevronUp as ScrollTopIcon,
    ChevronsLeftRight as CollapseIcon,
} from 'lucide-react';
import './KanbanBoard.scss';

// Default sample avatar images
const DEFAULT_AVATARS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
];

function ProgressBar({ percent = 0, variant = 'primary' }) {
    const variantColors = {
        primary: 'var(--color-primary, #6366f1)',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
    };
    return (
        <div className="shared-progressbar-container" style={{ width: '100%' }}>
            <div
                className="progressbar-track"
                style={{
                    width: '100%',
                    height: 6,
                    backgroundColor: '#f1f5f9',
                    borderRadius: 999,
                    overflow: 'hidden',
                }}
            >
                <div
                    className="progressbar-fill"
                    style={{
                        width: `${Math.min(Math.max(percent, 0), 100)}%`,
                        height: '100%',
                        backgroundColor: variantColors[variant] || variantColors.primary,
                        borderRadius: 999,
                        transition: 'width 0.3s ease',
                    }}
                />
            </div>
        </div>
    );
}

function KanbanCard({ item, onCardClick, onActionClick, onDragStart, onDragEnd }) {
    const {
        title,
        subtitle,
        badge,
        avatar,
        fields = [],
        description,
        updatedText,
        progress,
        commentsCount,
        subtasksCount,
        assignees = [],
        tags = [],
        progressVariant = null,
        showActions = true,
    } = item;

    const getVariant = (val) => {
        if (progressVariant) return progressVariant;
        if (val >= 80) return 'success';
        if (val >= 35) return 'warning';
        return 'primary';
    };

    const badgeObj =
        typeof badge === 'string' ? { label: badge, bg: '#ecfdf5', color: '#059669' } : badge;

    return (
        <div
            className="kanban-card"
            draggable
            onDragStart={(e) => onDragStart && onDragStart(e, item)}
            onDragEnd={(e) => onDragEnd && onDragEnd(e, item)}
            onClick={() => onCardClick && onCardClick(item)}
        >
            {/* Optional Header for Task style with timestamp & actions */}
            {updatedText && (
                <div className="kanban-card-header">
                    <span className="kanban-card-updated">{updatedText}</span>
                    {showActions && (
                        <div className="kanban-card-actions">
                            <button
                                type="button"
                                className="kanban-card-action-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onActionClick) onActionClick('refresh', item);
                                }}
                                title="Refresh item"
                            >
                                <RefreshIcon size={13} />
                            </button>
                            <button
                                type="button"
                                className="kanban-card-action-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onActionClick) onActionClick('more', item);
                                }}
                                title="More options"
                            >
                                <MoreIcon size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Top Title & Avatar Row */}
            <div className="kanban-card-top-group">
                <div className="kanban-card-title-block">
                    <h4 className="kanban-card-title">{title}</h4>
                    {subtitle && <p className="kanban-card-subtitle">{subtitle}</p>}
                    {badgeObj && (
                        <span
                            className="kanban-card-pill-badge"
                            style={{
                                backgroundColor: badgeObj.bg || '#ecfdf5',
                                color: badgeObj.color || '#059669',
                            }}
                        >
                            {badgeObj.label}
                        </span>
                    )}
                </div>

                {avatar && (
                    <div className="kanban-card-avatar-top">
                        <CircularAvatar
                            src={typeof avatar === 'string' ? avatar : avatar.src}
                            size={36}
                            name={title}
                        />
                    </div>
                )}
            </div>

            {description && <p className="kanban-card-description">{description}</p>}

            {/* Key-Value Fields List (e.g. Role: UI Designer, Location: NY, New York) */}
            {fields && fields.length > 0 && (
                <div className="kanban-card-fields-list">
                    {fields.map((f, idx) => (
                        <div key={idx} className="kanban-card-field-row">
                            <span className="field-label">{f.label}</span>
                            <span className="field-value">{f.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Card Tags */}
            {tags && tags.length > 0 && (
                <div className="kanban-card-tags">
                    {tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="kanban-card-tag"
                            style={{
                                backgroundColor:
                                    typeof tag === 'object' ? tag.bg || '#f1f5f9' : '#f1f5f9',
                                color: typeof tag === 'object' ? tag.color || '#475569' : '#475569',
                            }}
                        >
                            {typeof tag === 'object' ? tag.label : tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Card Progress Bar */}
            {typeof progress === 'number' && (
                <div className="kanban-card-progress-container">
                    <div className="kanban-card-progress-header">
                        <span className="progress-label">PROGRESS</span>
                        <span className="progress-value">{progress}%</span>
                    </div>
                    <div className="kanban-card-progress-bar-wrapper">
                        <ProgressBar
                            percent={progress}
                            variant={getVariant(progress)}
                            showValue={false}
                            size="small"
                        />
                    </div>
                </div>
            )}

            {/* Footer Metrics & Assignee Stack */}
            {(commentsCount > 0 || subtasksCount > 0 || (assignees && assignees.length > 0)) && (
                <div className="kanban-card-footer">
                    <div className="kanban-card-metrics">
                        {commentsCount > 0 && (
                            <span
                                className="kanban-card-metric-item"
                                title={`${commentsCount} comments`}
                            >
                                <CommentIcon size={14} />
                                <span>{commentsCount}</span>
                            </span>
                        )}
                        {subtasksCount > 0 && (
                            <span
                                className="kanban-card-metric-item"
                                title={`${subtasksCount} subtasks`}
                            >
                                <UserIcon size={14} />
                                <span>{subtasksCount}</span>
                            </span>
                        )}
                    </div>

                    {assignees && assignees.length > 0 && (
                        <div className="kanban-card-avatar-stack">
                            {assignees.slice(0, 3).map((assignee, idx) => {
                                const src =
                                    typeof assignee === 'string'
                                        ? assignee
                                        : assignee.avatar ||
                                          DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
                                const name =
                                    typeof assignee === 'string'
                                        ? `User ${idx + 1}`
                                        : assignee.name || 'Team member';
                                return (
                                    <div
                                        key={idx}
                                        className="kanban-avatar-wrapper"
                                        style={{ zIndex: assignees.length - idx }}
                                        title={name}
                                    >
                                        <CircularAvatar src={src} size={24} name={name} />
                                    </div>
                                );
                            })}
                            {assignees.length > 3 && (
                                <div className="kanban-avatar-more" style={{ zIndex: 0 }}>
                                    +{assignees.length - 3}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function KanbanColumn({
    column,
    items = [],
    onCardClick,
    onCardAction,
    onAddItem,
    onDropCard,
    draggedItem,
    onCardDragStart,
    onCardDragEnd,
    batchSize = 25,
}) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isQuickAdding, setIsQuickAdding] = useState(false);
    const [quickTitle, setQuickTitle] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const dragCounterRef = useRef(0);
    const cardsListRef = useRef(null);
    const quickInputRef = useRef(null);
    const [renderLimit, setRenderLimit] = useState(batchSize);

    const isFromDifferentColumn = draggedItem && draggedItem.columnId !== column.id;
    const showSkeleton = isDragOver && isFromDifferentColumn;

    useEffect(() => {
        setRenderLimit(batchSize);
    }, [items.length, batchSize]);

    useEffect(() => {
        if (isQuickAdding && quickInputRef.current) {
            quickInputRef.current.focus();
        }
    }, [isQuickAdding]);

    const handleColumnScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        setShowScrollTop(scrollTop > 100);
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            if (renderLimit < items.length) {
                setRenderLimit((prev) => Math.min(prev + batchSize, items.length));
            }
        }
    };

    const scrollToTop = () => {
        if (cardsListRef.current) {
            cardsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmitQuickAdd = (e) => {
        e.preventDefault();
        if (!quickTitle.trim()) return;
        if (onAddItem) {
            onAddItem(column.id, quickTitle.trim());
        }
        setQuickTitle('');
        setIsQuickAdding(false);
    };

    const visibleItems = useMemo(() => {
        return items.slice(0, renderLimit);
    }, [items, renderLimit]);

    const countBadgeText = useMemo(() => {
        const total = column.count !== undefined ? column.count : items.length;
        if (total >= 10000) return `${(total / 1000).toFixed(0)}k+`;
        if (total >= 1000) return total.toLocaleString();
        return total;
    }, [column.count, items.length]);

    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounterRef.current += 1;
        if (dragCounterRef.current > 0) {
            setIsDragOver(true);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isDragOver) setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0;
            setIsDragOver(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dragCounterRef.current = 0;
        setIsDragOver(false);
        const cardDataStr = e.dataTransfer.getData('text/plain');
        if (cardDataStr) {
            try {
                const cardItem = JSON.parse(cardDataStr);
                if (onDropCard) {
                    onDropCard(cardItem, column.id);
                }
            } catch (err) {
                console.error('Failed to parse drag item:', err);
            }
        }
    };

    const handleDragStart = (e, cardItem) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(cardItem));
        if (onCardDragStart) {
            onCardDragStart(cardItem);
        }
    };

    if (isCollapsed) {
        return (
            <div
                className="kanban-column is-collapsed"
                onClick={() => setIsCollapsed(false)}
                title="Click to expand column"
            >
                <div className="kanban-column-collapsed-inner">
                    <span
                        className="kanban-column-dot"
                        style={{ backgroundColor: column.color || '#94a3b8' }}
                    />
                    <span className="kanban-column-count">{countBadgeText}</span>
                    <span className="kanban-column-collapsed-title">{column.title}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`kanban-column ${isDragOver ? 'is-drag-over' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className="kanban-column-header">
                <div className="kanban-column-title-group">
                    <span
                        className="kanban-column-dot"
                        style={{ backgroundColor: column.color || '#94a3b8' }}
                    />
                    <h3 className="kanban-column-title">{column.title}</h3>
                    <span className="kanban-column-count">{countBadgeText}</span>
                </div>

                <div className="kanban-column-header-actions">
                    {showScrollTop && (
                        <Tooltip content="Scroll to top" position="bottom">
                            <button
                                type="button"
                                className="kanban-column-scroll-top-btn"
                                onClick={scrollToTop}
                                aria-label="Scroll column to top"
                            >
                                <ScrollTopIcon size={14} />
                            </button>
                        </Tooltip>
                    )}

                    <Tooltip
                        content={isQuickAdding ? 'Close quick add' : 'Add item to stage'}
                        position="bottom"
                    >
                        <button
                            type="button"
                            className="kanban-column-add-btn"
                            onClick={() => setIsQuickAdding(!isQuickAdding)}
                        >
                            <PlusIcon size={16} />
                        </button>
                    </Tooltip>

                    <Tooltip content="Collapse column" position="bottom">
                        <button
                            type="button"
                            className="kanban-column-collapse-btn"
                            onClick={() => setIsCollapsed(true)}
                        >
                            <CollapseIcon size={14} />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Column List of Cards with Lazy Virtualization & Quick Add Box */}
            <div
                className="kanban-column-cards-list"
                ref={cardsListRef}
                onScroll={handleColumnScroll}
            >
                {isQuickAdding && (
                    <form className="kanban-column-quick-add-form" onSubmit={handleSubmitQuickAdd}>
                        <input
                            ref={quickInputRef}
                            type="text"
                            className="kanban-quick-add-input"
                            placeholder={`Add card to ${column.title}...`}
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setIsQuickAdding(false);
                            }}
                        />
                        <div className="kanban-quick-add-actions">
                            <button
                                type="submit"
                                className="quick-add-save-btn"
                                disabled={!quickTitle.trim()}
                            >
                                Add Card
                            </button>
                            <button
                                type="button"
                                className="quick-add-cancel-btn"
                                onClick={() => setIsQuickAdding(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {items.length === 0 && !showSkeleton && !isQuickAdding ? (
                    <div className="kanban-column-empty">
                        <span>No tasks in this stage</span>
                    </div>
                ) : (
                    <>
                        {visibleItems.map((item) => (
                            <KanbanCard
                                key={item.id}
                                item={item}
                                onCardClick={onCardClick}
                                onActionClick={onCardAction}
                                onDragStart={handleDragStart}
                                onDragEnd={onCardDragEnd}
                            />
                        ))}
                        {showSkeleton && (
                            <div className="kanban-card-skeleton-placeholder">
                                <div className="skeleton-line skeleton-title" />
                                <div className="skeleton-line skeleton-subtitle" />
                            </div>
                        )}
                        {renderLimit < items.length && !showSkeleton && (
                            <div className="kanban-column-loading-more">
                                <span>
                                    Loading more ({items.length - renderLimit} remaining)...
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function KanbanBoard({
    columns = [],
    items = [],
    onItemMove,
    onItemClick,
    onItemAction,
    onAddItem,
    onAddColumn,
    searchable = true,
    searchPlaceholder = 'Search tasks...',
    headerTitle = '',
    headerSubtitle = '',
    headerActions = null,
    className = '',
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [localItems, setLocalItems] = useState(items);
    const [draggedItem, setDraggedItem] = useState(null);

    // Sync with prop updates
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return localItems;
        const q = searchQuery.toLowerCase().trim();
        return localItems.filter(
            (item) =>
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.description && item.description.toLowerCase().includes(q)),
        );
    }, [localItems, searchQuery]);

    const handleDropCard = (cardItem, targetColumnId) => {
        setDraggedItem(null);
        if (cardItem.columnId === targetColumnId) return;

        // Update local state smoothly
        const updated = localItems.map((item) => {
            if (item.id === cardItem.id) {
                return { ...item, columnId: targetColumnId };
            }
            return item;
        });
        setLocalItems(updated);

        if (onItemMove) {
            onItemMove(cardItem, cardItem.columnId, targetColumnId);
        }
    };

    return (
        <div className={`shared-kanban-board-component ${className}`}>
            {/* Optional Board Header Controls */}
            {(headerTitle || searchable || headerActions) && (
                <div className="kanban-board-header">
                    <div className="kanban-board-header-left">
                        {headerTitle && (
                            <div className="kanban-board-title-group">
                                <h2 className="kanban-board-title">{headerTitle}</h2>
                                {headerSubtitle && (
                                    <p className="kanban-board-subtitle">{headerSubtitle}</p>
                                )}
                            </div>
                        )}
                        {searchable && (
                            <div className="kanban-board-search">
                                <SearchBar
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    showFilter={false}
                                    showHistory={false}
                                />
                            </div>
                        )}
                    </div>

                    <div className="kanban-board-header-right">
                        {headerActions}
                        {onAddColumn && (
                            <button
                                type="button"
                                className="kanban-board-add-col-btn"
                                onClick={onAddColumn}
                            >
                                <PlusIcon size={16} />
                                <span>Add Column</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Kanban Columns Canvas */}
            <div className="kanban-board-canvas">
                {columns.map((column) => {
                    const colItems = filteredItems.filter((item) => item.columnId === column.id);
                    return (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            items={colItems}
                            onCardClick={onItemClick}
                            onCardAction={onItemAction}
                            onAddItem={onAddItem}
                            onDropCard={handleDropCard}
                            draggedItem={draggedItem}
                            onCardDragStart={(item) => setDraggedItem(item)}
                            onCardDragEnd={() => setDraggedItem(null)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default KanbanBoard;
