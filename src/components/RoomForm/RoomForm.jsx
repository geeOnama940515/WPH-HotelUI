import React, { useState, useEffect } from 'react';

/**
 * RoomForm component for adding/editing rooms (Admin only)
 * Handles both create and update operations for hotel rooms
 * Now supports file uploads for room images
 * 
 * @param {Object} room - Existing room data for editing (null for new room)
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onCancel - Callback when form is cancelled
 */
function RoomForm({ room, onSubmit, onCancel }) {
  // Form state with default values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    status: 'available'
  });

  // Image upload state
  const [imageFiles, setImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    image6: null
  });

  // Image preview URLs
  const [imagePreviews, setImagePreviews] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    image6: ''
  });

  // Loading state for image uploads
  const [uploadingImages, setUploadingImages] = useState(false);

  // Populate form with existing room data when editing
  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        description: room.description || '',
        price: room.price || '',
        capacity: room.capacity || '',
        status: room.status || 'available'
      });

      // Set existing image previews if editing
      setImagePreviews({
        image1: room.image1 || room.image || '', // Fallback to old 'image' field
        image2: room.image2 || '',
        image3: room.image3 || '',
        image4: room.image4 || '',
        image5: room.image5 || '',
        image6: room.image6 || ''
      });
    }
  }, [room]);

  /**
   * Handle image file selection
   * @param {Event} e - File input change event
   * @param {string} imageKey - Which image slot (image1, image2, etc.)
   */
  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Update file state
      setImageFiles(prev => ({
        ...prev,
        [imageKey]: file
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [imageKey]: previewUrl
      }));
    }
  };

  /**
   * Remove an image
   * @param {string} imageKey - Which image to remove
   */
  const removeImage = (imageKey) => {
    setImageFiles(prev => ({
      ...prev,
      [imageKey]: null
    }));
    setImagePreviews(prev => ({
      ...prev,
      [imageKey]: ''
    }));
  };

  /**
   * Upload images to backend
   * @returns {Object} Object containing uploaded image URLs
   */
  const uploadImages = async () => {
    const uploadedImages = {};
    setUploadingImages(true);

    try {
      for (const [key, file] of Object.entries(imageFiles)) {
        if (file) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('roomId', room?.id || 'new');
          formData.append('imageSlot', key);

          // Replace this with your actual upload endpoint
          const response = await fetch('/api/rooms/upload-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });

          if (response.ok) {
            const result = await response.json();
            uploadedImages[key] = result.imageUrl;
          } else {
            throw new Error(`Failed to upload ${key}`);
          }
        } else if (imagePreviews[key] && !imagePreviews[key].startsWith('blob:')) {
          // Keep existing image URL if no new file selected
          uploadedImages[key] = imagePreviews[key];
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload images. Please try again.');
      throw error;
    } finally {
      setUploadingImages(false);
    }

    return uploadedImages;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Upload images first
      const uploadedImages = await uploadImages();

      // Prepare room data with uploaded image URLs
      const roomData = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        ...uploadedImages
      };

      onSubmit(roomData);
    } catch (error) {
      // Error already handled in uploadImages
    }
  };

  /**
   * Render image upload slot
   * @param {string} imageKey - Image slot key
   * @param {number} slotNumber - Display number for the slot
   */
  const renderImageSlot = (imageKey, slotNumber) => (
    <div key={imageKey} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
      {imagePreviews[imageKey] ? (
        <div className="relative">
          <img
            src={imagePreviews[imageKey]}
            alt={`Room image ${slotNumber}`}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <button
            type="button"
            onClick={() => removeImage(imageKey)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
          <p className="text-sm text-gray-600">
            {slotNumber === 1 ? 'Primary Image' : `Image ${slotNumber}`}
          </p>
        </div>
      ) : (
        <div>
          <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">📷</span>
          </div>
          <label className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-800 font-medium">
              {slotNumber === 1 ? 'Upload Primary Image' : `Upload Image ${slotNumber}`}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, imageKey)}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {slotNumber === 1 ? 'Required - Main room image' : 'Optional - Additional gallery image'}
          </p>
        </div>
      )}
    </div>
  );

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
            placeholder="e.g., Deluxe King Room"
          />
        </div>

        {/* Room status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
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
          rows="3"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Describe the room features, amenities, and what makes it special..."
        />
      </div>

      {/* Price and capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="e.g., 9950"
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
            max="10"
            required
            placeholder="e.g., 2"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Room Images
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderImageSlot('image1', 1)}
          {renderImageSlot('image2', 2)}
          {renderImageSlot('image3', 3)}
          {renderImageSlot('image4', 4)}
          {renderImageSlot('image5', 5)}
          {renderImageSlot('image6', 6)}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p>• Primary image is required and will be used as the main room image</p>
          <p>• Additional images are optional and will be used in the room gallery</p>
          <p>• Supported formats: JPG, PNG, WebP (max 5MB each)</p>
          <p>• Recommended size: 1200x800 pixels for best quality</p>
        </div>
      </div>

      {/* Form action buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
          disabled={uploadingImages}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploadingImages}
        >
          {uploadingImages ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Uploading...</span>
            </span>
          ) : (
            room ? 'Update Room' : 'Add Room'
          )}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;