import './DeleteToast.scss';

// Custom Backspace / Delete-Tag SVG Icon to exactly match the image
const DeleteTagIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 4H8L1 12L8 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4Z" />
        <line x1="18" y1="9" x2="12" y2="15" />
        <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
);

function DeleteToast({ selectedCount = 0, isVisible = false, onClose, onDelete }) {
    return (
        <div
            className={`shared-delete-toast ${isVisible ? 'is-visible' : ''}`}
            role="alert"
            aria-live="polite"
        >
            <div className="toast-selection-group">
                <span className="toast-selection-text">{selectedCount} selected</span>
                <button
                    type="button"
                    className="toast-close-btn"
                    onClick={onClose}
                    aria-label="Dismiss toast"
                >
                    &times;
                </button>
            </div>

            <div className="toast-divider" />

            <div
                className="toast-action-group"
                onClick={onDelete}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onDelete && onDelete();
                    }
                }}
            >
                <span className="toast-delete-text">Delete</span>
                <div className="toast-delete-icon-box" aria-hidden="true">
                    <DeleteTagIcon />
                </div>
            </div>
        </div>
    );
}

export default DeleteToast;
