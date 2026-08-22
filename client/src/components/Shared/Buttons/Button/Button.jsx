import { isValidElement } from 'react';
import './Button.scss';

function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'lg',
    circle = false,
    fullWidth = false,
    icon,
    onClick,
    disabled = false,
    loading = false,
    className = '',
    ...props
}) {
    const isButtonDisabled = disabled || loading;

    const classes = [
        'btn',
        `btn-${variant}`,
        size !== 'lg' ? `btn-${size}` : '',
        circle ? 'btn-circle' : '',
        fullWidth ? 'btn-full-width' : '',
        isButtonDisabled ? 'is-disabled' : '',
        loading ? 'btn-loading' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const showChildren = !(loading && (size === 'icon' || size === 'icon-sm'));

    const renderIcon = () => {
        if (!icon || loading) return null;
        if (isValidElement(icon)) return icon;
        if (typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof)) {
            const IconComp = icon;
            return <IconComp size={16} className="btn-icon" />;
        }
        return null;
    };

    return (
        <button
            type={type}
            disabled={isButtonDisabled}
            className={classes}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className="btn-spinner" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </span>
            )}
            {renderIcon()}
            {showChildren && children}
        </button>
    );
}

export default Button;
