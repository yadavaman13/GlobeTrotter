import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';
import ModalTabNav from './subcomponents/ModalTabNav';
import ModalBanner from './subcomponents/ModalBanner';
import OptionGrid from './subcomponents/OptionGrid';
import OptionCardItem from './subcomponents/OptionCardItem';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Textarea from '@/components/Shared/Form/Textarea/Textarea';
import './TabSwitchModal.scss';

// Generic Default Tabs
const DEFAULT_TABS = [
    { id: 'general', label: 'General' },
    { id: 'preferences', label: 'Preferences' },
];

const GENERIC_OPTIONS_PRIMARY = [
    { id: 'opt-1', title: 'Option 1', subtitle: 'Subtitle detail A' },
    { id: 'opt-2', title: 'Option 2', subtitle: 'Subtitle detail B' },
    { id: 'opt-3', title: 'Option 3', subtitle: 'Subtitle detail C' },
    { id: 'opt-4', title: 'Option 4', subtitle: 'Subtitle detail D' },
    { id: 'opt-5', title: 'Option 5', subtitle: 'Subtitle detail E' },
];

const GENERIC_OPTIONS_SECONDARY = [
    { id: 'opt-6', title: 'Option 6', subtitle: 'Subtitle detail F' },
    { id: 'opt-7', title: 'Option 7', subtitle: 'Subtitle detail G' },
    { id: 'opt-8', title: 'Option 8', subtitle: 'Subtitle detail H' },
    { id: 'opt-9', title: 'Option 9', subtitle: 'Subtitle detail I' },
    { id: 'opt-10', title: 'Option 10', subtitle: 'Subtitle detail J' },
];

/**
 * TabSwitchModal — Clean, modular tab switch modal component matching exact layout,
 * background color (#ffffff main, #f7f7f7 callout banner), border radius (28px/32px),
 * spacing, roundness, and reusing shared components.
 */
function TabSwitchModal({
    isOpen = false,
    onClose,
    tabs = DEFAULT_TABS,
    activeTab: controlledActiveTab,
    onTabChange: controlledOnTabChange,
    featureEnabled: controlledFeature,
    onFeatureToggle: controlledOnFeatureToggle,
    selectedOption: controlledSelectedOpt = 'opt-1',
    onSelectOption,
    closeOnBackdrop = true,
    className = '',
    children,
}) {
    // Internal fallback states for uncontrolled usage
    const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || 'general');
    const [internalFeature, setInternalFeature] = useState(true);
    const [internalSelectedOpt, setInternalSelectedOpt] = useState('opt-1');
    const [workspaceName, setWorkspaceName] = useState('');
    const [primaryEmail, setPrimaryEmail] = useState('');
    const [customNotes, setCustomNotes] = useState('');

    const currentTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
    const isFeatureOn = controlledFeature !== undefined ? controlledFeature : internalFeature;
    const activeOptId =
        controlledSelectedOpt !== undefined ? controlledSelectedOpt : internalSelectedOpt;

    // Handle body overflow locking
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle ESC key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose && onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleTabSwitch = (tabId) => {
        if (controlledOnTabChange) {
            controlledOnTabChange(tabId);
        } else {
            setInternalActiveTab(tabId);
        }
    };

    const handleFeatureToggle = (val) => {
        if (controlledOnFeatureToggle) {
            controlledOnFeatureToggle(val);
        } else {
            setInternalFeature(val);
        }
    };

    const handleOptionSelect = (optId) => {
        if (onSelectOption) {
            onSelectOption(optId);
        } else {
            setInternalSelectedOpt(optId);
        }
    };

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target.classList.contains('tab-modal-overlay')) {
            onClose && onClose();
        }
    };

    const modalMarkup = (
        <div className="tab-modal-overlay" onClick={handleBackdropClick} role="presentation">
            <div className={`tab-modal-card ${className}`} role="dialog" aria-modal="true">
                {/* Modal Top Header with Close Button */}
                <div className="tab-modal-header">
                    <button
                        type="button"
                        className="tab-modal-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={18} strokeWidth={2.2} />
                    </button>
                </div>

                {/* Tab Navigation Header */}
                <ModalTabNav tabs={tabs} activeTab={currentTab} onTabChange={handleTabSwitch} />

                {/* Scrollable Modal Content Body */}
                <div className="tab-modal-body">
                    {children ? (
                        children
                    ) : currentTab === 'general' ? (
                        <>
                            {/* Feature Callout Banner */}
                            <ModalBanner
                                icon={<Sparkles size={20} />}
                                title="Feature Settings"
                                subtitle="Configure global workspace preferences and options."
                                checked={isFeatureOn}
                                onToggle={handleFeatureToggle}
                            />

                            {/* Section 1: Options Grid */}
                            <section className="tab-modal-section">
                                <h3 className="section-title">General Options</h3>
                                <OptionGrid columns={5}>
                                    {GENERIC_OPTIONS_PRIMARY.map((opt) => (
                                        <OptionCardItem
                                            key={opt.id}
                                            title={opt.title}
                                            subtitle={opt.subtitle}
                                            isActive={activeOptId === opt.id}
                                            onClick={() => handleOptionSelect(opt.id)}
                                        />
                                    ))}
                                </OptionGrid>
                            </section>

                            {/* Section 2: Input Fields */}
                            <section className="tab-modal-section">
                                <h3 className="section-title">Form Input Fields</h3>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                        gap: '16px',
                                    }}
                                >
                                    <InputField
                                        label="Workspace Name"
                                        placeholder="Enter workspace name..."
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                    />
                                    <InputField
                                        label="Primary Email"
                                        placeholder="admin@company.com"
                                        value={primaryEmail}
                                        onChange={(e) => setPrimaryEmail(e.target.value)}
                                    />
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            {/* Preferences Tab Content */}
                            <section className="tab-modal-section">
                                <h3 className="section-title">Display Preferences</h3>
                                <OptionGrid columns={5}>
                                    {GENERIC_OPTIONS_SECONDARY.map((opt) => (
                                        <OptionCardItem
                                            key={opt.id}
                                            title={opt.title}
                                            subtitle={opt.subtitle}
                                            isActive={activeOptId === opt.id}
                                            onClick={() => handleOptionSelect(opt.id)}
                                        />
                                    ))}
                                </OptionGrid>
                            </section>

                            <section className="tab-modal-section">
                                <h3 className="section-title">Custom Notes & Configuration</h3>
                                <Textarea
                                    label="Additional Notes"
                                    placeholder="Type custom configuration or notes here..."
                                    value={customNotes}
                                    onChange={(e) => setCustomNotes(e.target.value)}
                                    rows={4}
                                />
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalMarkup, document.body);
}

export default TabSwitchModal;
