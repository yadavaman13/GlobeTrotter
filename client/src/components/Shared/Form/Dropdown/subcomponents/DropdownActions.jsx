import { ChevronDown as ChevronDownIcon, X as CloseIcon } from 'lucide-react';

/**
 * Dropdown Actions Micro-Subcomponent
 * Renders clear action button and chevron indicator icon.
 */
function DropdownActions({ clearable, selectedOption, disabled, onClear }) {
    return (
        <div className="shared-dropdown-actions">
            {clearable && selectedOption && !disabled && (
                <button
                    type="button"
                    className="shared-dropdown-clear-btn"
                    onClick={onClear}
                    aria-label="Clear selection"
                >
                    <CloseIcon size={12} />
                </button>
            )}
            <ChevronDownIcon size={16} className="shared-dropdown-chevron" />
        </div>
    );
}

export default DropdownActions;
