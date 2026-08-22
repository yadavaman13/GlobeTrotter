import { useMemo } from 'react';
import { MapPin, Star } from 'lucide-react';
import './PopularCitiesBarChart.scss';

export function PopularCitiesBarChart({ cities = [] }) {
    const maxVisits = useMemo(() => {
        if (!cities.length) return 1;
        const highest = Math.max(...cities.map((c) => Number(c.visitCount || 0)));
        return highest > 0 ? highest : 1;
    }, [cities]);

    if (!cities || cities.length === 0) {
        return (
            <div className="popular-cities-chart-card empty">
                <h3 className="chart-title">Most Popular Destinations</h3>
                <p className="empty-subtext">No destination visits recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="popular-cities-chart-card">
            <div className="card-header">
                <div>
                    <h3 className="chart-title">Most Popular Destinations</h3>
                    <span className="chart-caption">Ranked by traveler itineraries & popularity score</span>
                </div>
            </div>

            <div className="cities-bar-list">
                {cities.slice(0, 6).map((city, index) => {
                    const visits = Number(city.visitCount || 0);
                    const percentage = Math.max(8, (visits / maxVisits) * 100);

                    return (
                        <div key={city.id || index} className="city-bar-row">
                            <div className="city-info-col">
                                <span className="city-rank">#{index + 1}</span>
                                <div className="city-meta">
                                    <span className="city-name">{city.name}</span>
                                    <span className="city-country">{city.country}</span>
                                </div>
                            </div>

                            <div className="bar-track-wrapper">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${percentage}%` }}
                                />
                                <span className="visits-count">{visits} stops</span>
                            </div>

                            {city.popularity && (
                                <div className="popularity-badge" title="Popularity Rating">
                                    <Star size={12} className="star-icon" />
                                    <span>{city.popularity}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PopularCitiesBarChart;
