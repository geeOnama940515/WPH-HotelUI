import React from 'react';
import { FaUsers, FaDollarSign, FaBed, FaCalendarCheck, FaArrowUp, FaChartLine, FaWifi } from 'react-icons/fa';
import { runAllApiTests } from '../../services/apiTest';

/**
 * Dashboard component for admin dashboard analytics
 */
function Dashboard({ rooms, dashboardStats, monthlyData, recentBookings, getStatusColor }) {
  /**
   * Test API connectivity and endpoints
   */
  const handleTestApi = async () => {
    console.log('Starting API connectivity test...');
    try {
      const results = await runAllApiTests();
      console.log('API test completed. Check console for detailed results.');
      
      // Show a summary alert
      const failedEndpoints = [
        ...results.roomResults.filter(r => !r.allowed),
        ...results.authResults.filter(r => !r.allowed)
      ];
      
      if (!results.connectivity) {
        alert('❌ API connectivity failed. Please check if your backend is running on https://wph-backend.gregdoesdev.xyz');
      } else if (failedEndpoints.length > 0) {
        alert(`⚠️ API connected but ${failedEndpoints.length} endpoints returned 405 Method Not Allowed. Check console for details.`);
      } else {
        alert('✅ API connectivity test passed! All endpoints are working.');
      }
    } catch (error) {
      console.error('API test failed:', error);
      alert('❌ API test failed. Check console for details.');
    }
  };

  return (
    <div className="space-y-6">
      {/* API Test Section */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">API Connectivity</h3>
            <p className="text-sm text-gray-600">Test your backend API connectivity and endpoints</p>
          </div>
          <button
            onClick={handleTestApi}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaWifi className="text-sm" />
            <span>Test API</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">₱{dashboardStats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <FaDollarSign className="text-2xl lg:text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">₱{dashboardStats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <FaChartLine className="text-2xl lg:text-3xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.totalBookings}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <FaCalendarCheck className="text-2xl lg:text-3xl text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.occupancyRate}%</p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
            <FaBed className="text-2xl lg:text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Room Status Overview */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Room Status Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Available Rooms</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {rooms.filter(room => room.status === 0).length}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Booked Rooms</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {rooms.filter(room => room.status === 1).length}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">Occupied Rooms</span>
            </div>
            <span className="text-lg font-bold text-red-600">
              {rooms.filter(room => room.status === 2).length}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">Maintenance Rooms</span>
            </div>
            <span className="text-lg font-bold text-yellow-600">
              {rooms.filter(room => room.status === 3).length}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="font-medium">Inactive Rooms</span>
            </div>
            <span className="text-lg font-bold text-gray-600">
              {rooms.filter(room => room.status === 4).length}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-sm">{booking.guestName}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{booking.roomName}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{booking.checkIn}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-semibold text-sm">₱{booking.totalAmount.toLocaleString()}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
          <FaUsers className="text-3xl lg:text-4xl text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold mb-2">Average Stay</h4>
          <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.averageStayDuration} days</p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
          <FaArrowUp className="text-3xl lg:text-4xl text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold mb-2">Growth Rate</h4>
          <p className="text-xl lg:text-2xl font-bold text-green-600">+12%</p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
          <FaCalendarCheck className="text-3xl lg:text-4xl text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold mb-2">This Month</h4>
          <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.monthlyBookings} bookings</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 