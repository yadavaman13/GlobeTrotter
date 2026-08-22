import { Check as CheckIcon } from 'lucide-react';
import Calendar from '@/components/Shared/Form/Calendar/Calendar';
import QuickPresetsRow from './QuickPresetsRow';
import TimeSelector from './TimeSelector';

/**
 * DateTimePicker Popover Subcomponent
 * Composes QuickPresetsRow, shared Calendar component, TimeSelector, and Done action button.
 */
function DateTimePickerPopover({
    isOpen,
    selectedDate,
    viewDate,
    onViewDateChange,
    onSelectDate,
    showTime,
    hoursVal,
    minutesVal,
    ampmVal,
    onTimeChange,
    onQuickPreset,
    onDoneClick,
}) {
    if (!isOpen) return null;

    return (
        <div className="dtp-popover-menu">
            {/* 1. Quick Presets */}
            <QuickPresetsRow onSelectPreset={onQuickPreset} />

            {/* 2. Shared Calendar Component (showCard={false}) */}
            <div className="dtp-calendar-wrapper" style={{ padding: '4px 8px' }}>
                <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={onSelectDate}
                    viewDate={viewDate}
                    onViewDateChange={onViewDateChange}
                    showCard={false}
                    eventDates={[]}
                />
            </div>

            {/* 3. Time Picker Section (If showTime=true) */}
            {showTime && (
                <TimeSelector
                    hoursVal={hoursVal}
                    minutesVal={minutesVal}
                    ampmVal={ampmVal}
                    onTimeChange={onTimeChange}
                />
            )}

            {/* 4. Footer Done action */}
            <div className="dtp-footer">
                <button type="button" className="dtp-done-btn" onClick={onDoneClick}>
                    <CheckIcon size={14} />
                    <span>Done</span>
                </button>
            </div>
        </div>
    );
}

export default DateTimePickerPopover;
