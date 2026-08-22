import { CalendarDays as CalendarIcon, ChevronDown, X as CloseIcon } from 'lucide-react';

/**
 * DateTimePicker Input Trigger Subcomponent
 */
function DateTimePickerTrigger({
    label,
    displayString,
    placeholder,
    isOpen,
    disabled,
    clearable,
    selectedDate,
    onToggle,
    onClear,
    error,
}) {
    return (
        <>
            {label && <label className="dtp-label">{label}</label>}

            <div
                className={`dtp-trigger-capsule ${isOpen ? 'is-open' : ''}`}
                onClick={() => !disabled && onToggle()}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span className="dtp-trigger-left-icon">
                    <CalendarIcon size={16} strokeWidth={2.2} />
                </span>

                <span className={`dtp-trigger-value ${!displayString ? 'is-placeholder' : ''}`}>
                    {displayString || placeholder}
                </span>

                <div className="dtp-trigger-actions">
                    {clearable && selectedDate && !disabled && (
                        <button
                            type="button"
                            className="dtp-clear-btn"
                            onClick={onClear}
                            aria-label="Clear date & time"
                            title="Clear selection"
                        >
                            <CloseIcon size={13} />
                        </button>
                    )}
                    <ChevronDown size={16} className="dtp-chevron" />
                </div>
            </div>

            {error && <span className="dtp-error-message">{error}</span>}
        </>
    );
}

export default DateTimePickerTrigger;
