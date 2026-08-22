import { useState } from 'react';
import { Search, MapPin, X, Plus } from 'lucide-react';
import { useCitySearch } from '../../explore/hooks/useCitySearch';

export function AddStopModal({ isOpen, onClose, onAddStop, tripStartDate, tripEndDate }) {
    const { searchTerm, setSearchTerm, cities, loading } = useCitySearch('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [startDate, setStartDate] = useState(
        () => tripStartDate || new Date().toISOString().split('T')[0],
    );
    const [endDate, setEndDate] = useState(
        () => tripEndDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    );

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCity) return;

        onAddStop({
            cityId: selectedCity.id,
            startDate,
            endDate,
        });

        setSelectedCity(null);
        setSearchTerm('');
        onClose();
    };

    return (
        <div className="modal-backdrop-scrim" onClick={onClose}>
            <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-dialog-header">
                    <h3 className="modal-dialog-title">Add Destination City</h3>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-dialog-body">
                    {/* City Search Bar */}
                    <div className="form-group">
                        <label className="field-label">Search Global Cities</label>
                        <div className="input-wrapper">
                            <Search size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Search city name (e.g., Kyoto, Osaka, Paris, Rome)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* City Search Results */}
                    <div className="city-search-results-list">
                        {loading && <p className="loading-state">Searching destinations...</p>}

                        {!loading && cities.length === 0 && (
                            <p className="empty-results-state">
                                No cities found matching "{searchTerm}". Try another search.
                            </p>
                        )}

                        {cities.map((city) => {
                            const isChosen = selectedCity?.id === city.id;
                            return (
                                <div
                                    key={city.id}
                                    className={`city-result-item ${isChosen ? 'chosen' : ''}`}
                                    onClick={() => setSelectedCity(city)}
                                >
                                    <div className="city-pin-icon">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="city-result-details">
                                        <h4 className="city-name">{city.name}</h4>
                                        <p className="city-country">
                                            {city.country} {city.region ? `• ${city.region}` : ''}
                                        </p>
                                    </div>
                                    {city.costIndex && (
                                        <span className="cost-index-tag">
                                            Cost Index: {city.costIndex}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected City Confirmation */}
                    {selectedCity && (
                        <div className="selected-city-banner">
                            <MapPin size={16} />
                            <span>
                                Selected:{' '}
                                <strong>
                                    {selectedCity.name}, {selectedCity.country}
                                </strong>
                            </span>
                        </div>
                    )}

                    {/* Date Pickers */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="field-label">Arrival Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="field-label">Departure Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-dialog-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={!selectedCity}>
                            <Plus size={16} /> Add Destination
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStopModal;
