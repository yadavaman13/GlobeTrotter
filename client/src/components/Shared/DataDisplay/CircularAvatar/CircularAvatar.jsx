import './CircularAvatar.scss';

function parseAvatarSize(s) {
    if (typeof s === 'number') return s;
    const sizeMap = {
        xs: 24,
        sm: 28,
        md: 36,
        lg: 44,
        xl: 56,
        '2xl': 72,
    };
    if (typeof s === 'string') {
        if (sizeMap[s.toLowerCase()]) return sizeMap[s.toLowerCase()];
        const parsed = parseInt(s, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 36;
}

function extractInitials(name, text) {
    if (text) return text;
    if (!name || typeof name !== 'string') return null;
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return null;
}

function CircularAvatar({
    text = null,
    name = null,
    bgColor = '#8b5cf6',
    size = 36,
    onClick,
    className = '',
    src = null,
    showStatus = false,
    status = 'online',
}) {
    const numericSize = parseAvatarSize(size);
    const displayText = extractInitials(name, text);

    const handleClick = (e) => {
        if (onClick) onClick(e);
    };

    const avatarContent = src ? (
        <img src={src} alt={displayText || name || 'User Profile'} className="avatar-image-img" />
    ) : displayText ? (
        <span className="avatar-letter">{displayText}</span>
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
            style={{
                width: `${numericSize}px`,
                height: `${numericSize}px`,
                minWidth: `${numericSize}px`,
                minHeight: `${numericSize}px`,
                maxWidth: `${numericSize}px`,
                maxHeight: `${numericSize}px`,
            }}
        >
            <div
                className={`circular-avatar-container ${onClick ? 'clickable' : ''} ${src ? 'has-image' : ''}`}
                onClick={handleClick}
                style={{
                    backgroundColor: src || !displayText ? 'transparent' : bgColor,
                    width: '100%',
                    height: '100%',
                    fontSize: `${numericSize * 0.4}px`,
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
