/**
 * Mock room data for development and testing
 * In production, this data would come from the database via API calls
 * 
 * Each room object contains:
 * - id: Unique identifier
 * - name: Room type name
 * - description: Room description
 * - price: Price per night in Philippine Peso
 * - image: Room image URL from Pexels
 * - capacity: Maximum number of guests
 */
export const rooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    description: "Spacious room with king-size bed and city view",
    price: 9950,
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    capacity: 2
  },
  {
    id: 2,
    name: "Executive Suite",
    description: "Luxury suite with separate living area",
    price: 14950,
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    capacity: 3
  },
  {
    id: 3,
    name: "Family Room",
    description: "Perfect for families with two queen beds",
    price: 12450,
    image: "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg",
    capacity: 4
  }
];