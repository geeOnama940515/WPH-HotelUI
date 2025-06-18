# Toast Notifications & Modal Dialogs Guide

This guide explains how to use the toast notifications and modal dialogs implemented in the WPH Hotel application.

## 🍞 Toast Notifications

Toast notifications provide user feedback for actions, errors, and information. They appear in the top-right corner of the screen.

### Basic Usage

```javascript
import { showToast, toastMessages } from '../utils/notifications';

// Success notification
showToast.success('Operation completed successfully!');

// Error notification
showToast.error('Something went wrong!');

// Info notification
showToast.info('Here is some information');

// Warning notification
showToast.warning('Please be careful!');

// Loading notification (returns toast ID for dismissal)
const loadingToast = showToast.loading('Processing...');
// Later, dismiss the loading toast
showToast.dismiss(loadingToast);
```

### Predefined Messages

The app includes common toast messages for consistency:

```javascript
import { toastMessages } from '../utils/notifications';

// Authentication messages
showToast.success(toastMessages.loginSuccess);
showToast.error(toastMessages.loginError);
showToast.success(toastMessages.logoutSuccess);
showToast.success(toastMessages.registerSuccess);

// Booking messages
showToast.success(toastMessages.bookingCreated);
showToast.success(toastMessages.bookingUpdated);
showToast.success(toastMessages.bookingCancelled);

// Room management messages
showToast.success(toastMessages.roomAdded);
showToast.success(toastMessages.roomUpdated);
showToast.success(toastMessages.roomDeleted);

// General messages
showToast.error(toastMessages.formError);
showToast.error(toastMessages.networkError);
showToast.error(toastMessages.unauthorized);
showToast.error(toastMessages.serverError);
```

### Toast Configuration

Toasts are configured globally in `App.jsx` with the following settings:

- **Position**: Top-right corner
- **Duration**: 4 seconds (default), 3 seconds (success), 5 seconds (error)
- **Styling**: Dark background with white text
- **Icons**: Success (green checkmark), Error (red X), Info (ℹ️), Warning (⚠️)

## 🪟 Modal Dialogs

Modal dialogs are used for confirmations, forms, and displaying important information that requires user attention.

### Basic Modal Usage

```javascript
import Modal from '../components/Modal/Modal';
import { useState } from 'react';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal Title"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          // Handle confirmation
          setShowModal(false);
        }}
      >
        <p>Modal content goes here...</p>
      </Modal>
    </>
  );
}
```

### Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Controls modal visibility |
| `onClose` | function | - | Called when modal should close |
| `title` | string | - | Modal title |
| `children` | ReactNode | - | Modal content |
| `confirmText` | string | "Confirm" | Text for confirm button |
| `cancelText` | string | "Cancel" | Text for cancel button |
| `onConfirm` | function | - | Called when confirm button is clicked |
| `showActions` | boolean | true | Whether to show action buttons |
| `size` | string | "md" | Modal size: "sm", "md", "lg", "xl" |

### Modal Sizes

- **sm**: 400px width
- **md**: 500px width (default)
- **lg**: 700px width
- **xl**: 900px width

### Modal Examples

#### Simple Confirmation Modal

```javascript
<Modal
  isOpen={showConfirmModal}
  onClose={() => setShowConfirmModal(false)}
  title="Confirm Action"
  confirmText="Yes, Delete"
  cancelText="Cancel"
  onConfirm={handleDelete}
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

#### Large Content Modal

```javascript
<Modal
  isOpen={showLargeModal}
  onClose={() => setShowLargeModal(false)}
  title="Edit Details"
  confirmText="Save Changes"
  cancelText="Discard"
  size="lg"
  onConfirm={handleSave}
>
  <div className="space-y-4">
    <p>Complex form or content here...</p>
    <div className="grid grid-cols-2 gap-4">
      {/* Form fields */}
    </div>
  </div>
</Modal>
```

#### Information Modal (No Actions)

```javascript
<Modal
  isOpen={showInfoModal}
  onClose={() => setShowInfoModal(false)}
  title="Information"
  showActions={false}
  size="sm"
>
  <div className="text-center">
    <p>This is an informational message.</p>
    <button onClick={() => setShowInfoModal(false)}>
      Got it!
    </button>
  </div>
</Modal>
```

## 🔄 Promise-based Confirmations

For simple confirmations without complex UI, you can use the promise-based `confirmAction` function:

```javascript
import { confirmAction, showToast } from '../utils/notifications';

const handleDelete = async () => {
  const confirmed = await confirmAction(
    'Are you sure you want to delete this item?',
    'Confirm Deletion'
  );
  
  if (confirmed) {
    // User confirmed
    showToast.success('Item deleted!');
  } else {
    // User cancelled
    showToast.info('Deletion cancelled');
  }
};
```

## 🎨 Styling

### Toast Styling

Toasts use a dark theme with:
- Background: `#363636`
- Text: White
- Border radius: 8px
- Padding: 16px
- Font size: 14px

### Modal Styling

Modals feature:
- Backdrop blur effect
- Smooth animations (fade in/out, slide in)
- Responsive design
- Modern shadow and border radius
- Hover effects on buttons

## 📱 Responsive Design

Both toasts and modals are fully responsive:

- **Toasts**: Automatically adjust position and size on mobile
- **Modals**: 
  - Mobile: Full width with reduced padding
  - Desktop: Fixed width based on size prop
  - Action buttons stack vertically on mobile

## 🔧 Best Practices

### Toast Notifications

1. **Keep messages concise** - Users scan toasts quickly
2. **Use appropriate types** - Success for positive actions, Error for problems
3. **Don't overuse** - Too many toasts can be annoying
4. **Clear loading states** - Use loading toasts for async operations

### Modal Dialogs

1. **Clear titles** - Users should understand the purpose immediately
2. **Descriptive content** - Explain what will happen
3. **Appropriate button text** - Use action-oriented text
4. **Handle all states** - Loading, success, error states
5. **Accessibility** - Modals support keyboard navigation and screen readers

## 🚀 Integration Examples

### Form Validation

```javascript
const validateForm = () => {
  if (!formData.email) {
    showToast.error('Email is required');
    return false;
  }
  if (!formData.password) {
    showToast.error('Password is required');
    return false;
  }
  return true;
};
```

### API Error Handling

```javascript
try {
  const result = await apiCall();
  showToast.success('Operation completed successfully!');
} catch (error) {
  showToast.error(error.message || 'Something went wrong');
}
```

### Confirmation Before Action

```javascript
const handleDeleteBooking = async () => {
  const confirmed = await confirmAction(
    'Are you sure you want to cancel this booking?',
    'Cancel Booking'
  );
  
  if (confirmed) {
    try {
      await cancelBooking(bookingId);
      showToast.success('Booking cancelled successfully');
    } catch (error) {
      showToast.error('Failed to cancel booking');
    }
  }
};
```

## 📁 File Structure

```
src/
├── components/
│   ├── Modal/
│   │   ├── Modal.jsx
│   │   └── Modal.css
│   └── ExampleModal/
│       └── ExampleModal.jsx
├── utils/
│   └── notifications.js
└── App.jsx (contains Toaster component)
```

This implementation provides a comprehensive notification and modal system that enhances user experience throughout the hotel booking application. 