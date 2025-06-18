import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoomForm from '../../components/RoomForm/RoomForm';
import { getRooms, deleteRoom, updateRoomStatus } from '../../services/roomService';
import { runAllApiTests } from '../../services/apiTest';
import { FaUsers, FaDollarSign, FaBed, FaCalendarCheck, FaArrowUp, FaChartLine, FaWifi } from 'react-icons/fa';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for dashboard analytics
  const dashboardStats = {
    totalRevenue: 2450000,
    monthlyRevenue: 485000,
    totalBookings: 156,
    monthlyBookings: 32,
    occupancyRate: 78,
    averageStayDuration: 2.4,
    totalRooms: rooms.length,
    availableRooms: rooms.filter(room => room.status === 0).length // 0 = Available
  };

  const recentBookings = [
    {
      id: 1,
      guestName: "John Doe",
      roomName: "Deluxe King Room",
      checkIn: "2025-02-15",
      checkOut: "2025-02-18",
      status: "confirmed",
      totalAmount: 29850
    },
    {
      id: 2,
      guestName: "Jane Smith",
      roomName: "Executive Suite",
      checkIn: "2025-02-20",
      checkOut: "2025-02-22",
      status: "pending",
      totalAmount: 29900
    },
    {
      id: 3,
      guestName: "Mike Johnson",
      roomName: "Family Room",
      checkIn: "2025-02-25",
      checkOut: "2025-02-27",
      status: "confirmed",
      totalAmount: 24900
    }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 420000, bookings: 28 },
    { month: 'Feb', revenue: 485000, bookings: 32 },
    { month: 'Mar', revenue: 380000, bookings: 25 },
    { month: 'Apr', revenue: 520000, bookings: 35 },
    { month: 'May', revenue: 465000, bookings: 31 },
    { month: 'Jun', revenue: 510000, bookings: 34 }
  ];

  const bookings = [
    {
      id: 1,
      guestName: "John Doe",
      roomName: "Deluxe King Room",
      checkIn: "2025-02-15",
      checkOut: "2025-02-18",
      status: "confirmed",
      totalAmount: 29850
    },
    {
      id: 2,
      guestName: "Jane Smith",
      roomName: "Executive Suite",
      checkIn: "2025-02-20",
      checkOut: "2025-02-22",
      status: "pending",
      totalAmount: 29900
    }
  ];

  // Load rooms from API
  useEffect(() => {
    if (activeTab === 'rooms') {
      loadRooms();
    }
  }, [activeTab]);

  // Check admin access
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  /**
   * Load rooms from API
   */
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

  const handleStatusChange = (bookingId, newStatus) => {
    console.log(`Updating booking ${bookingId} status to ${newStatus}`);
  };

  const handleRoomStatusChange = async (roomId, newStatus) => {
    try {
      await updateRoomStatus(roomId, newStatus);
      // Update local state
      setRooms(rooms.map(room => 
        room.id === roomId ? { ...room, status: parseInt(newStatus) } : room
      ));
    } catch (error) {
      console.error('Failed to update room status:', error);
      alert('Failed to update room status. Please try again.');
    }
  };

  const handleAddRoom = (roomData) => {
    setShowRoomForm(false);
    loadRooms(); // Reload rooms to get the latest data
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowRoomForm(true);
  };

  const handleUpdateRoom = (roomData) => {
    setShowRoomForm(false);
    setEditingRoom(null);
    loadRooms(); // Reload rooms to get the latest data
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
        setRooms(rooms.filter(room => room.id !== roomId));
      } catch (error) {
        console.error('Failed to delete room:', error);
        alert('Failed to delete room. Please try again.');
      }
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-green-100 text-green-800'; // Available
      case 1: return 'bg-red-100 text-red-800';     // Occupied
      case 2: return 'bg-yellow-100 text-yellow-800'; // Maintenance
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusText = (status) => {
    switch (status) {
      case 0: return 'Available';
      case 1: return 'Occupied';
      case 2: return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const renderDashboard = () => (
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{data.month}</span>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-full max-w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(data.revenue / 600000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">₱{(data.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
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
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium">Occupied Rooms</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {rooms.filter(room => room.status === 1).length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Maintenance</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {rooms.filter(room => room.status === 2).length}
              </span>
            </div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm lg:text-base`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm lg:text-base`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`${
                activeTab === 'rooms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm lg:text-base`}
            >
              Rooms
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}

      {activeTab === 'bookings' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{booking.guestName}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{booking.roomName}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{booking.checkIn}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{booking.checkOut}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">₱{booking.totalAmount.toLocaleString()}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <select
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        defaultValue={booking.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rooms' && !showRoomForm && (
        <div>
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <button
              onClick={() => {
                setEditingRoom(null);
                setShowRoomForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
            >
              Add New Room
            </button>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading rooms...</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-sm">{room.name}</td>
                        <td className="px-4 lg:px-6 py-4 max-w-xs truncate text-sm hidden md:table-cell">{room.description}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">₱{room.price?.toLocaleString()}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{room.capacity}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <select
                            onChange={(e) => handleRoomStatusChange(room.id, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={room.status || 0}
                          >
                            <option value="0">Available</option>
                            <option value="1">Occupied</option>
                            <option value="2">Maintenance</option>
                          </select>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleEditRoom(room)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {rooms.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500">
                  No rooms found. Add your first room to get started.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'rooms' && showRoomForm && (
        <div className="bg-white shadow-md rounded-lg p-4 lg:p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </h2>
          <RoomForm
            room={editingRoom}
            onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
            onCancel={() => {
              setShowRoomForm(false);
              setEditingRoom(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Admin;