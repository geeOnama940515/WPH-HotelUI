import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RoomCard component displays room information in a card format
 * Used in the rooms listing page to show available rooms
 * Now supports API data structure with images array (array of objects with fileName)
 * 
 * @param {Object} room - Room object with details
 * @param {string} room.id - Room ID
 * @param {string} room.name - Room name
 * @param {string} room.description - Room description
 * @param {number} room.price - Room price per night
 * @param {Array} room.images - Array of room images (each with fileName)
 * @param {number} room.capacity - Maximum number of guests
 */
function RoomCard({ room }) {
  const { id, name, description, price, images, capacity } = room;

  // Get the primary image (first image's fileName or fallback)
  let primaryImage = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
  if (images && images.length > 0 && images[0].fileName) {
    // If your backend serves images at a specific path, update the URL below:
    primaryImage = `/images/rooms/${images[0].fileName}`;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Room image */}
      <img 
        src={primaryImage} 
        alt={name} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
        }}
      />
      
      {/* Room information */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        {/* Price and capacity information */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">₱{price?.toLocaleString()}/night</span>
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

export default RoomCard;