# API Troubleshooting Guide

## HTTP 405 Method Not Allowed Error

This error occurs when the frontend tries to call an API endpoint that doesn't exist or doesn't support the HTTP method being used.

### Quick Fix Steps

1. **Test API Connectivity**
   - Go to the Admin Dashboard
   - Click the "Test API" button
   - Check the browser console for detailed results

2. **Verify Backend is Running**
   - Ensure your backend is running on `http://localhost:5187`
   - Check if you can access `http://localhost:5187/scalar` for API documentation

3. **Check Endpoint Availability**
   The frontend expects these endpoints:

   ```
   GET    /api/room                    - Get all rooms
   POST   /api/room                    - Create room
   GET    /api/room/{id}               - Get room by ID
   PUT    /api/room/{id}               - Update room
   DELETE /api/room/{id}               - Delete room
   POST   /api/room/{id}/images        - Upload room images
   PUT    /api/room/{id}/status        - Update room status
   
   POST   /api/auth/login              - User login
   POST   /api/auth/register           - User registration
   POST   /api/auth/refresh            - Refresh token
   POST   /api/auth/logout             - User logout
   ```

### Common Issues and Solutions

#### 1. Backend Not Running
**Symptoms**: All API calls fail with connection errors
**Solution**: Start your backend server on port 5187

#### 2. Wrong API URL
**Symptoms**: Connection refused or timeout errors
**Solution**: 
- Check the API URL in `src/services/api.js`
- Create a `.env` file with: `VITE_API_URL=http://localhost:5187`

#### 3. Missing Endpoints
**Symptoms**: HTTP 405 Method Not Allowed for specific endpoints
**Solution**: 
- Check your backend API documentation at `http://localhost:5187/scalar`
- Ensure all required endpoints are implemented
- Verify HTTP methods match (GET, POST, PUT, DELETE)

#### 4. CORS Issues
**Symptoms**: CORS errors in browser console
**Solution**: 
- Configure CORS on your backend to allow requests from `http://localhost:5173`
- Add your frontend domain to allowed origins

#### 5. Authentication Issues
**Symptoms**: 401 Unauthorized errors
**Solution**:
- Ensure JWT tokens are properly configured
- Check if authentication is required for the endpoints
- Verify token format and expiration

### Testing Your API

#### Using the Built-in Test Tool
1. Navigate to Admin Dashboard
2. Click "Test API" button
3. Check browser console for detailed results
4. Look for ✅ (success) or ❌ (failure) indicators

#### Manual Testing with Browser Console
```javascript
// Test basic connectivity
fetch('http://localhost:5187/')
  .then(response => console.log('Status:', response.status))
  .catch(error => console.error('Error:', error));

// Test room endpoints
fetch('http://localhost:5187/api/room')
  .then(response => console.log('Rooms status:', response.status))
  .catch(error => console.error('Error:', error));
```

#### Using API Documentation
- Visit `http://localhost:5187/scalar` for interactive API documentation
- Test endpoints directly from the documentation interface

### Environment Configuration

Create a `.env` file in your project root:

```env
# Backend API URL
VITE_API_URL=http://localhost:5187

# Development settings
VITE_DEV_MODE=true
VITE_ENABLE_API_LOGGING=true
```

### Debugging Tips

1. **Check Browser Console**
   - Look for network errors
   - Check request/response details
   - Verify API calls are being made

2. **Check Backend Logs**
   - Look for incoming requests
   - Check for routing errors
   - Verify endpoint registration

3. **Use Browser Network Tab**
   - Monitor API requests
   - Check request headers and body
   - Verify response status and content

4. **Test with Postman/Insomnia**
   - Test endpoints manually
   - Verify request/response format
   - Check authentication requirements

### Expected API Response Format

The frontend expects responses in this format:

```json
{
  "isSuccess": true,
  "data": {
    // Your actual data here
  },
  "message": "Success message",
  "errors": []
}
```

For errors:
```json
{
  "isSuccess": false,
  "data": null,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Getting Help

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify your backend is running and accessible
3. Test endpoints manually using the API documentation
4. Ensure all required endpoints are implemented
5. Check CORS configuration
6. Verify authentication setup

### Common Backend Frameworks

#### ASP.NET Core
- Ensure controllers are properly decorated with `[ApiController]`
- Check route attributes match expected paths
- Verify HTTP method attributes (`[HttpGet]`, `[HttpPost]`, etc.)

#### Express.js
- Check route definitions match expected paths
- Verify middleware is properly configured
- Ensure CORS is enabled

#### Django REST Framework
- Check URL patterns in `urls.py`
- Verify view permissions and authentication
- Ensure serializers are properly configured 