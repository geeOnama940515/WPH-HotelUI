import React, { useState, useMemo } from 'react';
import RoomCard from '../../components/RoomCard/RoomCard';
import RoomFilter from '../../components/RoomFilter/RoomFilter';
import { rooms } from '../../data/roomsData';

function Rooms() {
  const [filters, setFilters] = useState({
    price: '',
    capacity: '',
    sort: 'price-asc'
  });

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
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Rooms</h1>
      <RoomFilter onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

export default Rooms;