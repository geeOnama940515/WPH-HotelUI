import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/userService';
import { changePassword } from '../../services/authService';
import { showToast } from '../../utils/notifications';
import { FaUser, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

/**
 * Profile component for user profile management and password change
 */
function Profile() {
  const { user, updateUser } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // UI state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Load user profile from API
   */
  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const profile = await getProfile();
      console.log('Profile data received:', profile);
      
      // Handle the response structure - profile data might be nested
      const profileInfo = profile.data || profile;
      
      setProfileData({
        firstName: profileInfo.firstName || user?.firstName || '',
        lastName: profileInfo.lastName || user?.lastName || '',
        email: profileInfo.email || user?.email || '',
        phoneNumber: profileInfo.phoneNumber || '',
        address: profileInfo.address || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Fallback to user context data
      setProfileData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: '',
        address: ''
      });
      showToast.error('Failed to load profile details. Using cached information.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  /**
   * Handle profile form input changes
   */
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle password form input changes
   */
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Validate profile form
   */
  const validateProfileForm = () => {
    if (!profileData.firstName.trim()) {
      showToast.error('First name is required');
      return false;
    }
    if (!profileData.lastName.trim()) {
      showToast.error('Last name is required');
      return false;
    }
    if (!profileData.email.trim()) {
      showToast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      showToast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  /**
   * Validate password form
   */
  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      showToast.error('Current password is required');
      return false;
    }
    if (!passwordData.newPassword) {
      showToast.error('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      showToast.error('New password must be at least 8 characters long');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast.error('New passwords do not match');
      return false;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      showToast.error('New password must be different from current password');
      return false;
    }
    return true;
  };

  /**
   * Handle profile update
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsUpdatingProfile(true);
    
    try {
      const updatedProfile = await updateProfile({
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        phoneNumber: profileData.phoneNumber.trim(),
        address: profileData.address.trim()
      });
      
      // Update user context with new information
      updateUser({
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        fullName: `${profileData.firstName.trim()} ${profileData.lastName.trim()}`
      });
      
      setIsEditingProfile(false);
      showToast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * Handle password change
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsChangingPassword(true);
    
    try {
      await changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmNewPassword
      );
      
      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      setShowPasswordForm(false);
      showToast.success('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      showToast.error(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * Cancel profile editing
   */
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset form to original values
    loadProfile();
  };

  /**
   * Cancel password change
   */
  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-blue-600 text-xl" />
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    disabled={!isEditingProfile}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      !isEditingProfile ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    disabled={!isEditingProfile}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      !isEditingProfile ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={true}
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                    disabled={!isEditingProfile}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      !isEditingProfile ? 'bg-gray-50' : ''
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    disabled={!isEditingProfile}
                    rows={3}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      !isEditingProfile ? 'bg-gray-50' : ''
                    }`}
                    placeholder="Enter your address"
                  />
                </div>

                {/* Action Buttons */}
                {isEditingProfile && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <FaSave />
                      <span>{isUpdatingProfile ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdatingProfile}
                      className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FaLock className="text-blue-600 text-xl" />
                  <h2 className="text-xl font-semibold text-gray-900">Password & Security</h2>
                </div>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaEdit />
                    <span>Change Password</span>
                  </button>
                )}
              </div>

              {!showPasswordForm ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Your password was last changed recently. For security, we recommend changing your password regularly.
                    </p>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Change Password
                    </button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Account Status</h3>
                    <p className="text-sm text-green-700">
                      Your account is active and secure. Role: <strong>{user?.role}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Enter your current password"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      minLength={8}
                      placeholder="Enter your new password"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Confirm your new password"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <FaLock />
                      <span>{isChangingPassword ? 'Changing...' : 'Change Password'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      disabled={isChangingPassword}
                      className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">User ID:</span> {user?.id}</p>
                  <p><span className="font-medium">Role:</span> {user?.role}</p>
                  <p><span className="font-medium">Account Type:</span> {user?.isAdmin ? 'Administrator' : 'Regular User'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Permissions</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Admin Access:</span> {user?.isAdmin ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Super Admin:</span> {user?.isSuperAdmin ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Hotel Manager:</span> {user?.isHotelManager ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;