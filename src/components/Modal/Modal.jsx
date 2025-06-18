import React from 'react';
import './Modal.css';

/**
 * Modal component for displaying content in an overlay
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title (optional)
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl') - defaults to 'md'
 * @returns {JSX.Element|null} Modal component or null if not open
 */
export const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button 
              onClick={onClose}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Confirmation Modal component for delete/save confirmations
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onConfirm - Function to call when user confirms
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} props.cancelText - Text for cancel button (default: 'Cancel')
 * @param {string} props.type - Modal type ('danger', 'warning', 'info') - affects button colors
 * @returns {JSX.Element|null} Confirmation modal or null if not open
 */
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getButtonClasses = () => {
    switch (type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          cancel: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        };
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          cancel: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        };
      default:
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          cancel: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        };
    }
  };

  const buttonClasses = getButtonClasses();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${buttonClasses.cancel}`}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${buttonClasses.confirm}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 