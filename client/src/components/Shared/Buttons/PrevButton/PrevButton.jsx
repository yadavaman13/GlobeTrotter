import './PrevButton.scss';

function PrevButton({ onClick, disabled = false, className = '', showText = true }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`pagination-prev-btn ${showText ? '' : 'icon-only'} ${className}`}
        >
            <svg
                className="prev-arrow-svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="15 18 9 12 15 6" />
            </svg>
            {showText && <span>Previous</span>}
        </button>
    );
}

export default PrevButton;
