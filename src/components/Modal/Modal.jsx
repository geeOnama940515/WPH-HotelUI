import React from 'react';
import { IoClose } from 'react-icons/io5';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  onConfirm,
  showActions = true,
  size = "md" // sm, md, lg, xl
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-container modal-${size}`}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="modal-actions">
            <button 
              onClick={onClose}
              className="modal-btn modal-btn-secondary"
            >
              {cancelText}
            </button>
            <button 
              onClick={handleConfirm}
              className="modal-btn modal-btn-primary"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 