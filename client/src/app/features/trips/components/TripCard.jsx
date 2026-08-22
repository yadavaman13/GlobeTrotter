import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Wallet, MoreVertical, Trash2, Copy, Compass, PieChart, Eye } from 'lucide-react';

export function TripCard({ trip, onDelete, onClone }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const defaultCover =
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'ongoing':
                return { label: 'Ongoing', cls: 'badge-ongoing' };
            case 'planned':
                return { label: 'Planned', cls: 'badge-planned' };
            case 'completed':
                return { label: 'Completed', cls: 'badge-completed' };
            default:
                return { label: 'Draft', cls: 'badge-draft' };
        }
    };

    const badge = getStatusBadge(trip.status);

    return (
        <div className="my-trip-card" onClick={() => navigate(`/trips/${trip.id}/itinerary`)}>
            {/* Card Cover Media */}
            <div
                className="card-cover-media"
                style={{
                    backgroundImage: `url('${trip.coverPhotoUrl || defaultCover}')`,
                }}
            >
                <div className="card-cover-overlay" />
                <span className={`status-badge ${badge.cls}`}>{badge.label}</span>

                {/* More Action Menu */}
                <div
                    className="card-menu-anchor"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                >
                    <button type="button" className="menu-trigger-btn">
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <div className="card-dropdown-menu">
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    navigate(`/trips/${trip.id}/itinerary`);
                                }}
                            >
                                <Compass size={14} /> Open Itinerary
                            </button>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    navigate(`/trips/${trip.id}/budget`);
                                }}
                            >
                                <PieChart size={14} /> Budget Analytics
                            </button>
                            {trip.publicSlug && (
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        window.open(`/share/${trip.publicSlug}`, '_blank');
                                    }}
                                >
                                    <Eye size={14} /> View Public Link
                                </button>
                            )}
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onClone?.(trip.id, `Copy of ${trip.name}`);
                                }}
                            >
                                <Copy size={14} /> Duplicate Trip
                            </button>
                            <button
                                type="button"
                                className="dropdown-item delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onDelete(trip.id);
                                }}
                            >
                                <Trash2 size={14} /> Delete Trip
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Card Content Body */}
            <div className="card-body">
                <h3 className="trip-title">{trip.name || 'Untitled Trip'}</h3>
                {trip.description && <p className="trip-description">{trip.description}</p>}

                <div className="trip-meta-list">
                    <div className="meta-item">
                        <Calendar size={14} className="meta-icon" />
                        <span>
                            {trip.startDate && trip.endDate
                                ? `${trip.startDate} - ${trip.endDate}`
                                : 'Dates flexible'}
                        </span>
                    </div>

                    {trip.budgetAmount && (
                        <div className="meta-item">
                            <Wallet size={14} className="meta-icon" />
                            <span>
                                {trip.budgetCurrency || 'USD'}{' '}
                                {Number(trip.budgetAmount).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TripCard;
