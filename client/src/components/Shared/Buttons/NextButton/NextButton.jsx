import './NextButton.scss';

function NextButton({ onClick, disabled = false, className = '', showText = true }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`pagination-next-btn ${showText ? '' : 'icon-only'} ${className}`}
        >
            {showText && <span>Next</span>}
            <svg
                className="next-arrow-svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </button>
    );
}

export default NextButton;
