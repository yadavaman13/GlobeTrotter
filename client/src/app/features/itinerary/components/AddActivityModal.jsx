import { useState } from 'react';
import { X, Plus, Search, Clock, Sparkles, Compass } from 'lucide-react';
import { useActivitySearch } from '../../explore/hooks/useActivitySearch';

export function AddActivityModal({
    isOpen,
    onClose,
    onAddActivity,
    stopId,
    cityId,
    cityName,
    stopStartDate,
}) {
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'custom'

    // Catalog search
    const { searchTerm, setSearchTerm, activities, loading } = useActivitySearch({
        cityId,
    });
    const [selectedCatalogActivity, setSelectedCatalogActivity] = useState(null);

    // Form inputs
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Culture');
    const [activityDate, setActivityDate] = useState(
        stopStartDate || new Date().toISOString().split('T')[0],
    );
    const [startTime, setStartTime] = useState('09:00');
    const [durationMinutes, setDurationMinutes] = useState(120);
    const [cost, setCost] = useState(0);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSelectCatalogItem = (act) => {
        setSelectedCatalogActivity(act);
        setName(act.name);
        setCategory(act.activityType || 'Sightseeing');
        setCost(act.cost || 0);
        setDurationMinutes(act.durationMinutes || 120);
        setNotes(act.description || '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedTime = startTime ? `${startTime}:00` : '09:00:00';

        onAddActivity(stopId, {
            activityId: selectedCatalogActivity?.id || undefined,
            name: name || selectedCatalogActivity?.name || 'Custom Activity',
            activityType: category,
            activityDate,
            startTime: formattedTime,
            durationMinutes: parseInt(durationMinutes, 10) || 60,
            cost: parseFloat(cost) || 0,
            notes,
        });

        // Reset
        setSelectedCatalogActivity(null);
        setName('');
        setNotes('');
        onClose();
    };

    return (
        <div className="modal-backdrop-scrim" onClick={onClose}>
            <div className="modal-dialog-card wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-dialog-header">
                    <div className="modal-title-with-city">
                        <h3 className="modal-dialog-title">Schedule Activity</h3>
                        {cityName && <span className="city-target-pill">for {cityName}</span>}
                    </div>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs-header">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
                        onClick={() => setActiveTab('catalog')}
                    >
                        <Sparkles size={16} />
                        <span>Curated Catalog</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
                        onClick={() => setActiveTab('custom')}
                    >
                        <Compass size={16} />
                        <span>Custom Activity</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-dialog-body">
                    {activeTab === 'catalog' && (
                        <div className="catalog-tab-content">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <Search size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder={`Search experiences in ${cityName || 'this destination'}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="catalog-activities-grid">
                                {loading && (
                                    <p className="loading-state">Loading curated experiences...</p>
                                )}

                                {!loading && activities.length === 0 && (
                                    <div className="empty-catalog-fallback">
                                        <p>No curated experiences found matching your query.</p>
                                        <button
                                            type="button"
                                            className="switch-to-custom-btn"
                                            onClick={() => setActiveTab('custom')}
                                        >
                                            Create Custom Activity Instead
                                        </button>
                                    </div>
                                )}

                                {activities.map((act) => {
                                    const isChosen = selectedCatalogActivity?.id === act.id;
                                    return (
                                        <div
                                            key={act.id}
                                            className={`catalog-card-item ${isChosen ? 'chosen' : ''}`}
                                            onClick={() => handleSelectCatalogItem(act)}
                                        >
                                            <div className="card-top-row">
                                                <h4 className="act-title">{act.name}</h4>
                                                <span className="act-category-badge">
                                                    {act.activityType || 'Culture'}
                                                </span>
                                            </div>
                                            <p className="act-desc">{act.description}</p>
                                            <div className="act-footer">
                                                <span className="act-duration">
                                                    <Clock size={12} /> {act.durationMinutes || 90}m
                                                </span>
                                                <span className="act-cost">
                                                    {Number(act.cost) === 0
                                                        ? 'Free'
                                                        : `$${act.cost}`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Common / Custom Form Fields */}
                    <div className="activity-custom-fields-section">
                        <div className="form-group">
                            <label className="field-label">Activity Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Sunrise Hike, Sushi Cooking Class"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="field-label">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="Culture">Culture</option>
                                    <option value="Sightseeing">Sightseeing</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Food & Dining">Food & Dining</option>
                                    <option value="Relaxation">Relaxation</option>
                                    <option value="Transport">Transport</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="field-label">Scheduled Date</label>
                                <input
                                    type="date"
                                    value={activityDate}
                                    onChange={(e) => setActivityDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="field-label">Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="field-label">Duration (Minutes)</label>
                                <input
                                    type="number"
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(e.target.value)}
                                    min="15"
                                    step="15"
                                />
                            </div>

                            <div className="form-group">
                                <label className="field-label">Estimated Cost ($)</label>
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="field-label">Notes & Booking Tips</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add entry tickets, meetup points, or important tips..."
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="modal-dialog-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={!name.trim()}>
                            <Plus size={16} /> Schedule Activity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddActivityModal;
