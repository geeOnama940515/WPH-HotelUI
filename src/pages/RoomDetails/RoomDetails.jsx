import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaWifi, FaTv, FaSnowflake, FaCoffee, FaBed, FaBath, FaUsers, FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';
import { getRoomById } from '../../services/roomService';

/**
 * RoomDetails component displays detailed information about a specific room
 * Features an auto-changing image gallery with manual controls
 * Now integrated with API to fetch room data
 * 
 * @returns {JSX.Element} Room details page with image gallery
 */
function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Room data state
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load room data from API
  useEffect(() => {
    loadRoom();
  }, [id]);

  const loadRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const roomData = await getRoomById(id);
      console.log('Room data received:', roomData);
      console.log('Room images:', roomData?.images);
      setRoom(roomData);
    } catch (error) {
      console.error('Failed to load room:', error);
      setError('Failed to load room details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get room images - handle both API structure and fallback
  const roomImages = room?.images && room.images.length > 0
    ? room.images.map(img => {
        console.log('Processing image:', img);
        const imageUrl = img.fileName ? `https://wph-backend.gregdoesdev.xyz/images/rooms/${img.fileName}` : img.url || img;
        console.log('Generated image URL:', imageUrl);
        return imageUrl;
      })
    : ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg']; // Fallback image

  // Auto-change images every 4 seconds
  useEffect(() => {
    if (!isAutoPlay || roomImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, roomImages.length]);

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
  }, [isModalOpen]);

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
   * Navigate between images
   * @param {string} direction - 'next' or 'prev'
   */
  const navigateImage = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    }
  };

  /**
   * Go to specific image
   * @param {number} index - Image index
   */
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  /**
   * Toggle auto-play functionality
   */
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  /**
   * Open image modal at current index
   */
  const openModal = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg">Loading room details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The room you're looking for doesn't exist."}</p>
            <div className="space-x-4">
              <Link
                to="/rooms"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Back to Rooms
              </Link>
              <button
                onClick={loadRoom}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
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
          {/* Auto-Changing Image Gallery */}
          <div className="relative">
            {/* Main image display */}
            <div className="relative h-96 md:h-[500px] overflow-hidden">
              <img
                src={roomImages[currentImageIndex]}
                alt={`${room.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
                onClick={openModal}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
                }}
              />
              
              {/* Image overlay with room info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
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

              {/* Navigation arrows - only show if multiple images */}
              {roomImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                  >
                    <FaChevronRight size={20} />
                  </button>

                  {/* Auto-play control */}
                  <button
                    onClick={toggleAutoPlay}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                    title={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isAutoPlay ? <FaPause size={16} /> : <FaPlay size={16} />}
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg">
                {currentImageIndex + 1} / {roomImages.length}
              </div>

              {/* Click to enlarge hint */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                Click to enlarge
              </div>
            </div>

            {/* Thumbnail navigation - only show if multiple images */}
            {roomImages.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {roomImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                      ₱{room.price?.toLocaleString()}
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
      </div>

      {/* Full-Screen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60 bg-black/50 p-2 rounded-full"
          >
            <FaTimes size={24} />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white z-60">
            <span className="bg-black/50 px-3 py-1 rounded-lg">
              {currentImageIndex + 1} / {roomImages.length}
            </span>
          </div>

          {/* Navigation buttons - only show if multiple images */}
          {roomImages.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 bg-black/50 p-3 rounded-full"
              >
                <FaChevronLeft size={24} />
              </button>

              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 bg-black/50 p-3 rounded-full"
              >
                <FaChevronRight size={24} />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="max-w-5xl max-h-[85vh] mx-4">
            <img
              src={roomImages[currentImageIndex]}
              alt={`${room.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
              }}
            />
          </div>

          {/* Image description */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="bg-black/50 px-4 py-2 rounded-lg">
              {room.name} - Gallery Image {currentImageIndex + 1}
            </p>
          </div>

          {/* Thumbnail navigation - only show if multiple images */}
          {roomImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto">
              {roomImages.map((image, index) => (
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
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoomDetails;