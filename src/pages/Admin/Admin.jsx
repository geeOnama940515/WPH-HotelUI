import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoomForm from '../../components/RoomForm/RoomForm';
import UserForm from '../../components/Admin/UserForm';
import Dashboard from '../../components/Admin/Dashboard';
import BookingsTable from '../../components/Admin/BookingsTable';
import RoomsTable from '../../components/Admin/RoomsTable';
import UsersTable from '../../components/Admin/UsersTable';
import { getRooms, deleteRoom, updateRoomStatus } from '../../services/roomService';
import { getAllBookings, updateBookingStatus, updateBookingDates } from '../../services/bookingService';
import { getAllUsers, deleteUser, updateUserRole, updateUserStatus, enableUserAccount, disableUserAccount } from '../../services/userService';
import { api } from '../../services/api';
import { ConfirmationModal } from '../../components/Modal/Modal';
import { showToast } from '../../utils/notifications';
import Modal from '../../components/Modal/Modal';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: '', // 'room' or 'user'
    itemId: null,
    itemName: ''
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

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'rooms') {
      loadRooms();
    } else if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'users' && user?.isSuperAdmin) {
      loadUsers();
    } else if (activeTab === 'messages') {
      loadMessages();
    }
  }, [activeTab, user]);

  // Check admin access
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Redirect HotelManager away from Users tab
  useEffect(() => {
    if (activeTab === 'users' && user?.isHotelManager && !user?.isSuperAdmin) {
      setActiveTab('dashboard');
      showToast.warning('Access denied. Only Administrators can manage users.');
    }
  }, [activeTab, user]);

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
   * Load users from API (Super Admin only)
   */
  const loadUsers = async () => {
    if (!user?.isSuperAdmin) {
      setError('Access denied. Only Administrators can manage users.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getAllUsers();
      console.log('Users API response:', response);
      
      // The API response structure is: { success: true, message: "Users retrieved successfully", data: [...] }
      // But our api.js already unwraps it, so response should be the data array directly
      if (Array.isArray(response)) {
        console.log('Response is array, setting users directly:', response);
        setUsers(response);
      } else if (response && Array.isArray(response.data)) {
        console.log('Response has data property, using response.data:', response.data);
        setUsers(response.data);
      } else {
        console.error('Unexpected response format:', response);
        setUsers([]);
        setError('Unexpected response format from server.');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load contact messages from API
  const loadMessages = async () => {
    setLoadingMessages(true);
    setError('');
    try {
      const response = await api.get('/api/contact-messages');
      setMessages(response || []);
    } catch (error) {
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoadingMessages(false);
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
      showToast.success('Room status updated successfully');
    } catch (error) {
      console.error('Failed to update room status:', error);
      showToast.error('Failed to update room status. Please try again.');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Update local state
      setUsers(users.map(user => 
        user.userId === userId ? { ...user, roles: [newRole] } : user
      ));
      showToast.success('User role updated successfully');
    } catch (error) {
      console.error('Failed to update user role:', error);
      showToast.error('Failed to update user role. Please try again.');
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      // Update local state
      setUsers(users.map(user => 
        user.userId === userId ? { ...user, status: newStatus } : user
      ));
      showToast.success('User status updated successfully');
    } catch (error) {
      console.error('Failed to update user status:', error);
      showToast.error('Failed to update user status. Please try again.');
    }
  };

  const handleEnableAccount = async (userId) => {
    try {
      await enableUserAccount(userId);
      // Update local state - when enabled, user should have their role back
      setUsers(users.map(user => 
        user.userId === userId ? { ...user, roles: user.roles && user.roles.length > 0 ? user.roles : ['User'] } : user
      ));
      showToast.success('User account enabled successfully');
      // Reload users to get fresh data
      loadUsers();
    } catch (error) {
      console.error('Failed to enable user account:', error);
      showToast.error('Failed to enable user account. Please try again.');
    }
  };

  const handleDisableAccount = async (userId) => {
    try {
      await disableUserAccount(userId);
      // Update local state - when disabled, user should have no roles
      setUsers(users.map(user => 
        user.userId === userId ? { ...user, roles: [] } : user
      ));
      showToast.success('User account disabled successfully');
      // Reload users to get fresh data
      loadUsers();
    } catch (error) {
      console.error('Failed to disable user account:', error);
      showToast.error('Failed to disable user account. Please try again.');
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
      type: 'room',
      itemId: roomId,
      itemName: room?.name || 'this room'
    });
  };

  const handleAddUser = (userData) => {
    setShowUserForm(false);
    loadUsers(); // Reload users to get the latest data
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleUpdateUser = (userData) => {
    setShowUserForm(false);
    setEditingUser(null);
    loadUsers(); // Reload users to get the latest data
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.userId === userId);
    setDeleteModal({
      isOpen: true,
      type: 'user',
      itemId: userId,
      itemName: user ? `${user.firstName} ${user.lastName}` : 'this user'
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.type === 'room') {
        await deleteRoom(deleteModal.itemId);
        setRooms(rooms.filter(room => room.id !== deleteModal.itemId));
        showToast.success('Room deleted successfully');
      } else if (deleteModal.type === 'user') {
        await deleteUser(deleteModal.itemId);
        setUsers(users.filter(user => user.userId !== deleteModal.itemId));
        showToast.success('User deleted successfully');
      }
    } catch (error) {
      console.error(`Failed to delete ${deleteModal.type}:`, error);
      showToast.error(`Failed to delete ${deleteModal.type}. Please try again.`);
    }
  };

  const getStatusColor = (status) => {
    // Handle both string and numeric status values
    const statusValue = typeof status === 'string' ? status : status.toString();
    
    switch (statusValue) {
      case 'Pending':
      case '0': return 'bg-green-100 text-green-800';
      case 'EmailVerificationPending':
      case '1': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case '3': return 'bg-red-100 text-red-800';
      case 'Confirmed':
      case '2': return 'bg-blue-100 text-blue-800';
      case 'CheckedIn':
      case '4': return 'bg-purple-100 text-purple-800';
      case 'CheckedOut':
      case '5': return 'bg-gray-100 text-gray-800';
      case 'Completed':
      case '6': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const getBookingStatusText = (status) => {
    // Convert numeric status to text
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'EmailVerificationPending';
      case 2: return 'Confirmed';
      case 3: return 'Cancelled';
      case 4: return 'CheckedIn';
      case 5: return 'CheckedOut';
      case 6: return 'Completed';
      default: return 'Unknown';
    }
  };

        //   Pending,
        // EmailVerificationPending,
        // Confirmed,
        // Cancelled,
        // CheckedIn,
        // CheckedOut,
        // Completed

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

  const getUserStatusText = (status) => {
    return status || 'Active';
  };

  const getUserRoleText = (role) => {
    return role || 'User';
  };

  const handleViewBooking = (booking) => {
    setBookingModal({
      isOpen: true,
      booking: booking
    });
  };

  const [replyModal, setReplyModal] = useState({ open: false, message: null });
  const [replyForm, setReplyForm] = useState({ subject: '', body: '' });
  const [sendingReply, setSendingReply] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);

  const openReplyModal = (msg) => {
    setReplyForm({ subject: `RE: ${msg.subject || ''}`, body: '' });
    setReplyModal({ open: true, message: msg });
    setConfirmSend(false);
  };

  const closeReplyModal = () => {
    setReplyModal({ open: false, message: null });
    setReplyForm({ subject: '', body: '' });
    setConfirmSend(false);
  };

  const handleReplyChange = (e) => {
    setReplyForm({ ...replyForm, [e.target.name]: e.target.value });
  };

  const handleReplySubmit = async () => {
    setSendingReply(true);
    try {
      await api.post(`/api/contact-messages/reply/${replyModal.message.id}`, {
        subject: replyForm.subject,
        email: replyModal.message.emailAddress,
        body: replyForm.body
      });
      showToast.success('Reply sent successfully!');
      closeReplyModal();
    } catch (err) {
      showToast.error('Failed to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Role:</span> {user?.role}
          {user?.isSuperAdmin && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Super Admin</span>}
          {user?.isHotelManager && <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Hotel Manager</span>}
        </div>
      </div>
      
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
            {/* Only show Users tab for Super Admins (Administrator role) */}
            {user?.isSuperAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm lg:text-base`}
              >
                Users
              </button>
            )}
            <button
              onClick={() => setActiveTab('messages')}
              className={`${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm lg:text-base`}
            >
              Messages
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

      {/* Users tab - only accessible by Super Admins */}
      {activeTab === 'users' && user?.isSuperAdmin && !showUserForm && (
        <UsersTable
          users={users}
          loading={loading}
          error={error}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          handleUserRoleChange={handleUserRoleChange}
          handleUserStatusChange={handleUserStatusChange}
          handleEnableAccount={handleEnableAccount}
          handleDisableAccount={handleDisableAccount}
          getUserStatusText={getUserStatusText}
          getUserRoleText={getUserRoleText}
        />
      )}

      {activeTab === 'users' && user?.isSuperAdmin && showUserForm && (
        <div className="bg-white shadow-md rounded-lg p-4 lg:p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleAddUser}
            onCancel={() => {
              setShowUserForm(false);
              setEditingUser(null);
            }}
          />
        </div>
      )}

      {/* Access denied message for non-super admins trying to access users */}
      {activeTab === 'users' && !user?.isSuperAdmin && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only Administrators can manage users. Your current role is: <strong>{user?.role}</strong>
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Return to Dashboard
          </button>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
          {loadingMessages ? (
            <div>Loading messages...</div>
          ) : error ? (
            <div className="text-red-600 mb-4">{error}</div>
          ) : messages.length === 0 ? (
            <div>No messages found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map(msg => (
                    <tr key={msg.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{msg.fullname}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{msg.emailAddress}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{msg.phoneNumber}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{msg.subject}</td>
                      <td className="px-4 py-2 whitespace-pre-line max-w-xs">{msg.message}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(msg.dateCreated).toLocaleString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                          onClick={() => openReplyModal(msg)}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', itemId: null, itemName: '' })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.type === 'room' ? 'Room' : 'User'}`}
        message={`Are you sure you want to delete "${deleteModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Reply Modal */}
      {replyModal.open && (
        <Modal isOpen={replyModal.open} onClose={closeReplyModal}>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Reply to {replyModal.message.fullname}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={replyForm.subject}
                onChange={handleReplyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject"
                disabled={sendingReply}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
              <textarea
                name="body"
                value={replyForm.body}
                onChange={handleReplyChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply here..."
                disabled={sendingReply}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={closeReplyModal}
                disabled={sendingReply}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setConfirmSend(true)}
                disabled={sendingReply || !replyForm.subject.trim() || !replyForm.body.trim()}
              >
                Send Reply
              </button>
            </div>
          </div>
          {/* Confirmation Dialog */}
          {confirmSend && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h4 className="text-lg font-semibold mb-4">Send this reply?</h4>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setConfirmSend(false)}
                    disabled={sendingReply}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleReplySubmit}
                    disabled={sendingReply}
                  >
                    {sendingReply ? 'Sending...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Admin;