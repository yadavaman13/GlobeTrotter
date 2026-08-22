import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';
import './Toast.scss';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message, type = 'info', duration = 4000) => {
            const id = `${Date.now()}-${Math.floor(performance.now() * 1000)}`;
            setToasts((prev) => [...prev, { id, message, type, duration }]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }

            return id;
        },
        [removeToast],
    );

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {toasts.length > 0 && (
                <div className="shared-toast-container">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    // Return convenient helper methods for general states
    const toastFn = useCallback(
        (msgOrObj, type = 'info', duration) => {
            if (typeof msgOrObj === 'object' && msgOrObj !== null) {
                return context.addToast(
                    msgOrObj.message || msgOrObj.title || '',
                    msgOrObj.type || 'info',
                    msgOrObj.duration,
                );
            }
            return context.addToast(msgOrObj, type, duration);
        },
        [context],
    );

    const success = useCallback((msg, dur) => toastFn(msg, 'success', dur), [toastFn]);
    const error = useCallback((msg, dur) => toastFn(msg, 'error', dur), [toastFn]);
    const warning = useCallback((msg, dur) => toastFn(msg, 'warning', dur), [toastFn]);
    const info = useCallback((msg, dur) => toastFn(msg, 'info', dur), [toastFn]);

    return {
        toasts: context.toasts,
        toast: toastFn,
        showToast: toastFn,
        removeToast: context.removeToast,
        success,
        error,
        warning,
        info,
    };
}
