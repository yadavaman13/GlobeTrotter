/**
 * Dropdown Selected Display Micro-Subcomponent
 * Renders selected option title, leading icon, or placeholder text.
 */
function DropdownSelectedDisplay({ selectedOption, placeholder }) {
    return (
        <div className="shared-dropdown-selected">
            {selectedOption ? (
                <>
                    {selectedOption.icon && (
                        <selectedOption.icon className="shared-dropdown-selected-icon" />
                    )}
                    <span className="shared-dropdown-selected-title">{selectedOption.label}</span>
                </>
            ) : (
                <span className="shared-dropdown-placeholder">{placeholder}</span>
            )}
        </div>
    );
}

export default DropdownSelectedDisplay;
