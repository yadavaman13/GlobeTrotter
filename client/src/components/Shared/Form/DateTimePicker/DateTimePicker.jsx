import { useState, useEffect, useRef } from 'react';
import DateTimePickerTrigger from './subcomponents/DateTimePickerTrigger';
import DateTimePickerPopover from './subcomponents/DateTimePickerPopover';
import { useClickOutside } from '@/hooks/useClickOutside';
import './DateTimePicker.scss';

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function formatDateDisplay(date, showTime) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
    const year = date.getFullYear();

    if (!showTime) {
        return `${day} ${month} ${year}`;
    }

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');

    return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
}

/**
 * Shared Modular DateTimePicker Component
 * Composes DateTimePickerTrigger, DateTimePickerPopover, and shared Calendar component.
 */
function DateTimePicker({
    value = null,
    onChange,
    label = '',
    placeholder = 'Select date & time...',
    showTime = true,
    clearable = true,
    disabled = false,
    error = '',
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);

    const parseValue = (val) => {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    };

    const selectedDate = parseValue(value);
    const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

    const [hoursVal, setHoursVal] = useState(() => {
        if (!selectedDate) return '09';
        let h = selectedDate.getHours() % 12;
        h = h ? h : 12;
        return String(h).padStart(2, '0');
    });

    const [minutesVal, setMinutesVal] = useState(() => {
        if (!selectedDate) return '00';
        return String(selectedDate.getMinutes()).padStart(2, '0');
    });

    const [ampmVal, setAmPmVal] = useState(() => {
        if (!selectedDate) return 'AM';
        return selectedDate.getHours() >= 12 ? 'PM' : 'AM';
    });

    const pickerRef = useRef(null);

    useEffect(() => {
        const parsed = parseValue(value);
        if (parsed) {
            setViewDate(parsed);
            let h = parsed.getHours() % 12;
            h = h ? h : 12;
            setHoursVal(String(h).padStart(2, '0'));
            setMinutesVal(String(parsed.getMinutes()).padStart(2, '0'));
            setAmPmVal(parsed.getHours() >= 12 ? 'PM' : 'AM');
        }
    }, [value]);

    useClickOutside(pickerRef, () => setIsOpen(false), { enabled: isOpen });

    const handleDateSelect = (dateObj) => {
        const chosen = new Date(dateObj);

        if (showTime) {
            let h = parseInt(hoursVal, 10);
            if (ampmVal === 'PM' && h < 12) h += 12;
            if (ampmVal === 'AM' && h === 12) h = 0;
            chosen.setHours(h, parseInt(minutesVal, 10), 0, 0);
        } else {
            chosen.setHours(0, 0, 0, 0);
        }

        if (onChange) {
            onChange(chosen);
        }
    };

    const handleTimeChange = (newHours, newMinutes, newAmpm) => {
        setHoursVal(newHours);
        setMinutesVal(newMinutes);
        setAmPmVal(newAmpm);

        if (selectedDate) {
            const updated = new Date(selectedDate);
            let h = parseInt(newHours, 10);
            if (newAmpm === 'PM' && h < 12) h += 12;
            if (newAmpm === 'AM' && h === 12) h = 0;
            updated.setHours(h, parseInt(newMinutes, 10), 0, 0);

            if (onChange) {
                onChange(updated);
            }
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (onChange) {
            onChange(null);
        }
    };

    const handleQuickPreset = (presetType) => {
        const now = new Date();
        const target = new Date();

        if (presetType === 'today') {
            target.setHours(now.getHours(), now.getMinutes(), 0, 0);
        } else if (presetType === 'tomorrow') {
            target.setDate(now.getDate() + 1);
            target.setHours(9, 0, 0, 0);
        } else if (presetType === 'nextWeek') {
            target.setDate(now.getDate() + 7);
            target.setHours(9, 0, 0, 0);
        }

        setViewDate(target);
        let h = target.getHours() % 12;
        h = h ? h : 12;
        setHoursVal(String(h).padStart(2, '0'));
        setMinutesVal(String(target.getMinutes()).padStart(2, '0'));
        setAmPmVal(target.getHours() >= 12 ? 'PM' : 'AM');

        if (onChange) {
            onChange(target);
        }
    };

    const displayString = formatDateDisplay(selectedDate, showTime);

    return (
        <div
            className={`dtp-component-container ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''} ${className}`}
            ref={pickerRef}
        >
            {/* 1. Input Trigger Subcomponent */}
            <DateTimePickerTrigger
                label={label}
                displayString={displayString}
                placeholder={placeholder}
                isOpen={isOpen}
                disabled={disabled}
                clearable={clearable}
                selectedDate={selectedDate}
                onToggle={() => setIsOpen(!isOpen)}
                onClear={handleClear}
                error={error}
            />

            {/* 2. Popover Dropdown Subcomponent (Composing shared Calendar) */}
            <DateTimePickerPopover
                isOpen={isOpen}
                selectedDate={selectedDate}
                viewDate={viewDate}
                onViewDateChange={setViewDate}
                onSelectDate={handleDateSelect}
                showTime={showTime}
                hoursVal={hoursVal}
                minutesVal={minutesVal}
                ampmVal={ampmVal}
                onTimeChange={handleTimeChange}
                onQuickPreset={handleQuickPreset}
                onDoneClick={() => setIsOpen(false)}
            />
        </div>
    );
}

export default DateTimePicker;
