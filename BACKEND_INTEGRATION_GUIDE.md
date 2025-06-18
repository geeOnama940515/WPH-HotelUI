# Backend Integration Guide for ASP.NET Core

## Controller Modifications Needed

### 1. Room Controller - Image Upload Endpoint

Your current controller looks good, but here are some suggested improvements:

```csharp
[AllowAnonymous]
[HttpPost("{roomId}/images")]
public async Task<IActionResult> UploadRoomImages(Guid roomId, IFormFileCollection files)
{
    var result = await _bookingSystemFacade.UploadRoomImages(roomId, files);
    return this.CreateResponse(result);
}
```

**Key Points:**
- ✅ Parameter name `files` matches frontend FormData
- ✅ `[AllowAnonymous]` allows testing without authentication
- ✅ Returns proper `Result<T>` wrapper

### 2. CORS Configuration

Ensure your `Program.cs` or `Startup.cs` has proper CORS configuration:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// In the middleware pipeline:
app.UseCors("AllowFrontend");
```

### 3. Expected Response Format

Your backend should return responses in this format:

```json
{
  "isSuccess": true,
  "data": {
    "success": true,
    "message": "Successfully uploaded 2 image(s)",
    "images": [
      {
        "fileName": "room1.jpg",
        "url": "https://your-storage-url/room1.jpg",
        "fileSize": 1024000,
        "contentType": "image/jpeg",
        "isSuccess": true,
        "errorMessage": null
      }
    ],
    "errors": []
  },
  "message": "Uploaded",
  "errors": []
}
```

### 4. Required Endpoints

Make sure your backend has these endpoints implemented:

```csharp
// Room endpoints
[HttpGet]
public async Task<IActionResult> GetRooms() { }

[HttpGet("{id}")]
public async Task<IActionResult> GetRoom(Guid id) { }

[HttpPost]
public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto dto) { }

[HttpPut("{id}")]
public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] UpdateRoomDto dto) { }

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteRoom(Guid id) { }

[HttpPost("{roomId}/images")]
public async Task<IActionResult> UploadRoomImages(Guid roomId, IFormFileCollection files) { }

[HttpPut("{id}/status")]
public async Task<IActionResult> UpdateRoomStatus(Guid id, [FromBody] UpdateRoomStatusDto dto) { }

// Auth endpoints
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequestDto dto) { }

[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto) { }

[HttpPost("refresh")]
public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto) { }

[HttpPost("logout")]
public async Task<IActionResult> Logout() { }
```

### 5. DTOs Needed

Ensure you have these DTOs defined:

```csharp
public class CreateRoomDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
}

public class UpdateRoomDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
}

public class UpdateRoomStatusDto
{
    public string Status { get; set; }
}

public class LoginRequestDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterRequestDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
}

public class RefreshTokenRequestDto
{
    public string RefreshToken { get; set; }
}
```

### 6. Testing Your Backend

#### Using the Frontend Test Tool
1. Start your backend on `http://localhost:5187`
2. Start your frontend on `http://localhost:5173`
3. Go to Admin Dashboard
4. Click "Test API" button
5. Check console for detailed results

#### Manual Testing with Postman
1. Test basic connectivity: `GET http://localhost:5187/`
2. Test room endpoints: `GET http://localhost:5187/api/room`
3. Test image upload: `POST http://localhost:5187/api/room/{roomId}/images`

#### Using Swagger/OpenAPI
- Visit `http://localhost:5187/scalar` for interactive API documentation
- Test endpoints directly from the interface

### 7. Common Issues and Solutions

#### Issue: HTTP 405 Method Not Allowed
**Cause**: Endpoint doesn't exist or wrong HTTP method
**Solution**: 
- Check route attributes in controller
- Verify HTTP method attributes (`[HttpGet]`, `[HttpPost]`, etc.)
- Ensure controller is properly registered

#### Issue: CORS Errors
**Cause**: Frontend domain not allowed
**Solution**:
- Add `http://localhost:5173` to CORS allowed origins
- Ensure CORS middleware is configured before routing

#### Issue: 401 Unauthorized
**Cause**: Authentication required but not provided
**Solution**:
- Check if endpoint requires authentication
- Verify JWT token is valid
- Ensure token is sent in Authorization header

#### Issue: 400 Bad Request
**Cause**: Invalid request data
**Solution**:
- Check request body format
- Verify DTO properties match expected format
- Check validation attributes

### 8. Debugging Tips

#### Enable Detailed Error Messages
```csharp
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
```

#### Add Request Logging
```csharp
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
});
```

#### Check Request Headers
```csharp
[HttpPost("{roomId}/images")]
public async Task<IActionResult> UploadRoomImages(Guid roomId, IFormFileCollection files)
{
    // Log request details
    _logger.LogInformation($"Upload request for room {roomId}");
    _logger.LogInformation($"Files count: {files?.Count ?? 0}");
    
    var result = await _bookingSystemFacade.UploadRoomImages(roomId, files);
    return this.CreateResponse(result);
}
```

### 9. Environment Configuration

#### Development Settings
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:3000"]
  }
}
```

### 10. Next Steps

1. **Verify all endpoints are implemented** using the frontend test tool
2. **Check CORS configuration** if you see CORS errors
3. **Test authentication flow** if endpoints require auth
4. **Verify file upload functionality** with the image upload feature
5. **Check response format** matches frontend expectations

If you're still having issues, check the browser console and backend logs for specific error messages. 