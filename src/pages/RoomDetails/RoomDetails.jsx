import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaWifi, FaTv, FaSnowflake, FaCoffee, FaBed, FaBath, FaUsers, FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { rooms } from '../../data/roomsData';

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = rooms.find(r => r.id === parseInt(id));
  
  // Modal state for image gallery
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Parallax scroll state
  const [scrollY, setScrollY] = useState(0);

  // Additional room images (in a real app, these would come from your database)
  const additionalImages = [
    room?.image,
    "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
    "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"
  ].filter(Boolean); // Remove any undefined values

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, currentImageIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  /**
   * Open image modal at specific index
   * @param {number} index - Image index to display
   */
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  /**
   * Navigate between images in modal
   * @param {string} direction - 'next' or 'prev'
   */
  const navigateImage = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % additionalImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + additionalImages.length) % additionalImages.length);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
            <p className="text-gray-600 mb-6">The room you're looking for doesn't exist.</p>
            <Link
              to="/rooms"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Back to Rooms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: FaWifi, name: "Free WiFi" },
    { icon: FaTv, name: "Smart TV" },
    { icon: FaSnowflake, name: "Air Conditioning" },
    { icon: FaCoffee, name: "Coffee Maker" },
    { icon: FaBed, name: "Premium Bedding" },
    { icon: FaBath, name: "Private Bathroom" }
  ];

  const roomFeatures = [
    "King-size bed with premium linens",
    "City or garden view",
    "Work desk with ergonomic chair",
    "Mini refrigerator",
    "In-room safe",
    "Blackout curtains",
    "24/7 room service",
    "Daily housekeeping"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/rooms')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Rooms</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Parallax Room Images Gallery */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {/* Main parallax image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
              style={{ 
                backgroundImage: `url(${additionalImages[0]})`,
                transform: `translateY(${scrollY * 0.5}px)`,
                backgroundAttachment: 'fixed'
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            
            {/* Room title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h1 className="text-4xl font-bold mb-2">{room.name}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <FaUsers />
                  <span>Up to {room.capacity} guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaBed />
                  <span>King Size Bed</span>
                </div>
              </div>
            </div>

            {/* Click to view gallery indicator */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => openModal(0)}
                className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm"
              >
                View Gallery ({additionalImages.length} photos)
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {additionalImages.slice(1).map((image, index) => (
                <div 
                  key={index + 1} 
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openModal(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${room.name} - Image ${index + 2}`}
                    className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Room Information */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed">{room.description}</p>
                </div>

                {/* Room Features */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-4">Room Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roomFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <amenity.icon className="text-blue-600 text-xl" />
                        <span className="text-gray-700">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                    <div>• Complimentary breakfast</div>
                    <div>• Free parking</div>
                    <div>• Airport shuttle service</div>
                    <div>• Access to fitness center</div>
                    <div>• Swimming pool access</div>
                    <div>• Spa discounts</div>
                  </div>
                </div>
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₱{room.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600">per night</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Room Type</span>
                      <span className="font-medium">{room.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Check-in</span>
                      <span className="font-medium">3:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">12:00 PM</span>
                    </div>
                  </div>

                  <Link
                    to="/booking"
                    state={{ selectedRoom: room }}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold mb-3"
                  >
                    Book This Room
                  </Link>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Free cancellation up to 24 hours before check-in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Rooms Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms
              .filter(r => r.id !== room.id)
              .slice(0, 3)
              .map(similarRoom => (
                <div key={similarRoom.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={similarRoom.image}
                    alt={similarRoom.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{similarRoom.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{similarRoom.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold">₱{similarRoom.price.toLocaleString()}/night</span>
                      <span className="text-gray-500 text-sm">Up to {similarRoom.capacity} guests</span>
                    </div>
                    <Link
                      to={`/room-details/${similarRoom.id}`}
                      className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
          >
            <FaTimes size={24} />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white z-60">
            <span className="bg-black bg-opacity-50 px-3 py-1 rounded-lg">
              {currentImageIndex + 1} / {additionalImages.length}
            </span>
          </div>

          {/* Previous button */}
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60"
            disabled={additionalImages.length <= 1}
          >
            <FaChevronLeft size={32} />
          </button>

          {/* Next button */}
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60"
            disabled={additionalImages.length <= 1}
          >
            <FaChevronRight size={32} />
          </button>

          {/* Main image */}
          <div className="max-w-4xl max-h-[80vh] mx-4">
            <img
              src={additionalImages[currentImageIndex]}
              alt={`${room.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image description */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              {room.name} - Gallery Image {currentImageIndex + 1}
            </p>
          </div>

          {/* Thumbnail navigation */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto">
            {additionalImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;