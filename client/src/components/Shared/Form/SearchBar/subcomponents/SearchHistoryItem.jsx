import { Clock as ClockIcon, X as CloseIcon } from 'lucide-react';
import { formatHistoryTime } from '../utils/searchBarUtils';

function SearchHistoryItem({ id, term, timestamp, onSelect, onRemove }) {
    return (
        <li className="history-dropdown-item">
            <button
                type="button"
                className="history-item-content"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(term)}
            >
                <ClockIcon size={14} className="history-item-icon" />
                <span className="history-item-text">{term}</span>
                <span className="history-item-time">{formatHistoryTime(timestamp)}</span>
            </button>
            <button
                type="button"
                className="history-item-remove"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => onRemove(e, id)}
                aria-label={`Remove "${term}" from search history`}
            >
                <CloseIcon size={12} />
            </button>
        </li>
    );
}

export default SearchHistoryItem;
