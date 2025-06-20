import React, { useState } from 'react';
import { FaEdit, FaTrash, FaUserShield, FaUser, FaToggleOn, FaToggleOff } from 'react-icons/fa';

/**
 * UsersTable component for managing users
 */
function UsersTable({ 
  users, 
  loading, 
  error, 
  handleEditUser, 
  handleDeleteUser, 
  handleUserRoleChange,
  handleUserStatusChange,
  handleEnableAccount,
  handleDisableAccount,
  getUserStatusText,
  getUserRoleText 
}) {
  const [processingUsers, setProcessingUsers] = useState(new Set());

  const handleAccountToggle = async (userId, isEnabled) => {
    setProcessingUsers(prev => new Set([...prev, userId]));
    
    try {
      if (isEnabled) {
        await handleDisableAccount(userId);
      } else {
        await handleEnableAccount(userId);
      }
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const isUserEnabled = (user) => {
    // Check if user is enabled based on roles array
    // If user has roles, they are enabled; if no roles or empty array, they are disabled
    return user.roles && user.roles.length > 0;
  };

  const getUserRole = (user) => {
    // Get the first role from the roles array, or default to 'User'
    return user.roles && user.roles.length > 0 ? user.roles[0] : 'User';
  };

  // Debug logging
  console.log('UsersTable received users:', users);
  console.log('Users length:', users?.length);

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <button
          onClick={() => {
            handleEditUser(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
        >
          Add New User
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
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="text-sm text-yellow-700">
                <p><strong>Debug Info:</strong></p>
                <p>Users array length: {users?.length || 0}</p>
                <p>Users data: {JSON.stringify(users?.slice(0, 1), null, 2)}</p>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users && users.length > 0 ? users.map((user) => {
                  const enabled = isUserEnabled(user);
                  const isProcessing = processingUsers.has(user.userId);
                  const userRole = getUserRole(user);
                  const isAdmin = userRole === 'Administrator';
                  
                  console.log('Rendering user:', user.firstName, user.lastName, 'Role:', userRole, 'Enabled:', enabled);
                  
                  return (
                    <tr key={user.userId}>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              {isAdmin ? (
                                <FaUserShield className="text-blue-600" />
                              ) : (
                                <FaUser className="text-gray-600" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {user.phoneNumber || 'Not provided'}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userRole}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAccountToggle(user.userId, enabled)}
                            disabled={isProcessing || isAdmin}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              enabled 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } ${(isProcessing || isAdmin) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            title={isAdmin ? 'Cannot disable administrator accounts' : (enabled ? 'Click to disable account' : 'Click to enable account')}
                          >
                            {isProcessing ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : enabled ? (
                              <FaToggleOn className="text-green-600" />
                            ) : (
                              <FaToggleOff className="text-red-600" />
                            )}
                            <span>{enabled ? 'Enabled' : 'Disabled'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm"
                          >
                            <FaEdit className="text-sm" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.userId)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-900 text-sm"
                            disabled={isAdmin}
                            title={isAdmin ? 'Cannot delete administrator' : 'Delete user'}
                          >
                            <FaTrash className="text-sm" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                      {users === null || users === undefined ? 'Loading users...' : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersTable;