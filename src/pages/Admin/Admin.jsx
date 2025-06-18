import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoomForm from '../../components/RoomForm/RoomForm';
import { getRooms, deleteRoom, updateRoomStatus } from '../../services/roomService';
import { getAllBookings } from '../../services/bookingService';
import { runAllApiTests } from '../../services/apiTest';
import { FaUsers, FaDollarSign, FaBed, FaCalendarCheck, FaArrowUp, FaChartLine, FaWifi, FaPlus, FaEdit, FaTrash, FaEye, FaTv, FaSnowflake, FaCoffee, FaBath } from 'react-icons/fa';
import { ConfirmationModal } from '../../components/Modal/Modal';
import { showToast } from '../../utils/notifications';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    roomId: null,
    roomName: ''
  });
  
  // Booking modal state
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    booking: null
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  
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
    availableRooms: rooms.filter(room => room.status === 0).length, // 0 = Available
    bookedRooms: rooms.filter(room => room.status === 1).length,    // 1 = Booked
    occupiedRooms: rooms.filter(room => room.status === 2).length,  // 2 = Occupied
    maintenanceRooms: rooms.filter(room => room.status === 3).length, // 3 = Maintenance
    inactiveRooms: rooms.filter(room => room.status === 4).length   // 4 = Inactive
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

  // Load rooms from API
  useEffect(() => {
    if (activeTab === 'rooms') {
      loadRooms();
    } else if (activeTab === 'bookings') {
      loadBookings();
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

  /**
   * Load bookings from API
   */
  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllBookings();
      // The API response is already unwrapped, so we can access response.data directly
      setBookings(response.data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter bookings based on search term and date range
   */
  const getFilteredBookings = () => {
    return bookings.filter(booking => {
      // Search filter
      const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.roomName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Date filter
      if (dateFilter.startDate || dateFilter.endDate) {
        const checkInDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);
        
        if (dateFilter.startDate) {
          const startDate = new Date(dateFilter.startDate);
          if (checkInDate < startDate) return false;
        }
        
        if (dateFilter.endDate) {
          const endDate = new Date(dateFilter.endDate);
          if (checkOutDate > endDate) return false;
        }
      }
      
      return true;
    });
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
    const room = rooms.find(r => r.id === roomId);
    setDeleteModal({
      isOpen: true,
      roomId: roomId,
      roomName: room?.name || 'this room'
    });
  };

  const confirmDeleteRoom = async () => {
    try {
      await deleteRoom(deleteModal.roomId);
      setRooms(rooms.filter(room => room.id !== deleteModal.roomId));
      showToast.success('Room deleted successfully');
    } catch (error) {
      console.error('Failed to delete room:', error);
      showToast.error('Failed to delete room. Please try again.');
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
    // Handle both string and numeric status values
    const statusValue = typeof status === 'string' ? status : status.toString();
    
    switch (statusValue) {
      case 'confirmed':
      case '1': return 'bg-green-100 text-green-800';
      case 'pending':
      case '0': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case '2': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusText = (status) => {
    // Convert numeric status to text
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-green-100 text-green-800'; // Available
      case 1: return 'bg-blue-100 text-blue-800';   // Booked
      case 2: return 'bg-red-100 text-red-800';     // Occupied
      case 3: return 'bg-yellow-100 text-yellow-800'; // Maintenance
      case 4: return 'bg-gray-100 text-gray-800';   // Inactive
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusText = (status) => {
    switch (status) {
      case 0: return 'Available';
      case 1: return 'Booked';
      case 2: return 'Occupied';
      case 3: return 'Maintenance';
      case 4: return 'Inactive';
      default: return 'Unknown';
    }
  };

  const handleViewBooking = (booking) => {
    setBookingModal({
      isOpen: true,
      booking: booking
    });
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
                <span className="font-medium">Maintenance</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {rooms.filter(room => room.status === 3).length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="font-medium">Inactive</span>
              </div>
              <span className="text-lg font-bold text-gray-600">
                {rooms.filter(room => room.status === 4).length}
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
        <div>
          <div className="mb-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">
                {error}
              </div>
            )}
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Guest/Room
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by guest name or room..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* Start Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in From
                </label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {/* End Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out To
                </label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(searchTerm || dateFilter.startDate || dateFilter.endDate) && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter({ startDate: '', endDate: '' });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading bookings...</p>
            </div>
          ) : (
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
                    {getFilteredBookings().map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{booking.guestName}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">{booking.roomName}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">₱{booking.totalAmount.toLocaleString()}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getBookingStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleViewBooking(booking)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {getFilteredBookings().length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500">
                  No bookings found.
                </div>
              )}
            </div>
          )}
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
                            <option value="1">Booked</option>
                            <option value="2">Occupied</option>
                            <option value="3">Maintenance</option>
                            <option value="4">Inactive</option>
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, roomId: null, roomName: '' })}
        onConfirm={confirmDeleteRoom}
        title="Delete Room"
        message={`Are you sure you want to delete "${deleteModal.roomName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Booking Details Modal */}
      {bookingModal.isOpen && bookingModal.booking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setBookingModal({ isOpen: false, booking: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Guest Information */}
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {bookingModal.booking.guestName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {bookingModal.booking.emailAddress}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {bookingModal.booking.phone}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {bookingModal.booking.address || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Room:</span> {bookingModal.booking.roomName}
                    </div>
                    <div>
                      <span className="font-medium">Guests:</span> {bookingModal.booking.guests}
                    </div>
                    <div>
                      <span className="font-medium">Check-in:</span> {new Date(bookingModal.booking.checkIn).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span> {new Date(bookingModal.booking.checkOut).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span> ₱{bookingModal.booking.totalAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bookingModal.booking.status)}`}>
                        {getBookingStatusText(bookingModal.booking.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {bookingModal.booking.specialRequests && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                      {bookingModal.booking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Status Update */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                  <select
                    onChange={(e) => handleStatusChange(bookingModal.booking.id, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={bookingModal.booking.status}
                  >
                    <option value="0">Pending</option>
                    <option value="1">Confirmed</option>
                    <option value="2">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setBookingModal({ isOpen: false, booking: null })}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;