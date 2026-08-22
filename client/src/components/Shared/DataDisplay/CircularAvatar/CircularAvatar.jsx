import './CircularAvatar.scss';

function CircularAvatar({
    text = null,
    bgColor = '#8b5cf6',
    size = 32,
    onClick,
    className = '',
    src = null,
    showStatus = false,
    status = 'online',
}) {
    const handleClick = (e) => {
        if (onClick) onClick(e);
    };

    const avatarContent = src ? (
        <img src={src} alt={text || 'User Profile'} className="avatar-image-img" />
    ) : text ? (
        <span className="avatar-letter">{text}</span>
    ) : (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
        >
            <circle cx="18" cy="18" r="18" fill="#dbeafe" />
            <path d="M8 29.5C8 23.5 12.4772 19 18 19C23.5228 19 28 23.5 28 29.5" fill="#2563eb" />
            <circle cx="18" cy="14" r="5.5" fill="#fed7aa" />
            <path
                d="M12.5 13C12.5 9 14.5 7.5 18 7.5C21.5 7.5 23.5 9 23.5 13C22.5 11 20.5 10.5 18 10.5C15.5 10.5 13.5 11 12.5 13Z"
                fill="#1e293b"
            />
        </svg>
    );

    return (
        <div
            className={`circular-avatar-wrapper ${className}`}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <div
                className={`circular-avatar-container ${onClick ? 'clickable' : ''} ${src ? 'has-image' : ''}`}
                onClick={handleClick}
                style={{
                    backgroundColor: src || !text ? 'transparent' : bgColor,
                    width: '100%',
                    height: '100%',
                    fontSize: `${size * 0.42}px`,
                }}
            >
                {avatarContent}
            </div>
            {showStatus && (
                <span className={`status-dot ${status}`} style={{ border: '2px solid white' }} />
            )}
        </div>
    );
}

export default CircularAvatar;
