import { Check as CheckIcon } from 'lucide-react';

/**
 * Dropdown Option Item Subcomponent
 * Renders individual list item option with custom render support, icon, label, description, and selected checkmark.
 */
function DropdownOptionItem({ option, isSelected, isFocused, renderOption, onOptionClick }) {
    if (renderOption) {
        return (
            <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => onOptionClick(option)}
                className={`shared-dropdown-item ${isSelected ? 'is-selected' : ''} ${isFocused ? 'is-focused' : ''} ${option.disabled ? 'is-disabled' : ''}`}
            >
                {renderOption(option.original, isSelected, isFocused)}
            </li>
        );
    }

    return (
        <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-disabled={option.disabled}
            disabled={option.disabled}
            onClick={() => onOptionClick(option)}
            className={`shared-dropdown-item ${isSelected ? 'is-selected' : ''} ${isFocused ? 'is-focused' : ''} ${option.disabled ? 'is-disabled' : ''}`}
            tabIndex={-1}
        >
            {option.icon && <option.icon className="shared-dropdown-item-icon" />}
            <div className="shared-dropdown-item-label-group">
                <span className="shared-dropdown-item-label">{option.label}</span>
                {option.description && (
                    <span className="shared-dropdown-item-description">{option.description}</span>
                )}
            </div>
            {isSelected && <CheckIcon size={16} className="shared-dropdown-item-checkmark" />}
        </button>
    );
}

export default DropdownOptionItem;
