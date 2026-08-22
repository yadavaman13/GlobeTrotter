import Button from '@/components/Shared/Buttons/Button/Button';

function SaveDetailsButton({
    onClick,
    label = 'Save Details',
    children,
    variant = 'primary',
    className = '',
    type = 'button',
    ...props
}) {
    const displayText = children || label;

    return (
        <Button type={type} variant={variant} onClick={onClick} className={className} {...props}>
            {displayText}
        </Button>
    );
}

export default SaveDetailsButton;
