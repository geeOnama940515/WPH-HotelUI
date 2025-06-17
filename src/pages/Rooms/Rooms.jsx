import React, { useState, useMemo, useEffect } from 'react';
import RoomCard from '../../components/RoomCard/RoomCard';
import RoomFilter from '../../components/RoomFilter/RoomFilter';
import { getRooms } from '../../services/roomService';

function Rooms() {
  const [filters, setFilters] = useState({
    price: '',
    capacity: '',
    sort: 'price-asc'
  });
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load rooms from API
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // Apply price filter
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      result = result.filter(room => {
        if (max) {
          return room.price >= min && room.price <= max;
        }
        return room.price >= min;
      });
    }

    // Apply capacity filter
    if (filters.capacity) {
      const [min, max] = filters.capacity.split('-').map(Number);
      result = result.filter(room => {
        if (max) {
          return room.capacity >= min && room.capacity <= max;
        }
        return room.capacity >= min;
      });
    }

    // Apply sorting
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'capacity-asc':
        result.sort((a, b) => a.capacity - b.capacity);
        break;
      case 'capacity-desc':
        result.sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        break;
    }

    return result;
  }, [rooms, filters]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Rooms</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg">Loading rooms...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Rooms</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={loadRooms}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Rooms</h1>
      <RoomFilter onFilterChange={handleFilterChange} />
      
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No rooms match your current filters.</p>
          <button
            onClick={() => setFilters({ price: '', capacity: '', sort: 'price-asc' })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;