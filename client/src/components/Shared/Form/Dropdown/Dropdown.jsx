import { useState, useEffect, useRef, useCallback } from 'react';
import DropdownTrigger from './subcomponents/DropdownTrigger';
import DropdownMenu from './subcomponents/DropdownMenu';
import { normalizeOptions } from './subcomponents/dropdownUtils';
import { useClickOutside } from '@/hooks/useClickOutside';
import './Dropdown.scss';

/**
 * Shared Modular Dropdown Component
 * Ultra-granular breakdown composed of micro-subcomponents and utility modules.
 */
function Dropdown({
    label,
    placeholder = 'Select an option',
    options = [],
    value,
    onChange,
    disabled = false,
    error,
    searchable = false,
    clearable = false,
    className = '',
    maxHeight = '250px',
    renderOption,
    triggerRef: externalTriggerRef,
    dropdownId,
    onSearchChange,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const setTriggerRef = useCallback(
        (element) => {
            triggerRef.current = element;
            if (externalTriggerRef) {
                if (typeof externalTriggerRef === 'function') {
                    externalTriggerRef(element);
                } else if ('current' in externalTriggerRef) {
                    externalTriggerRef.current = element;
                }
            }
        },
        [externalTriggerRef],
    );

    // Normalize options to object format using utility
    const normalizedOptions = normalizeOptions(options);

    // Filter options based on search query
    const filteredOptions = normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Find currently selected option
    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    // Handle click outside to close dropdown
    useClickOutside(dropdownRef, () => setIsOpen(false), { enabled: isOpen });

    // Sync focused index and search focus on open
    useEffect(() => {
        if (isOpen) {
            const selectedIdx = filteredOptions.findIndex((opt) => opt.value === value);
            if (selectedIdx >= 0) {
                setFocusedIndex(selectedIdx);
            } else {
                const firstEnabled = filteredOptions.findIndex((opt) => !opt.disabled);
                setFocusedIndex(firstEnabled >= 0 ? firstEnabled : 0);
            }

            if (searchable) {
                const timer = setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 60);
                return () => clearTimeout(timer);
            }
        } else {
            setSearchQuery('');
            setFocusedIndex(-1);
        }
    }, [isOpen, searchable, value, searchQuery]);

    // Auto-scroll list items when navigating via keyboard
    useEffect(() => {
        if (focusedIndex >= 0 && listRef.current) {
            const listEl = listRef.current;
            const focusedEl = listEl.children[focusedIndex];
            if (focusedEl) {
                const listHeight = listEl.clientHeight;
                const itemTop = focusedEl.offsetTop;
                const itemHeight = focusedEl.offsetHeight;
                const scrollTop = listEl.scrollTop;

                if (itemTop + itemHeight > scrollTop + listHeight) {
                    listEl.scrollTop = itemTop + itemHeight - listHeight;
                } else if (itemTop < scrollTop) {
                    listEl.scrollTop = itemTop;
                }
            }
        }
    }, [focusedIndex]);

    const toggleDropdown = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        if (option.disabled) return;
        if (onChange) {
            onChange(option.value, option.original);
        }
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (disabled) return;
        if (onChange) {
            onChange(undefined, null);
        }
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    const focusedOpt = filteredOptions[focusedIndex];
                    if (focusedOpt) {
                        handleOptionClick(focusedOpt);
                    }
                }
                break;

            case ' ':
                if (searchable && document.activeElement === searchInputRef.current) {
                    return;
                }
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    const focusedOpt = filteredOptions[focusedIndex];
                    if (focusedOpt) {
                        handleOptionClick(focusedOpt);
                    }
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setFocusedIndex((prev) => {
                        let next = prev + 1;
                        while (next < filteredOptions.length && filteredOptions[next].disabled) {
                            next++;
                        }
                        return next < filteredOptions.length ? next : prev;
                    });
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setFocusedIndex((prev) => {
                        let prevIdx = prev - 1;
                        while (prevIdx >= 0 && filteredOptions[prevIdx].disabled) {
                            prevIdx--;
                        }
                        return prevIdx >= 0 ? prevIdx : prev;
                    });
                }
                break;

            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                triggerRef.current?.focus();
                break;

            case 'Tab':
                setIsOpen(false);
                break;

            default:
                break;
        }
    };

    return (
        <div
            className={`shared-dropdown-container ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
        >
            {label && <label className="shared-dropdown-label">{label}</label>}
            <div className="shared-dropdown">
                {/* 1. Dropdown Trigger Subcomponent */}
                <DropdownTrigger
                    selectedOption={selectedOption}
                    placeholder={placeholder}
                    isOpen={isOpen}
                    disabled={disabled}
                    clearable={clearable}
                    error={error}
                    setTriggerRef={setTriggerRef}
                    onToggle={toggleDropdown}
                    onClear={handleClear}
                />

                {/* 2. Dropdown Menu Subcomponent */}
                <DropdownMenu
                    isOpen={isOpen}
                    searchable={searchable}
                    searchInputRef={searchInputRef}
                    searchQuery={searchQuery}
                    onSearchChange={(e) => {
                        setSearchQuery(e.target.value);
                        setFocusedIndex(0);
                    }}
                    disabled={disabled}
                    listRef={listRef}
                    maxHeight={maxHeight}
                    filteredOptions={filteredOptions}
                    selectedValue={value}
                    focusedIndex={focusedIndex}
                    renderOption={renderOption}
                    onOptionClick={handleOptionClick}
                />
            </div>
            {error && <span className="shared-dropdown-error-message">{error}</span>}
        </div>
    );
}

export default Dropdown;
