/**
 * Mock room data for development and testing
 * In production, this data would come from the database via API calls
 * 
 * Each room object contains:
 * - id: Unique identifier
 * - name: Room type name
 * - description: Room description
 * - price: Price per night in Philippine Peso
 * - image: Primary room image URL (for backward compatibility)
 * - image1-image6: Multiple room images for gallery
 * - capacity: Maximum number of guests
 */
export const rooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    description: "Spacious room with king-size bed and city view",
    price: 9950,
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", // Primary image (backward compatibility)
    image1: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", // Primary image
    image2: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg", // Bathroom
    image3: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg", // Room view
    image4: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg", // Amenities
    image5: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", // Balcony
    image6: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg", // Night view
    capacity: 2
  },
  {
    id: 2,
    name: "Executive Suite",
    description: "Luxury suite with separate living area",
    price: 14950,
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", // Primary image (backward compatibility)
    image1: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", // Primary image
    image2: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg", // Living area
    image3: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg", // Bedroom
    image4: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg", // Bathroom
    image5: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", // Dining area
    image6: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg", // Balcony
    capacity: 3
  },
  {
    id: 3,
    name: "Family Room",
    description: "Perfect for families with two queen beds",
    price: 12450,
    image: "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg", // Primary image (backward compatibility)
    image1: "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg", // Primary image
    image2: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg", // Second bed area
    image3: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg", // Family seating
    image4: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg", // Bathroom
    image5: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", // Play area
    image6: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg", // Window view
    capacity: 4
  }
];

/**
 * Helper function to get all images for a room
 * @param {Object} room - Room object
 * @returns {Array} Array of image URLs
 */
export const getRoomImages = (room) => {
  const images = [];
  
  // Add all available images in order
  if (room.image1) images.push(room.image1);
  if (room.image2) images.push(room.image2);
  if (room.image3) images.push(room.image3);
  if (room.image4) images.push(room.image4);
  if (room.image5) images.push(room.image5);
  if (room.image6) images.push(room.image6);
  
  // Fallback to old image field if no new images
  if (images.length === 0 && room.image) {
    images.push(room.image);
  }
  
  return images;
};

/**
 * Helper function to get the primary image for a room
 * @param {Object} room - Room object
 * @returns {string} Primary image URL
 */
export const getPrimaryRoomImage = (room) => {
  return room.image1 || room.image || '';
};