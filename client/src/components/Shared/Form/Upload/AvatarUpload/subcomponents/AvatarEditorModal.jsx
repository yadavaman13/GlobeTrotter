import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CancelButton from '@/components/Shared/Buttons/CancelButton/CancelButton';
import SaveDetailsButton from '@/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton';
import AvatarEditorCanvas from './AvatarEditorCanvas';
import AvatarEditorControls from './AvatarEditorControls';

export default function AvatarEditorModal({
    isOpen,
    handleCancel,
    handleSave,
    canvasProps,
    controlProps,
}) {
    if (!isOpen) return null;

    return createPortal(
        <div className="avatar-editor-modal-overlay">
            <div className="avatar-editor-card">
                <div className="avatar-editor-header">
                    <h3 className="avatar-editor-title">Edit Profile Photo</h3>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={handleCancel}
                        aria-label="Close dialog"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="avatar-editor-body">
                    <AvatarEditorCanvas {...canvasProps} />
                    <AvatarEditorControls {...controlProps} />
                </div>

                <div className="avatar-editor-footer">
                    <CancelButton onClick={handleCancel} label="Cancel" />
                    <SaveDetailsButton onClick={handleSave} label="Apply & Save" size="md" />
                </div>
            </div>
        </div>,
        document.body,
    );
}
