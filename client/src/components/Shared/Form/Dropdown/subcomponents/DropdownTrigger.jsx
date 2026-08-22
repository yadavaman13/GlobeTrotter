import DropdownSelectedDisplay from './DropdownSelectedDisplay';
import DropdownActions from './DropdownActions';

/**
 * Dropdown Trigger Subcomponent
 * Composes DropdownSelectedDisplay and DropdownActions.
 */
function DropdownTrigger({
    selectedOption,
    placeholder,
    isOpen,
    disabled,
    clearable,
    error,
    setTriggerRef,
    onToggle,
    onClear,
}) {
    return (
        <button
            type="button"
            ref={setTriggerRef}
            className={`shared-dropdown-trigger ${isOpen ? 'is-open' : ''}`}
            disabled={disabled}
            onClick={onToggle}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-invalid={!!error}
        >
            <DropdownSelectedDisplay selectedOption={selectedOption} placeholder={placeholder} />

            <DropdownActions
                clearable={clearable}
                selectedOption={selectedOption}
                disabled={disabled}
                onClear={onClear}
            />
        </button>
    );
}

export default DropdownTrigger;
