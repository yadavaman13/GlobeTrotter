import {
    Trash2 as TrashIcon,
    RotateCcw as ResetIcon,
    Eraser as EraserIcon,
    AlertTriangle as WarningIcon,
} from 'lucide-react';
import './ClearAllButton.scss';

/**
 * Shared Reusable ClearAllButton Component
 * Supports soft background color variants (danger, warning, neutral, info),
 * appropriate icons, rounded pill/card shapes, and smooth hover micro-animations.
 */
function ClearAllButton({
    label = 'Clear All',
    variant = 'neutral', // 'danger' | 'warning' | 'neutral' | 'info'
    size = 'md', // 'sm' | 'md' | 'lg'
    icon = null,
    onClick,
    disabled = false,
    count = null,
    className = '',
    type = 'button',
}) {
    // Determine default icon based on variant if no custom icon provided
    const renderIcon = () => {
        if (icon !== null) return icon;

        switch (variant) {
            case 'danger':
                return <TrashIcon className="clear-btn-icon" />;
            case 'warning':
                return <WarningIcon className="clear-btn-icon" />;
            case 'info':
                return <ResetIcon className="clear-btn-icon" />;
            case 'neutral':
            default:
                return <EraserIcon className="clear-btn-icon" />;
        }
    };

    const rootClasses = [
        'shared-clear-all-btn',
        `variant-${variant}`,
        `size-${size}`,
        disabled ? 'is-disabled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={rootClasses}>
            {renderIcon()}
            <span className="clear-btn-label">{label}</span>
            {typeof count === 'number' && <span className="clear-btn-count">{count}</span>}
        </button>
    );
}

export default ClearAllButton;
