import { useRef } from 'react';
import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';

/**
 * Single Accordion Item Component
 * Supports leading icons, subtitles, badges using shared <Badge>, extra actions, and accessibility attributes.
 */
function AccordionItem({
    id,
    title,
    subtitle,
    icon,
    badge,
    badgeVariant = 'info',
    badgeType = 'light',
    disabled = false,
    isExpanded = false,
    onToggle,
    extraActions,
    children,
    className = '',
}) {
    const contentRef = useRef(null);

    const handleHeaderClick = (e) => {
        if (disabled) return;
        onToggle && onToggle(id, e);
    };

    const handleKeyDown = (e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle && onToggle(id, e);
        }
    };

    return (
        <div
            className={`shared-accordion-item ${isExpanded ? 'is-expanded' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
        >
            {/* Accordion Header Trigger */}
            <div
                className="accordion-header"
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-expanded={isExpanded}
                aria-disabled={disabled}
                onClick={handleHeaderClick}
                onKeyDown={handleKeyDown}
            >
                <div className="header-left">
                    {icon && <span className="header-icon">{icon}</span>}
                    <div className="header-text-group">
                        <span className="header-title">{title}</span>
                        {subtitle && <span className="header-subtitle">{subtitle}</span>}
                    </div>
                </div>

                <div className="header-right">
                    {/* Shared Badge Component for Tagging */}
                    {badge && (
                        <Badge variant={badgeVariant} type={badgeType}>
                            {badge}
                        </Badge>
                    )}

                    {/* Optional Header Right Actions */}
                    {extraActions && (
                        <div className="header-extra-actions" onClick={(e) => e.stopPropagation()}>
                            {extraActions}
                        </div>
                    )}

                    {/* Animated Expand Indicator Arrow */}
                    <span className="accordion-chevron">
                        <ChevronDownIcon size={16} strokeWidth={2} />
                    </span>
                </div>
            </div>

            {/* Accordion Expandable Content Body */}
            <div className="accordion-content-wrapper" aria-hidden={!isExpanded}>
                <div className="accordion-content-body" ref={contentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AccordionItem;
