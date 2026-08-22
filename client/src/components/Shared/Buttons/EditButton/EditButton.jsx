import './EditButton.scss';

const EditIcon = () => (
    <svg
        className="edit-btn-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

function EditButton({ onClick, disabled = false, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`shared-edit-btn ${className}`}
        >
            <EditIcon />
            <span>Edit</span>
        </button>
    );
}

export default EditButton;
