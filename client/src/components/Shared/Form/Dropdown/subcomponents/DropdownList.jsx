import DropdownOptionItem from './DropdownOptionItem';
import DropdownEmptyState from './DropdownEmptyState';

/**
 * Dropdown List Micro-Subcomponent
 * Renders scrollable options list or empty state.
 */
function DropdownList({
    listRef,
    maxHeight,
    filteredOptions,
    selectedValue,
    focusedIndex,
    renderOption,
    onOptionClick,
}) {
    return (
        <ul
            ref={listRef}
            className="shared-dropdown-list"
            style={{ maxHeight }}
            role="listbox"
            tabIndex={-1}
        >
            {filteredOptions.length > 0 ? (
                filteredOptions.map((option, idx) => {
                    const isSelected = selectedValue === option.value;
                    const isFocused = idx === focusedIndex;

                    return (
                        <DropdownOptionItem
                            key={option.value}
                            option={option}
                            isSelected={isSelected}
                            isFocused={isFocused}
                            renderOption={renderOption}
                            onOptionClick={onOptionClick}
                        />
                    );
                })
            ) : (
                <DropdownEmptyState />
            )}
        </ul>
    );
}

export default DropdownList;
