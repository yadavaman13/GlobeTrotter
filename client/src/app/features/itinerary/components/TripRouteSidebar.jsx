import { Plus, MapPin } from 'lucide-react';

export function TripRouteSidebar({ stops = [], activeStopId, onSelectStop, onOpenAddStop }) {
    return (
        <aside className="trip-route-sidebar">
            <div className="sidebar-sticky-panel">
                <h3 className="route-title">Trip Route</h3>

                <div className="route-timeline">
                    <div className="timeline-connector-line" />

                    {stops.map((stop, index) => {
                        const isActive = stop.id === activeStopId;
                        return (
                            <div
                                key={stop.id || index}
                                className={`route-node-item ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectStop(stop.id)}
                            >
                                <div className={`node-dot ${isActive ? 'active' : ''}`}>
                                    <div className="node-inner" />
                                </div>

                                <div className="node-content">
                                    <div className="node-city-name">
                                        {stop.cityName ||
                                            stop.city?.name ||
                                            `Destination ${index + 1}`}
                                    </div>
                                    <div className="node-dates">
                                        {stop.startDate && stop.endDate
                                            ? `${stop.startDate.slice(5)} - ${stop.endDate.slice(5)}`
                                            : 'Dates not set'}
                                    </div>

                                    {isActive && (
                                        <div className="node-thumbnail">
                                            <img
                                                src={
                                                    stop.coverImage ||
                                                    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80'
                                                }
                                                alt={stop.cityName || 'City thumbnail'}
                                                className="node-img"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {stops.length === 0 && (
                        <div className="route-empty-state">
                            <MapPin size={24} className="empty-icon" />
                            <p className="empty-text">No destinations added yet</p>
                        </div>
                    )}
                </div>

                <button type="button" className="add-destination-btn" onClick={onOpenAddStop}>
                    <Plus size={16} />
                    <span>Add Destination</span>
                </button>
            </div>
        </aside>
    );
}

export default TripRouteSidebar;
