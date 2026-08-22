import { useState, useEffect } from 'react';
import * as landingService from '../../landing/services/landing.service';

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
    const [postType, setPostType] = useState('activity');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTripId, setSelectedTripId] = useState('');
    const [selectedActivityId, setSelectedActivityId] = useState('');
    const [userTrips, setUserTrips] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                setFormError(null);

                const [tripsRes, activitiesRes] = await Promise.allSettled([
                    landingService.getTrips(),
                    landingService.getActivities({ limit: 20 }),
                ]);

                if (!isMounted) return;

                let hasTrips = false;
                if (tripsRes.status === 'fulfilled') {
                    const tripsList = tripsRes.value.trips || tripsRes.value.data?.trips || [];
                    setUserTrips(tripsList);
                    if (tripsList.length > 0) {
                        setSelectedTripId(tripsList[0].id);
                        hasTrips = true;
                    }
                }

                if (activitiesRes.status === 'fulfilled') {
                    const actsList =
                        activitiesRes.value.data?.activities ||
                        activitiesRes.value.activities ||
                        [];
                    setActivities(actsList);
                    if (actsList.length > 0) {
                        setSelectedActivityId(actsList[0].id);
                    }
                }

                // If user has no trips created yet, default tab to 'activity'
                if (hasTrips) {
                    setPostType('trip');
                } else {
                    setPostType('activity');
                }
            } catch (err) {
                console.error('Failed to load selection options for modal:', err);
            } finally {
                if (isMounted) setLoadingOptions(false);
            }
        };

        loadOptions();
        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!title.trim() || !content.trim()) {
            setFormError('Title and Experience Details are required');
            return;
        }

        if (postType === 'trip' && !selectedTripId) {
            setFormError('Please select a trip or switch to Activity Experience');
            return;
        }

        if (postType === 'activity' && !selectedActivityId) {
            setFormError('Please select an activity');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            postType,
            title: title.trim(),
            content: content.trim(),
        };

        // Only attach the FK when it is a real non-empty UUID
        if (postType === 'trip' && selectedTripId) {
            payload.tripId = selectedTripId;
        } else if (postType === 'activity' && selectedActivityId) {
            payload.activityId = selectedActivityId;
        }

        const success = await onSubmit(payload);
        setIsSubmitting(false);

        if (success) {
            setTitle('');
            setContent('');
            setFormError(null);
            onClose();
        } else {
            setFormError('Failed to publish post. Please check fields and try again.');
        }
    };

    const isButtonDisabled =
        isSubmitting ||
        !title.trim() ||
        !content.trim() ||
        (postType === 'trip' && !selectedTripId) ||
        (postType === 'activity' && !selectedActivityId);

    return (
        <div className="modal-backdrop">
            <div className="modal-card-box">
                <div className="modal-header-row">
                    <h3 className="modal-title">Share Your Experience</h3>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {formError && (
                    <div
                        style={{
                            color: '#ba0036',
                            fontSize: '14px',
                            marginBottom: '12px',
                            fontWeight: '500',
                        }}
                    >
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form-body">
                    <div className="form-field-group">
                        <label className="field-label">Experience Category</label>
                        <div className="type-toggle-pills">
                            <button
                                type="button"
                                className={`type-pill ${postType === 'trip' ? 'active' : ''}`}
                                onClick={() => setPostType('trip')}
                            >
                                <span className="material-symbols-outlined">map</span>
                                Trip Experience
                            </button>
                            <button
                                type="button"
                                className={`type-pill ${postType === 'activity' ? 'active' : ''}`}
                                onClick={() => setPostType('activity')}
                            >
                                <span className="material-symbols-outlined">hiking</span>
                                Activity Experience
                            </button>
                        </div>
                    </div>

                    {postType === 'trip' ? (
                        <div className="form-field-group">
                            <label className="field-label">Select Your Trip</label>
                            {loadingOptions ? (
                                <p style={{ fontSize: '14px', color: '#6A6A6A' }}>
                                    Loading your trips...
                                </p>
                            ) : userTrips.length > 0 ? (
                                <select
                                    className="input-text-field"
                                    value={selectedTripId}
                                    onChange={(e) => setSelectedTripId(e.target.value)}
                                    required
                                >
                                    {userTrips.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ fontSize: '14px', color: '#ba0036' }}>
                                    No trips found. Switch to &quot;Activity Experience&quot; above
                                    to select an activity.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="form-field-group">
                            <label className="field-label">Select Target Activity</label>
                            {loadingOptions ? (
                                <p style={{ fontSize: '14px', color: '#6A6A6A' }}>
                                    Loading activities...
                                </p>
                            ) : activities.length > 0 ? (
                                <select
                                    className="input-text-field"
                                    value={selectedActivityId}
                                    onChange={(e) => setSelectedActivityId(e.target.value)}
                                    required
                                >
                                    {activities.map((act) => (
                                        <option key={act.id} value={act.id}>
                                            {act.name} {act.city ? `(${act.city.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ fontSize: '14px', color: '#6A6A6A' }}>
                                    Loading available activities...
                                </p>
                            )}
                        </div>
                    )}

                    <div className="form-field-group">
                        <label className="field-label">Title</label>
                        <input
                            type="text"
                            className="input-text-field"
                            placeholder="e.g. Unforgettable Autumn Colors in Kyoto"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field-group">
                        <label className="field-label">Experience Details</label>
                        <textarea
                            className="textarea-field"
                            rows={4}
                            placeholder="Share highlights, tips, recommendations, or itinerary notes for fellow travelers..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-actions-row">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit-primary"
                            disabled={isButtonDisabled}
                            style={{
                                opacity: isButtonDisabled ? 0.6 : 1,
                                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Experience'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
