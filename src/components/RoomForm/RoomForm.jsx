import React, { useState, useEffect } from 'react';
import { createRoom, updateRoom, uploadRoomImages } from '../../services/roomService';
import { showToast } from '../../utils/notifications';
import { ConfirmationModal } from '../Modal/Modal';

/**
 * RoomForm component for adding/editing rooms (Admin only)
 * Handles both create and update operations for hotel rooms
 * Now integrated with backend API for room creation and image uploads
 * 
 * @param {Object} room - Existing room data for editing (null for new room)
 * @param {Function} onSubmit - Callback when form is submitted successfully
 * @param {Function} onCancel - Callback when form is cancelled
 */
function RoomForm({ room, onSubmit, onCancel }) {
  // Form state with default values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: ''
  });

  // Image upload state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save confirmation modal state
  const [saveModal, setSaveModal] = useState({
    isOpen: false,
    formData: null
  });

  // Populate form with existing room data when editing
  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        description: room.description || '',
        price: room.price || '',
        capacity: room.capacity || ''
      });

      // Set existing image previews if editing
      if (room.images && room.images.length > 0) {
        setImagePreviews(room.images.map(img => img.url || img));
      }
    }
  }, [room]);

  /**
   * Handle image file selection
   * @param {Event} e - File input change event
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    // Limit to 6 images total
    const limitedFiles = validFiles.slice(0, 6);
    setImageFiles(limitedFiles);

    // Create preview URLs
    const previewUrls = limitedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  /**
   * Remove an image from selection
   * @param {number} index - Index of image to remove
   */
  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare room data
    const roomData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      images: imageFiles // Include image files for new room creation
    };

    // Show confirmation modal
    setSaveModal({
      isOpen: true,
      formData: roomData
    });
  };

  /**
   * Confirm and execute the save operation
   */
  const confirmSave = async () => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (room) {
        // Update existing room
        result = await updateRoom(room.id, saveModal.formData);
        
        // Upload images separately for existing room
        if (imageFiles.length > 0) {
          try {
            await uploadRoomImages(room.id, imageFiles);
            showToast.success('Room and images updated successfully');
          } catch (uploadError) {
            console.error('Image upload failed:', uploadError);
            showToast.error('Room updated but image upload failed. Please try uploading images again.');
          }
        } else {
          showToast.success('Room updated successfully');
        }
      } else {
        // Create new room with images
        result = await createRoom(saveModal.formData);
        showToast.success('Room created successfully');
      }

      // Clean up preview URLs
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      onSubmit(result);
    } catch (error) {
      console.error('Room operation failed:', error);
      showToast.error(error.message || 'Failed to save room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Room Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            maxLength={100}
            placeholder="e.g., Deluxe King Room"
            disabled={isSubmitting}
          />
        </div>

        {/* Room capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity (Guests) *
          </label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
            required
            placeholder="e.g., 2"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Room description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          required
          placeholder="Describe the room and its amenities..."
          disabled={isSubmitting}
        />
      </div>

      {/* Room price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per Night (₱) *
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          step="0.01"
          required
          placeholder="e.g., 1000.00"
          disabled={isSubmitting}
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Images {!room && '*'}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="images"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload images</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Room preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : room ? 'Update Room' : 'Create Room'}
        </button>
      </div>

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        isOpen={saveModal.isOpen}
        onClose={() => setSaveModal({ isOpen: false, formData: null })}
        onConfirm={confirmSave}
        title={room ? 'Update Room' : 'Create Room'}
        message={`Are you sure you want to ${room ? 'update' : 'create'} "${saveModal.formData?.name}"?`}
        confirmText={room ? 'Update' : 'Create'}
        cancelText="Cancel"
        type="info"
      />
    </form>
  );
}

export default RoomForm;