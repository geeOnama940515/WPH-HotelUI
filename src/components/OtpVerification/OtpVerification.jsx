import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaSpinner, FaTimes } from 'react-icons/fa';
import { showToast } from '../../utils/notifications';

/**
 * OtpVerification component for email verification during booking
 * Handles OTP input, verification, resend functionality, and booking cancellation
 * 
 * @param {string} bookingId - The booking ID from the initial booking creation
 * @param {string} emailAddress - Email address where OTP was sent
 * @param {Function} onVerified - Callback when OTP is successfully verified
 * @param {Function} onCancel - Callback when user cancels verification
 * @param {Function} onResendOtp - Callback to resend OTP
 * @param {Function} onCancelBooking - Callback to cancel the booking
 * @param {boolean} isCancellingBooking - Loading state for booking cancellation
 */
function OtpVerification({ 
  bookingId, 
  emailAddress, 
  onVerified, 
  onCancel, 
  onResendOtp, 
  onCancelBooking,
  isCancellingBooking = false 
}) {
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Start countdown timer for resend button
  useEffect(() => {
    // Start with 250 seconds countdown
    setCountdown(250);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtpCode(value);
    }
  };

  /**
   * Handle OTP verification
   */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      showToast.error('Please enter a valid 6-digit OTP code');
      return;
    }

    setIsVerifying(true);
    
    try {
      await onVerified(bookingId, otpCode);
    } catch (error) {
      console.error('OTP verification failed:', error);
      showToast.error(error.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle OTP resend
   */
  const handleResendOtp = async () => {
    if (countdown > 0) {
      showToast.warning(`Please wait ${countdown} seconds before requesting a new OTP`);
      return;
    }

    setIsResending(true);
    
    try {
      await onResendOtp(bookingId, emailAddress);
      showToast.success('New OTP sent to your email');
      setCountdown(250); // Reset countdown
      setOtpCode(''); // Clear current OTP
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      showToast.error(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Handle booking cancellation
   */
  const handleCancelBooking = async () => {
    try {
      if (onCancelBooking) {
        await onCancelBooking(bookingId);
      } else {
        // Fallback to the onCancel prop
        onCancel();
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      showToast.error(error.message || 'Failed to cancel booking. Please try again.');
    }
  };

  /**
   * Format countdown time as MM:SS
   */
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FaEnvelope className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900">{emailAddress}</p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaLock className="inline mr-2" />
            Enter Verification Code
          </label>
          <input
            type="text"
            value={otpCode}
            onChange={handleOtpChange}
            placeholder="000000"
            className="w-full text-center text-2xl font-mono tracking-widest rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
            maxLength={6}
            disabled={isVerifying || isCancellingBooking}
            autoComplete="one-time-code"
            autoFocus
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isVerifying || otpCode.length !== 6 || isCancellingBooking}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </div>
            ) : (
              'Verify & Complete Booking'
            )}
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || countdown > 0 || isCancellingBooking}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </div>
              ) : countdown > 0 ? (
                `Resend in ${formatCountdown(countdown)}`
              ) : (
                'Resend Code'
              )}
            </button>

            <button
              type="button"
              onClick={handleCancelBooking}
              disabled={isCancellingBooking}
              className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-md hover:bg-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancellingBooking ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Cancelling...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaTimes className="mr-2" />
                  Cancel Booking
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code? Check your spam folder or try resending.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Booking ID: {bookingId}
        </p>
        
        {/* Warning about cancellation */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            ⚠️ If you cancel this booking, you'll need to start the booking process over again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;