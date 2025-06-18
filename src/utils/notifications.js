import toast from 'react-hot-toast';

/**
 * Toast notification utilities
 */
export const showToast = {
  // Success notification
  success: (message) => {
    toast.success(message, {
      id: `success-${Date.now()}`,
    });
  },

  // Error notification
  error: (message) => {
    toast.error(message, {
      id: `error-${Date.now()}`,
    });
  },

  // Info notification
  info: (message) => {
    toast(message, {
      id: `info-${Date.now()}`,
      icon: 'ℹ️',
    });
  },

  // Warning notification
  warning: (message) => {
    toast(message, {
      id: `warning-${Date.now()}`,
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
    });
  },

  // Loading notification
  loading: (message) => {
    return toast.loading(message, {
      id: `loading-${Date.now()}`,
    });
  },

  // Dismiss specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Common toast messages for the hotel app
 */
export const toastMessages = {
  // Authentication
  loginSuccess: 'Successfully logged in!',
  loginError: 'Login failed. Please check your credentials.',
  logoutSuccess: 'Successfully logged out!',
  registerSuccess: 'Account created successfully!',
  registerError: 'Registration failed. Please try again.',
  
  // Bookings
  bookingCreated: 'Booking created successfully!',
  bookingUpdated: 'Booking updated successfully!',
  bookingCancelled: 'Booking cancelled successfully!',
  bookingError: 'Failed to process booking. Please try again.',
  
  // Rooms
  roomAdded: 'Room added successfully!',
  roomUpdated: 'Room updated successfully!',
  roomDeleted: 'Room deleted successfully!',
  roomError: 'Failed to process room. Please try again.',
  
  // General
  formError: 'Please fill in all required fields.',
  networkError: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  serverError: 'Server error. Please try again later.',
};

/**
 * Confirmation dialog helper
 * Returns a promise that resolves to true if confirmed, false if cancelled
 */
export const confirmAction = (message, title = 'Confirm Action') => {
  return new Promise((resolve) => {
    // Create a custom modal element
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container modal-md">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close-btn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-content">
          <p>${message}</p>
        </div>
        <div class="modal-actions">
          <button class="modal-btn modal-btn-secondary" id="cancel-btn">Cancel</button>
          <button class="modal-btn modal-btn-primary" id="confirm-btn">Confirm</button>
        </div>
      </div>
    `;

    // Add event listeners
    const confirmBtn = modal.querySelector('#confirm-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    const closeBtn = modal.querySelector('.modal-close-btn');

    const cleanup = () => {
      document.body.removeChild(modal);
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const handleBackdropClick = (e) => {
      if (e.target === modal) {
        handleCancel();
      }
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    closeBtn.addEventListener('click', handleCancel);
    modal.addEventListener('click', handleBackdropClick);

    // Add to DOM
    document.body.appendChild(modal);
  });
};

/**
 * Common confirmation messages
 */
export const confirmMessages = {
  deleteBooking: 'Are you sure you want to cancel this booking? This action cannot be undone.',
  deleteRoom: 'Are you sure you want to delete this room? This action cannot be undone.',
  logout: 'Are you sure you want to log out?',
  discardChanges: 'Are you sure you want to discard your changes?',
  leavePage: 'You have unsaved changes. Are you sure you want to leave this page?',
}; 