import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../../services/userService';
import { showToast } from '../../utils/notifications';
import { ConfirmationModal } from '../Modal/Modal';

/**
 * UserForm component for adding/editing users (Admin only)
 * Handles both create and update operations for users
 * 
 * @param {Object} user - Existing user data for editing (null for new user)
 * @param {Function} onSubmit - Callback when form is submitted successfully
 * @param {Function} onCancel - Callback when form is cancelled
 */
function UserForm({ user, onSubmit, onCancel }) {
  // Form state with default values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'User',
    status: 'Active',
    password: '',
    confirmPassword: ''
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save confirmation modal state
  const [saveModal, setSaveModal] = useState({
    isOpen: false,
    formData: null
  });

  // Populate form with existing user data when editing
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || 'User',
        status: user.status || 'Active',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  /**
   * Validate form data
   */
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      showToast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      showToast.error('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      showToast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast.error('Please enter a valid email address');
      return false;
    }

    // Password validation for new users
    if (!user) {
      if (!formData.password) {
        showToast.error('Password is required for new users');
        return false;
      }
      if (formData.password.length < 8) {
        showToast.error('Password must be at least 8 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast.error('Passwords do not match');
        return false;
      }
    }

    // Password validation for existing users (only if password is provided)
    if (user && formData.password) {
      if (formData.password.length < 8) {
        showToast.error('Password must be at least 8 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast.error('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Prepare user data
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      role: formData.role,
      status: formData.status
    };

    // Include password only if provided
    if (formData.password) {
      userData.password = formData.password;
      userData.confirmPassword = formData.confirmPassword;
    }

    // Show confirmation modal
    setSaveModal({
      isOpen: true,
      formData: userData
    });
  };

  /**
   * Confirm and execute the save operation
   */
  const confirmSave = async () => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (user) {
        // Update existing user
        result = await updateUser(user.id, saveModal.formData);
        showToast.success('User updated successfully');
      } else {
        // Create new user
        result = await createUser(saveModal.formData);
        showToast.success('User created successfully');
      }

      onSubmit(result);
    } catch (error) {
      console.error('User operation failed:', error);
      showToast.error(error.message || 'Failed to save user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            maxLength={50}
            placeholder="Enter first name"
            disabled={isSubmitting}
          />
        </div>

        {/* Last name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            maxLength={50}
            placeholder="Enter last name"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Enter email address"
          disabled={isSubmitting || !!user} // Disable email editing for existing users
        />
        {user && (
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed for existing users</p>
        )}
      </div>

      {/* Phone number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter phone number"
          disabled={isSubmitting}
        />
      </div>

      {/* Role and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          >
            <option value="User">User</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Password Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">
          {user ? 'Change Password (Optional)' : 'Set Password *'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {user ? 'New Password' : 'Password *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required={!user}
              minLength={8}
              placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {user ? 'Confirm New Password' : 'Confirm Password *'}
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required={!user || !!formData.password}
              placeholder="Confirm password"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </button>
      </div>

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        isOpen={saveModal.isOpen}
        onClose={() => setSaveModal({ isOpen: false, formData: null })}
        onConfirm={confirmSave}
        title={user ? 'Update User' : 'Create User'}
        message={`Are you sure you want to ${user ? 'update' : 'create'} this user account?`}
        confirmText={user ? 'Update' : 'Create'}
        cancelText="Cancel"
        type="info"
      />
    </form>
  );
}

export default UserForm;