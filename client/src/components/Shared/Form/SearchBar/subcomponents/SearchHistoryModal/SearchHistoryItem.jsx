import { Clock as ClockIcon, X as CloseIcon } from 'lucide-react';
import { formatHistoryTime } from '../../utils/searchBarUtils';

/**
 * Search History Single Item Row Subcomponent
 */
function SearchHistoryItem({ id, term, timestamp, onSelectTerm, onRemoveItem }) {
    return (
        <li className="history-modal-item">
            <button
                type="button"
                className="history-modal-item-btn"
                onClick={() => onSelectTerm(term)}
            >
                <ClockIcon size={14} className="history-item-icon" />
                <span className="history-item-text">{term}</span>
            </button>
            <span className="history-modal-item-time">{formatHistoryTime(timestamp)}</span>
            <button
                type="button"
                className="history-modal-item-remove"
                onClick={(e) => onRemoveItem(e, id)}
                title={`Remove "${term}" from history`}
            >
                <CloseIcon size={12} />
            </button>
        </li>
    );
}

export default SearchHistoryItem;
