import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RoomCard component displays room information in a card format
 * Used in the rooms listing page to show available rooms
 * 
 * @param {Object} room - Room object with details
 * @param {number} room.id - Room ID
 * @param {string} room.name - Room name
 * @param {string} room.description - Room description
 * @param {number} room.price - Room price per night
 * @param {string} room.image - Room image URL
 * @param {number} room.capacity - Maximum number of guests
 */
function RoomCard({ room }) {
  const { id, name, description, price, image, capacity } = room;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Room image */}
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      
      {/* Room information */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        {/* Price and capacity information */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">₱{price.toLocaleString()}/night</span>
          <span className="text-gray-500">Up to {capacity} guests</span>
        </div>
        
        {/* View details button - aligned to bottom of card */}
        <Link 
          to={`/room-details/${id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default RoomCard