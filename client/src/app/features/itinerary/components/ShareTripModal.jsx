import { useState } from 'react';
import { X, Globe, Lock, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { useToast } from '@/components/Shared/Feedback/Toast';

export function ShareTripModal({ isOpen, onClose, trip, onToggleVisibility }) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [updating, setUpdating] = useState(false);

    if (!isOpen || !trip) return null;

    const isPublic = trip.visibility === 'public';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/share/${trip.publicSlug || trip.id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast({ type: 'success', message: 'Public itinerary link copied to clipboard!' });
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy share link:', err);
        }
    };

    const handleVisibilityChange = async () => {
        setUpdating(true);
        try {
            const next = isPublic ? 'private' : 'public';
            await onToggleVisibility(trip.id, next);
            toast({
                type: 'success',
                message: `Trip visibility set to ${next.toUpperCase()}`,
            });
        } catch (err) {
            console.error('Visibility update error:', err);
            toast({ type: 'error', message: 'Failed to update trip visibility' });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="modal-backdrop-scrim" onClick={onClose}>
            <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-dialog-header">
                    <div className="share-modal-title">
                        <Share2 size={20} className="share-icon" />
                        <h3 className="modal-dialog-title">Share Itinerary</h3>
                    </div>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal-dialog-body">
                    {/* Visibility Switcher Card */}
                    <div className="visibility-toggle-box">
                        <div className="visibility-info">
                            <div className="visibility-icon-badge">
                                {isPublic ? <Globe size={22} /> : <Lock size={22} />}
                            </div>
                            <div>
                                <h4 className="visibility-heading">
                                    {isPublic ? 'Public Itinerary' : 'Private Itinerary'}
                                </h4>
                                <p className="visibility-desc">
                                    {isPublic
                                        ? 'Anyone with the link can view and clone this trip.'
                                        : 'Only you and invited collaborators have access.'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={`toggle-switch-btn ${isPublic ? 'active' : ''}`}
                            onClick={handleVisibilityChange}
                            disabled={updating}
                        >
                            <span className="toggle-thumb" />
                        </button>
                    </div>

                    {/* Share Link Box (Visible when public) */}
                    {isPublic ? (
                        <div className="share-link-section">
                            <label className="field-label">Public Itinerary Link</label>
                            <div className="link-input-group">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="share-link-input"
                                />
                                <button
                                    type="button"
                                    className="copy-link-btn"
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>

                            <div className="share-link-preview-row">
                                <a
                                    href={shareUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="open-public-view-link"
                                >
                                    <ExternalLink size={14} />
                                    <span>Open Public Preview</span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="make-public-callout">
                            <p>
                                Enable public sharing to generate a shareable link with "Copy Trip"
                                support for friends and judges.
                            </p>
                            <button
                                type="button"
                                className="make-public-cta"
                                onClick={handleVisibilityChange}
                                disabled={updating}
                            >
                                <Globe size={16} /> Make Itinerary Public
                            </button>
                        </div>
                    )}
                </div>

                <div className="modal-dialog-footer">
                    <button type="button" className="cancel-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShareTripModal;
