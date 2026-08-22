/**
 * Quick Presets Row Subcomponent
 */
function QuickPresetsRow({ onSelectPreset }) {
    return (
        <div className="dtp-presets-row">
            <button
                type="button"
                className="dtp-preset-btn"
                onClick={() => onSelectPreset('today')}
            >
                Today
            </button>
            <button
                type="button"
                className="dtp-preset-btn"
                onClick={() => onSelectPreset('tomorrow')}
            >
                Tomorrow
            </button>
            <button
                type="button"
                className="dtp-preset-btn"
                onClick={() => onSelectPreset('nextWeek')}
            >
                Next Week
            </button>
        </div>
    );
}

export default QuickPresetsRow;
