import React, { useState, useEffect } from 'react';
import { ToastContainer, Toast, Button } from 'react-bootstrap';
import { AlertCircle, RefreshCw, CheckCircle2, X } from 'lucide-react';

let toastSubscriber = null;

export const showToastNotification = (message, type = 'danger', duration = 4000) => {
  if (toastSubscriber) {
    toastSubscriber({ message, type, duration, id: Date.now() });
  }
};

const ToastNotification = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastSubscriber = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      if (newToast.duration > 0) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration);
      }
    };

    return () => {
      toastSubscriber = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContainer 
      position="bottom-start" 
      className="p-3 position-fixed bottom-0 start-0" 
      style={{ zIndex: 9999, maxWidth: '380px' }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => removeToast(toast.id)}
          className={`border-0 rounded-4 shadow-lg overflow-hidden mb-2 bg-${toast.type === 'danger' ? 'dark' : toast.type === 'success' ? 'success' : 'warning'} text-white`}
          style={{ backdropFilter: 'blur(10px)', border: toast.type === 'danger' ? '1px solid #ef4444' : 'none' }}
        >
          <Toast.Body className="d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center gap-2">
              {toast.type === 'danger' ? (
                <AlertCircle size={22} className="text-danger flex-shrink-0 animate-bounce" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 size={22} className="text-light flex-shrink-0" />
              ) : (
                <RefreshCw size={22} className="text-warning flex-shrink-0 animate-spin" />
              )}
              <span className="fw-bold small">{toast.message}</span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white ms-2" 
              onClick={() => removeToast(toast.id)} 
              aria-label="إغلاق"
            />
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastNotification;
