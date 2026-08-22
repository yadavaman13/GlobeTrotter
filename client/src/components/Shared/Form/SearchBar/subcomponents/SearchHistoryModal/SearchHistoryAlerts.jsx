import { AlertTriangle as WarnIcon } from 'lucide-react';

/**
 * Search History Validation Warnings / Alerts Subcomponent
 */
function SearchHistoryAlerts({ dateRangeError, futureDateWarning }) {
    if (!dateRangeError && !futureDateWarning) return null;

    return (
        <>
            {dateRangeError && (
                <div className="history-modal-alert history-modal-alert--error">
                    <WarnIcon size={14} />
                    <span>{dateRangeError}</span>
                </div>
            )}
            {!dateRangeError && futureDateWarning && (
                <div className="history-modal-alert history-modal-alert--warn">
                    <WarnIcon size={14} />
                    <span>{futureDateWarning}</span>
                </div>
            )}
        </>
    );
}

export default SearchHistoryAlerts;
