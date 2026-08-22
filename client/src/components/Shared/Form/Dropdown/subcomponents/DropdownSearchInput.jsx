import { Search as SearchIcon } from 'lucide-react';

/**
 * Dropdown Search Input Subcomponent
 * Renders search bar inside the dropdown popover menu when searchable is enabled.
 */
function DropdownSearchInput({ searchInputRef, searchQuery, onSearchChange, disabled }) {
    return (
        <div className="shared-dropdown-search-wrapper">
            <SearchIcon size={16} className="shared-dropdown-search-icon" />
            <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search..."
                className="shared-dropdown-search-input"
                disabled={disabled}
            />
        </div>
    );
}

export default DropdownSearchInput;
