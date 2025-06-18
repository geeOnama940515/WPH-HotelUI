import React, { useState, useEffect } from 'react';
import { createRoom, updateRoom, uploadRoomImages } from '../../services/roomService';

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

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');

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
        alert('Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
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
    setError('');
    setIsSubmitting(true);
    
    try {
      // Prepare room data
      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      };

      let result;
      
      if (room) {
        // Update existing room
        result = await updateRoom(room.id, roomData);
      } else {
        // Create new room
        result = await createRoom(roomData);
      }

      // Upload images if any are selected
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        try {
          await uploadRoomImages(result.id || room?.id, imageFiles);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Provide more specific error message
          const errorMessage = uploadError.message || 'Unknown upload error';
          if (errorMessage.includes('Unexpected end of JSON input')) {
            alert('Room saved successfully, but there was an issue with the image upload response. The images may not have been uploaded properly. You can try uploading images again.');
          } else {
            alert(`Room saved successfully, but image upload failed: ${errorMessage}. You can try uploading images again.`);
          }
        } finally {
          setUploadingImages(false);
        }
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
      setError(error.message || 'Failed to save room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          maxLength={1000}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe the room features, amenities, and what makes it special..."
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description.length}/1000 characters
        </p>
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
          min="0.01"
          step="0.01"
          required
          placeholder="e.g., 9950.00"
          disabled={isSubmitting}
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Room Images (Optional)
        </label>
        
        {/* File input */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-600 mt-2">
            Select up to 6 images. Supported formats: JPG, PNG, WebP (max 5MB each)
          </p>
        </div>

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  ×
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {index === 0 ? 'Primary' : `Image ${index + 1}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form action buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
          disabled={isSubmitting || uploadingImages}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || uploadingImages}
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{room ? 'Updating...' : 'Creating...'}</span>
            </span>
          ) : uploadingImages ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Uploading Images...</span>
            </span>
          ) : (
            room ? 'Update Room' : 'Create Room'
          )}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;