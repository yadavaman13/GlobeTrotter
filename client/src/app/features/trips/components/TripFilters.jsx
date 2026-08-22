import { Search } from 'lucide-react';

export function TripFilters({ searchQuery, onSearchChange, activeStatus, onStatusChange }) {
    const statuses = [
        { key: 'all', label: 'All Trips' },
        { key: 'draft', label: 'Drafts' },
        { key: 'planned', label: 'Planned' },
        { key: 'ongoing', label: 'Ongoing' },
        { key: 'completed', label: 'Completed' },
    ];

    return (
        <div className="trip-filters-bar">
            {/* Status Tabs */}
            <div className="status-tabs-list">
                {statuses.map((s) => (
                    <button
                        key={s.key}
                        type="button"
                        className={`status-tab-btn ${activeStatus === s.key ? 'active' : ''}`}
                        onClick={() => onStatusChange(s.key)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="search-filter-wrapper">
                <Search size={16} className="search-icon" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search trips by name or destination..."
                    className="search-filter-input"
                />
            </div>
        </div>
    );
}

export default TripFilters;
