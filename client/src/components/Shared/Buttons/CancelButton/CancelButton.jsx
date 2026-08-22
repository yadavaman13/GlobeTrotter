import Button from '@/components/Shared/Buttons/Button/Button';

function CancelButton({
    onClick,
    label = 'Cancel',
    children,
    disabled = false,
    className = '',
    type = 'button',
    size = 'md',
    ...props
}) {
    return (
        <Button
            type={type}
            variant="muted"
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={`shared-cancel-btn ${className}`}
            {...props}
        >
            {children || label}
        </Button>
    );
}

export default CancelButton;
