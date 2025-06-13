import React, { useState, useEffect } from 'react';

/**
 * RoomForm component for adding/editing rooms (Admin only)
 * Handles both create and update operations for hotel rooms
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
    image: '',
    status: 'available'
  });

  // Populate form with existing room data when editing
  useEffect(() => {
    if (room) {
      setFormData(room);
    }
  }, [room]);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to numbers for price and capacity
    onSubmit({
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Room name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Room Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Room description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Room price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price per Night (₱)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          required
        />
      </div>

      {/* Room capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Capacity (Guests)</label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          required
        />
      </div>

      {/* Room image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Room status */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Form action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {room ? 'Update Room' : 'Add Room'}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;