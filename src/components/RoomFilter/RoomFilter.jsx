import React from 'react';

/**
 * RoomFilter component provides filtering and sorting options for rooms
 * Allows users to filter by price, capacity, and sort results
 * 
 * @param {Function} onFilterChange - Callback function when filter changes
 */
function RoomFilter({ onFilterChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Price range filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <select
            onChange={(e) => onFilterChange('price', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Prices</option>
            <option value="0-10000">Under ₱10,000</option>
            <option value="10000-15000">₱10,000 - ₱15,000</option>
            <option value="15000+">Above ₱15,000</option>
          </select>
        </div>

        {/* Capacity filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity</label>
          <select
            onChange={(e) => onFilterChange('capacity', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Any Capacity</option>
            <option value="1-2">1-2 Guests</option>
            <option value="3-4">3-4 Guests</option>
            <option value="5+">5+ Guests</option>
          </select>
        </div>

        {/* Sort options */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="capacity-asc">Capacity: Low to High</option>
            <option value="capacity-desc">Capacity: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default RoomFilter;