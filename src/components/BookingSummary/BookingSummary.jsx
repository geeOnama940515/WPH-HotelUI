import React from 'react';

function BookingSummary({ room, booking }) {
  const calculateNights = () => {
    if (!booking?.checkIn || !booking?.checkOut) return 0;
    const diffTime = Math.abs(booking.checkOut - booking.checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomTotal = nights * (room?.price || 0);
    const tax = roomTotal * 0.12; // 12% tax
    const serviceCharge = roomTotal * 0.10; // 10% service charge
    return {
      roomTotal,
      tax,
      serviceCharge,
      total: roomTotal + tax + serviceCharge
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const { roomTotal, tax, serviceCharge, total } = calculateTotal();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
      
      {room && (
        <div className="space-y-6">
          <div className="pb-4 border-b">
            <h3 className="font-medium mb-2">Room Details</h3>
            <p className="text-lg font-semibold">{room.name}</p>
            <p className="text-gray-600">₱{room.price.toLocaleString()} per night</p>
          </div>

          {booking && (
            <>
              <div className="space-y-4 pb-4 border-b">
                <div>
                  <h3 className="font-medium mb-2">Stay Duration</h3>
                  <p>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                  <p className="text-gray-600">{calculateNights()} nights</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Guests</h3>
                  <p>{booking.guests} person(s)</p>
                </div>

                {booking.contactInfo && (
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <p>Phone: {booking.contactInfo.phone}</p>
                    {booking.contactInfo.address && (
                      <p className="text-gray-600">Address: {booking.contactInfo.address}</p>
                    )}
                  </div>
                )}

                {booking.specialRequests && (
                  <div>
                    <h3 className="font-medium mb-2">Special Requests</h3>
                    <p className="text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Total</span>
                  <span>₱{roomTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (12%)</span>
                  <span>₱{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge (10%)</span>
                  <span>₱{serviceCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingSummary;