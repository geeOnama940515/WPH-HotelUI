import React from 'react';
import { Link } from 'react-router-dom';

function RoomCard({ room }) {
  const { id, name, description, price, image, capacity } = room;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">₱{price.toLocaleString()}/night</span>
          <span className="text-gray-500">Up to {capacity} guests</span>
        </div>
        <Link 
          to={`/booking?room=${id}`}
          state={{ selectedRoom: room }}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}