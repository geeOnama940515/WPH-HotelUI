import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { showToast, confirmAction } from '../../utils/notifications';

/**
 * Example component demonstrating Modal usage
 * This component shows different ways to use the Modal component
 */
function ExampleModal() {
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLargeModal, setShowLargeModal] = useState(false);
  const [showNoActionsModal, setShowNoActionsModal] = useState(false);

  const handleConfirmAction = () => {
    showToast.success('Action confirmed!');
  };

  const handleDeleteItem = async () => {
    const confirmed = await confirmAction(
      'Are you sure you want to delete this item? This action cannot be undone.',
      'Confirm Deletion'
    );
    
    if (confirmed) {
      showToast.success('Item deleted successfully!');
    } else {
      showToast.info('Deletion cancelled');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Modal Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Simple Modal */}
        <button
          onClick={() => setShowSimpleModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Simple Modal
        </button>

        {/* Confirmation Modal */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Confirmation Modal
        </button>

        {/* Large Modal */}
        <button
          onClick={() => setShowLargeModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Large Modal
        </button>

        {/* No Actions Modal */}
        <button
          onClick={() => setShowNoActionsModal(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Info Modal
        </button>

        {/* Promise-based Confirmation */}
        <button
          onClick={handleDeleteItem}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Promise Confirmation
        </button>
      </div>

      {/* Simple Modal */}
      <Modal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
        title="Simple Modal"
        confirmText="OK"
        cancelText="Cancel"
        onConfirm={() => {
          showToast.success('Simple modal confirmed!');
          setShowSimpleModal(false);
        }}
      >
        <p className="text-gray-600">
          This is a simple modal with basic content. You can customize the title, 
          content, and action buttons as needed.
        </p>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Action"
        confirmText="Yes, Proceed"
        cancelText="No, Cancel"
        onConfirm={handleConfirmAction}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to proceed with this action? This will make 
            permanent changes to your data.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ This action cannot be undone once confirmed.
            </p>
          </div>
        </div>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={showLargeModal}
        onClose={() => setShowLargeModal(false)}
        title="Large Content Modal"
        confirmText="Save Changes"
        cancelText="Discard"
        size="lg"
        onConfirm={() => {
          showToast.success('Changes saved successfully!');
          setShowLargeModal(false);
        }}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This modal demonstrates how to display larger content with more complex layouts.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Section 1</h4>
              <p className="text-sm text-gray-600">
                This is the first section of content in the large modal.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Section 2</h4>
              <p className="text-sm text-gray-600">
                This is the second section of content in the large modal.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-800 text-sm">
              💡 Tip: Large modals are great for forms, detailed information, 
              or complex user interactions.
            </p>
          </div>
        </div>
      </Modal>

      {/* No Actions Modal */}
      <Modal
        isOpen={showNoActionsModal}
        onClose={() => setShowNoActionsModal(false)}
        title="Information"
        showActions={false}
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">ℹ️</div>
          <p className="text-gray-600">
            This is an informational modal without action buttons. 
            Users can only close it using the X button or by clicking outside.
          </p>
          <button
            onClick={() => setShowNoActionsModal(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ExampleModal; 