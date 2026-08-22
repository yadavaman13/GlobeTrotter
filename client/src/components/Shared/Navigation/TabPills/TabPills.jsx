import './TabPills.scss';

/**
 * Shared Modular TabPills Component
 * Features clean rounded corners (pill shape) with zero borders.
 * Supports count badges, icons, size variants ('sm', 'md', 'lg'), and design variants ('subtle', 'solid', 'ghost').
 */
function TabPills({
    tabs = [],
    activeTab,
    onTabChange,
    variant = 'subtle', // 'subtle' | 'solid' | 'ghost'
    size = 'md', // 'sm' | 'md' | 'lg'
    fullWidth = false,
    className = '',
}) {
    if (!tabs || tabs.length === 0) return null;

    return (
        <div
            className={`shared-tab-pills-wrapper variant-${variant} size-${size} ${fullWidth ? 'full-width' : ''} ${className}`}
            role="tablist"
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDisabled = !!tab.disabled;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-disabled={isDisabled}
                        disabled={isDisabled}
                        className={`tab-pill-item ${isActive ? 'is-active' : ''} ${tab.unread ? 'has-unread' : ''}`}
                        onClick={() => !isDisabled && onTabChange && onTabChange(tab.id)}
                    >
                        {tab.icon && <span className="pill-icon">{tab.icon}</span>}
                        <span className="pill-label">{tab.label}</span>

                        {/* Optional numeric count or badge */}
                        {typeof tab.count === 'number' && (
                            <span
                                className={`pill-count-badge ${isActive ? 'active-count' : ''} ${tab.unread ? 'unread-count' : ''}`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default TabPills;
