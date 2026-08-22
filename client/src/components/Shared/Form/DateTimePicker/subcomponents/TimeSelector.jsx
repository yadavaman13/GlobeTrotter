import { Clock as ClockIcon } from 'lucide-react';

/**
 * Time Selector Subcomponent
 * Renders hours dropdown, minutes dropdown, and AM/PM toggle buttons.
 */
function TimeSelector({ hoursVal, minutesVal, ampmVal, onTimeChange }) {
    return (
        <div className="dtp-time-section">
            <div className="dtp-time-label">
                <ClockIcon size={14} />
                <span>Set Time:</span>
            </div>

            <div className="dtp-time-inputs-group">
                {/* Hours Select */}
                <select
                    className="dtp-time-select"
                    value={hoursVal}
                    onChange={(e) => onTimeChange(e.target.value, minutesVal, ampmVal)}
                >
                    {Array.from({ length: 12 }, (_, i) => {
                        const h = String(i + 1).padStart(2, '0');
                        return (
                            <option key={`h-${h}`} value={h}>
                                {h}
                            </option>
                        );
                    })}
                </select>

                <span className="dtp-time-colon">:</span>

                {/* Minutes Select */}
                <select
                    className="dtp-time-select"
                    value={minutesVal}
                    onChange={(e) => onTimeChange(hoursVal, e.target.value, ampmVal)}
                >
                    {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(
                        (m) => (
                            <option key={`m-${m}`} value={m}>
                                {m}
                            </option>
                        ),
                    )}
                </select>

                {/* AM / PM Selector */}
                <div className="dtp-ampm-toggle">
                    <button
                        type="button"
                        className={`ampm-btn ${ampmVal === 'AM' ? 'active' : ''}`}
                        onClick={() => onTimeChange(hoursVal, minutesVal, 'AM')}
                    >
                        AM
                    </button>
                    <button
                        type="button"
                        className={`ampm-btn ${ampmVal === 'PM' ? 'active' : ''}`}
                        onClick={() => onTimeChange(hoursVal, minutesVal, 'PM')}
                    >
                        PM
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TimeSelector;
