import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

/**
 * RoomsTable component for managing rooms
 */
function RoomsTable({ 
  rooms, 
  loading, 
  error, 
  handleEditRoom, 
  handleDeleteRoom, 
  handleRoomStatusChange, 
  getRoomStatusText 
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <button
          onClick={() => {
            handleEditRoom(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
        >
          Add New Room
        </button>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading rooms...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-sm">{room.name}</td>
                    <td className="px-4 lg:px-6 py-4 max-w-xs truncate text-sm hidden md:table-cell">{room.description}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">₱{room.price?.toLocaleString()}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{room.capacity}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <select
                        onChange={(e) => handleRoomStatusChange(room.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        value={room.status || 0}
                      >
                        <option value="0">Available</option>
                        <option value="1">Booked</option>
                        <option value="2">Occupied</option>
                        <option value="3">Maintenance</option>
                        <option value="4">Inactive</option>
                      </select>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm"
                        >
                          <FaEdit className="text-sm" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-900 text-sm"
                        >
                          <FaTrash className="text-sm" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {rooms.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">
              No rooms found. Add your first room to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoomsTable; 