import { Search, RefreshCw, Trash2 } from 'lucide-react';
import Button from '@/components/Shared/Buttons/Button/Button';

import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import './UserFilters.scss';

export function UserFilters({
    filters,
    onFilterChange,
    onResetFilters,
    onOpenCleanupDialog,
    loading,
}) {
    const roleOptions = [
        { label: 'All Roles', value: '' },
        { label: 'Users', value: 'user' },
        { label: 'Admins', value: 'admin' },
    ];

    const statusOptions = [
        { label: 'All Statuses', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Soft Deleted', value: 'deleted' },
    ];

    const handleStatusSelect = (val) => {
        if (val === 'active') {
            onFilterChange('isActive', 'true');
            onFilterChange('isDeleted', 'false');
        } else if (val === 'inactive') {
            onFilterChange('isActive', 'false');
            onFilterChange('isDeleted', 'false');
        } else if (val === 'deleted') {
            onFilterChange('isDeleted', 'true');
            onFilterChange('isActive', '');
        } else {
            onFilterChange('isActive', '');
            onFilterChange('isDeleted', '');
        }
    };

    const currentStatusValue =
        filters.isDeleted === 'true' || filters.isDeleted === true
            ? 'deleted'
            : filters.isActive === 'true' || filters.isActive === true
              ? 'active'
              : filters.isActive === 'false' || filters.isActive === false
                ? 'inactive'
                : '';

    return (
        <div className="admin-user-filters-bar">
            <div className="filters-left">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search by first name, last name, or email..."
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="filter-dropdowns">
                    <Dropdown
                        placeholder="Role"
                        options={roleOptions}
                        value={filters.role}
                        onChange={(opt) => onFilterChange('role', opt.value)}
                        className="role-filter-dropdown"
                    />

                    <Dropdown
                        placeholder="Status"
                        options={statusOptions}
                        value={currentStatusValue}
                        onChange={(opt) => handleStatusSelect(opt.value)}
                        className="status-filter-dropdown"
                    />
                </div>
            </div>

            <div className="filters-right">
                {(filters.search ||
                    filters.role ||
                    filters.isActive !== '' ||
                    filters.isDeleted !== '') && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilters}
                        className="reset-filters-btn"
                    >
                        <RefreshCw size={14} /> Reset
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="cleanup-users-btn"
                    onClick={onOpenCleanupDialog}
                    disabled={loading}
                >
                    <Trash2 size={14} /> Purge Expired Users
                </Button>
            </div>
        </div>
    );
}

export default UserFilters;
