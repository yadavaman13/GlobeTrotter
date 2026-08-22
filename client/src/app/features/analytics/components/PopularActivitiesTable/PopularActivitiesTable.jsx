import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { Compass, MapPin } from 'lucide-react';
import './PopularActivitiesTable.scss';

export function PopularActivitiesTable({ activities = [] }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="popular-activities-card empty">
                <h3 className="card-title">Top Scheduled Activities</h3>
                <p className="empty-subtext">No activity reservations or scheduled tours recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="popular-activities-card">
            <div className="card-header">
                <div>
                    <h3 className="card-title">Most Booked & Scheduled Activities</h3>
                    <span className="card-caption">Popular experiences added to traveler itineraries</span>
                </div>
            </div>

            <div className="activities-table-wrapper">
                <table className="activities-table">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>City & Location</th>
                            <th>Category</th>
                            <th>Est. Cost</th>
                            <th className="th-right">Scheduled Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((act) => {
                            const formattedCost = act.cost
                                ? new Intl.NumberFormat('en-IN', {
                                      style: 'currency',
                                      currency: act.currency || 'INR',
                                      maximumFractionDigits: 0,
                                  }).format(act.cost)
                                : 'Free';

                            return (
                                <tr key={act.id}>
                                    <td className="activity-title-cell">
                                        <Compass size={16} className="compass-icon" />
                                        <span className="activity-name">{act.name}</span>
                                    </td>

                                    <td className="location-cell">
                                        <span className="city-label">
                                            <MapPin size={13} /> {act.cityName}, {act.country}
                                        </span>
                                    </td>

                                    <td>
                                        <Badge variant="neutral" type="subtle">
                                            {act.activityType || 'General'}
                                        </Badge>
                                    </td>

                                    <td className="cost-cell">{formattedCost}</td>

                                    <td className="count-cell">
                                        <span className="schedule-badge">{act.scheduleCount} trips</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PopularActivitiesTable;
