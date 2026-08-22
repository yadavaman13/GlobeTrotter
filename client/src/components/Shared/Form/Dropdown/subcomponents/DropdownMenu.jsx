import DropdownSearchInput from './DropdownSearchInput';
import DropdownList from './DropdownList';

/**
 * Dropdown Menu Subcomponent
 * Composes DropdownSearchInput and DropdownList.
 */
function DropdownMenu({
    isOpen,
    searchable,
    searchInputRef,
    searchQuery,
    onSearchChange,
    disabled,
    listRef,
    maxHeight,
    filteredOptions,
    selectedValue,
    focusedIndex,
    renderOption,
    onOptionClick,
}) {
    return (
        <div className={`shared-dropdown-menu ${isOpen ? 'is-open' : ''}`}>
            {searchable && (
                <DropdownSearchInput
                    searchInputRef={searchInputRef}
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    disabled={disabled}
                />
            )}

            <DropdownList
                listRef={listRef}
                maxHeight={maxHeight}
                filteredOptions={filteredOptions}
                selectedValue={selectedValue}
                focusedIndex={focusedIndex}
                renderOption={renderOption}
                onOptionClick={onOptionClick}
            />
        </div>
    );
}

export default DropdownMenu;
