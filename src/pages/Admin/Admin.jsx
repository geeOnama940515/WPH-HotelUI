import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoomForm from '../../components/RoomForm/RoomForm';
import Dashboard from '../../components/Admin/Dashboard';
import BookingsTable from '../../components/Admin/BookingsTable';
import RoomsTable from '../../components/Admin/RoomsTable';
import { getRooms, deleteRoom, updateRoomStatus } from '../../services/roomService';
import { getAllBookings, updateBookingStatus, updateBookingDates } from '../../services/bookingService';
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
    booking: null,
    isEditingDates: false
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of bookings per page
  
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
   * Filter bookings based on search term, date range, and status
   */
  const getFilteredBookings = () => {
    return bookings.filter(booking => {
      // Search filter
      const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.roomName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Status filter
      if (statusFilter !== '') {
        if (booking.status !== parseInt(statusFilter)) return false;
      }
      
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

  // Calculate total pages for pagination
  const totalPages = Math.ceil(getFilteredBookings().length / itemsPerPage);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: parseInt(newStatus) } : booking
      ));
      showToast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Failed to update booking status:', error);
      showToast.error('Failed to update booking status. Please try again.');
    }
  };

  const handleDateChange = async (bookingId, checkIn, checkOut) => {
    try {
      await updateBookingDates(bookingId, checkIn, checkOut);
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, checkIn, checkOut } : booking
      ));
      // Update modal state
      setBookingModal(prev => ({
        ...prev,
        booking: { ...prev.booking, checkIn, checkOut },
        isEditingDates: false
      }));
      showToast.success('Booking dates updated successfully');
    } catch (error) {
      console.error('Failed to update booking dates:', error);
      showToast.error('Failed to update booking dates. Please try again.');
    }
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

  const getStatusColor = (status) => {
    // Handle both string and numeric status values
    const statusValue = typeof status === 'string' ? status : status.toString();
    
    switch (statusValue) {
      case 'Confirmed':
      case '1': return 'bg-green-100 text-green-800';
      case 'Pending':
      case '0': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case '2': return 'bg-red-100 text-red-800';
      case 'CheckedIn':
      case '3': return 'bg-blue-100 text-blue-800';
      case 'CheckedOut':
      case '4': return 'bg-purple-100 text-purple-800';
      case 'Completed':
      case '5': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusText = (status) => {
    // Convert numeric status to text
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Cancelled';
      case 3: return 'CheckedIn';
      case 4: return 'CheckedOut';
      case 5: return 'Completed';
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

      {activeTab === 'dashboard' && (
        <Dashboard 
          rooms={rooms}
          dashboardStats={dashboardStats}
          monthlyData={monthlyData}
          recentBookings={recentBookings}
          getStatusColor={getStatusColor}
        />
      )}

      {activeTab === 'bookings' && (
        <BookingsTable
          bookings={bookings}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          getFilteredBookings={getFilteredBookings}
          getStatusColor={getStatusColor}
          getBookingStatusText={getBookingStatusText}
          handleViewBooking={handleViewBooking}
          handleStatusChange={handleStatusChange}
          handleDateChange={handleDateChange}
          bookingModal={bookingModal}
          setBookingModal={setBookingModal}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
        />
      )}

      {activeTab === 'rooms' && !showRoomForm && (
        <RoomsTable
          rooms={rooms}
          loading={loading}
          error={error}
          handleEditRoom={handleEditRoom}
          handleDeleteRoom={handleDeleteRoom}
          handleRoomStatusChange={handleRoomStatusChange}
          getRoomStatusText={getRoomStatusText}
        />
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
    </div>
  );
}

export default Admin;