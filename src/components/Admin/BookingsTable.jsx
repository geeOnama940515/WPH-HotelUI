import React, { useState } from 'react';
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * BookingsTable component for managing bookings with search, filters, and pagination
 */
function BookingsTable({ 
  bookings, 
  loading, 
  error, 
  searchTerm, 
  setSearchTerm, 
  dateFilter, 
  setDateFilter, 
  statusFilter,
  setStatusFilter,
  getFilteredBookings, 
  getStatusColor, 
  getBookingStatusText, 
  handleViewBooking, 
  handleStatusChange,
  handleDateChange,
  bookingModal,
  setBookingModal,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages
}) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Confirmed' },
    { value: '2', label: 'Cancelled' },
    { value: '3', label: 'Checked In' },
    { value: '4', label: 'Checked Out' },
    { value: '5', label: 'Completed' }
  ];

  const [dateEditState, setDateEditState] = useState({
    checkIn: '',
    checkOut: ''
  });

  const getPaginatedBookings = () => {
    const filtered = getFilteredBookings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDateFilter({ startDate: '', endDate: '' });
    setStatusFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || dateFilter.startDate || dateFilter.endDate || statusFilter;

  const handleEditDates = () => {
    if (bookingModal.booking) {
      setDateEditState({
        checkIn: bookingModal.booking.checkIn.split('T')[0], // Extract date part only
        checkOut: bookingModal.booking.checkOut.split('T')[0]
      });
      setBookingModal(prev => ({ ...prev, isEditingDates: true }));
    }
  };

  const handleSaveDates = () => {
    if (bookingModal.booking) {
      const checkInISO = new Date(dateEditState.checkIn).toISOString();
      const checkOutISO = new Date(dateEditState.checkOut).toISOString();
      handleDateChange(bookingModal.booking.id, checkInISO, checkOutISO);
    }
  };

  const handleCancelDateEdit = () => {
    setBookingModal(prev => ({ ...prev, isEditingDates: false }));
  };

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
        {hasActiveFilters && (
          <div className="mt-4">
            <button
              onClick={clearAllFilters}
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
                {getPaginatedBookings().map((booking) => (
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
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm"
                      >
                        <FaEye className="text-sm" />
                        <span>View</span>
                      </button>
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

          {/* Pagination */}
          {getFilteredBookings().length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, getFilteredBookings().length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{getFilteredBookings().length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
                      <span className="font-medium">Check-in:</span>
                      {bookingModal.isEditingDates ? (
                        <input
                          type="date"
                          value={dateEditState.checkIn}
                          onChange={(e) => setDateEditState(prev => ({ ...prev, checkIn: e.target.value }))}
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <span className="ml-2">{new Date(bookingModal.booking.checkIn).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>
                      {bookingModal.isEditingDates ? (
                        <input
                          type="date"
                          value={dateEditState.checkOut}
                          onChange={(e) => setDateEditState(prev => ({ ...prev, checkOut: e.target.value }))}
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <span className="ml-2">{new Date(bookingModal.booking.checkOut).toLocaleDateString()}</span>
                      )}
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
                  
                  {/* Date Edit Controls */}
                  <div className="mt-3">
                    {bookingModal.isEditingDates ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDates}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Save Dates
                        </button>
                        <button
                          onClick={handleCancelDateEdit}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditDates}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit Dates
                      </button>
                    )}
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
                    <option value="1">EmailVerificationPending</option>
                    <option value="2">Confirmed</option>
                    <option value="3">Cancelled</option>
                    <option value="4">CheckedIn</option>
                    <option value="5">CheckedOut</option>
                    <option value="5">Completed</option>
                  </select>
                </div>
              </div>


        {/* Pending,
        EmailVerificationPending,
        Confirmed,
        Cancelled,
        CheckedIn,
        CheckedOut,
        Completed */}
              <div className="flex justify-end mt-6">

                {/* <button
                  onClick={() => setBookingModal({ isOpen: false, booking: null })}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Resend OTP
                </button> */}

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

export default BookingsTable; 