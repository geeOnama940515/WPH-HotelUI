import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaUtensils, FaSpa, FaSwimmingPool, FaWifi, FaConciergeBell } from 'react-icons/fa';
import './Home.css';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-6">Welcome to WPH Hotel</h1>
            <p className="text-2xl mb-8">Experience unparalleled luxury in the heart of the city</p>
            <Link to="/rooms" className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold">
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Experience Luxury</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="feature-card">
            <FaBed className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Luxurious Rooms</h3>
            <p className="text-gray-600">
              Indulge in our meticulously designed rooms featuring premium bedding, stunning views, and modern amenities for the ultimate comfort.
            </p>
          </div>
          <div className="feature-card">
            <FaUtensils className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Fine Dining</h3>
            <p className="text-gray-600">
              Savor exquisite cuisine at our award-winning restaurants, offering a blend of local and international flavors crafted by master chefs.
            </p>
          </div>
          <div className="feature-card">
            <FaSpa className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Luxury Spa</h3>
            <p className="text-gray-600">
              Rejuvenate your body and soul at our world-class spa, offering a range of therapeutic treatments and massage services.
            </p>
          </div>
        </div>

        {/* Additional Amenities */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Premium Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <FaSwimmingPool className="text-2xl text-blue-600" />
              <span>Infinity Pool</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaWifi className="text-2xl text-blue-600" />
              <span>High-Speed WiFi</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaConciergeBell className="text-2xl text-blue-600" />
              <span>24/7 Concierge</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Luxury?</h2>
          <p className="text-xl text-gray-600 mb-8">Book your stay now and enjoy our exclusive offers</p>
          <Link to="/rooms" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
            <span>View Our Rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;