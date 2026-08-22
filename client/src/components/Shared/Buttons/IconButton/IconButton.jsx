import './IconButton.scss';

function IconButton({ icon, onClick, variant = 'plain', size = 32, className = '' }) {
    const handleClick = (e) => {
        if (onClick) onClick(e);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`shared-icon-button ${variant} ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            <span className="icon-wrapper">{icon}</span>
        </button>
    );
}

export default IconButton;
