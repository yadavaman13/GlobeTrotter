import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';

/**
 * Dropdown Empty State Subcomponent
 * Renders fallback UI when dropdown search results are empty.
 */
function DropdownEmptyState({ message = 'No options found' }) {
    return (
        <div className="shared-dropdown-no-results">
            <EmptyState variant="minimal" title={message} size="sm" />
        </div>
    );
}

export default DropdownEmptyState;
