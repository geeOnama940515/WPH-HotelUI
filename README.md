# WPH Hotel Booking System

A modern, responsive hotel booking system built with React and Vite, featuring a clean user interface and comprehensive booking management capabilities.

## 🌐 Live Demo

**[View Live Demo](https://wph-hotel.gregdoesdev.xyz)**

Experience the full functionality of the WPH Hotel Booking System with our live demonstration.

## Project Overview

The WPH Hotel Booking System is a full-featured web application designed for hotel management and guest bookings. It provides an intuitive interface for guests to browse rooms, make reservations, and manage their bookings, while offering administrators powerful tools to manage rooms and bookings.

### Key Features

- **Guest Features:**
  - Browse available rooms with detailed information
  - View room details with image galleries and amenities
  - Make bookings with comprehensive form validation
  - Multi-step booking process with confirmation
  - Responsive design for all devices

- **Admin Features:**
  - Admin dashboard for managing bookings and rooms
  - Room management (add, edit, delete rooms)
  - Booking status management
  - Comprehensive booking overview

- **User Experience:**
  - Modern, clean design with smooth animations
  - Mobile-responsive interface
  - Intuitive navigation and user flow
  - Professional hotel branding

## Tools and Frameworks Used

### Frontend Technologies
- **React 18.2.0** - Modern JavaScript library for building user interfaces
- **React Router DOM 6.14.0** - Client-side routing for single-page application
- **Vite 4.4.5** - Fast build tool and development server
- **Tailwind CSS 3.3.3** - Utility-first CSS framework for styling
- **React Icons 4.10.1** - Popular icon library for React
- **React DatePicker 4.16.0** - Date selection component for booking forms

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixing
- **@tailwindcss/forms** - Enhanced form styling with Tailwind CSS

### Backend Integration (API-Ready)
- **C# .NET Backend** - RESTful API with Entity Framework
- **JWT Authentication** - Secure token-based authentication
- **SQL Server/PostgreSQL** - Relational database for data persistence
- **Entity Framework Core** - Object-relational mapping (ORM)

### Deployment & Containerization
- **Docker** - Containerization for consistent deployment
- **Docker Compose** - Multi-container application orchestration
- **Netlify** - Frontend deployment platform

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingForm/     # Booking form with validation
│   ├── BookingSummary/  # Booking review and confirmation
│   ├── Header/          # Navigation header
│   ├── Footer/          # Site footer
│   ├── RoomCard/        # Room display cards
│   ├── RoomFilter/      # Room filtering controls
│   └── RoomForm/        # Admin room management form
├── pages/               # Main application pages
│   ├── Home/            # Landing page with hero section
│   ├── Rooms/           # Room browsing and filtering
│   ├── RoomDetails/     # Detailed room information
│   ├── Booking/         # Multi-step booking process
│   ├── Auth/            # Admin authentication
│   ├── Admin/           # Admin dashboard
│   ├── MyBookings/      # User booking management
│   └── Contact/         # Contact information and form
├── context/             # React context for state management
│   └── AuthContext.jsx  # Authentication state management
├── services/            # API service layers
│   ├── api.js           # Base API configuration
│   ├── authService.js   # Authentication services
│   ├── bookingService.js # Booking management
│   ├── roomService.js   # Room management
│   └── userService.js   # User profile management
├── data/                # Static data and mock data
│   └── roomsData.js     # Room information
└── index.css            # Global styles and Tailwind imports
```

## Instructions on How to Run the Project

### Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hotel-booking-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- **`npm run dev`** - Starts the development server with hot reload
- **`npm run build`** - Builds the application for production
- **`npm run preview`** - Previews the production build locally
- **`npm run lint`** - Runs ESLint to check code quality

### Docker Deployment

For production deployment using Docker:

1. **Build the Docker image:**
   ```bash
   docker build -t wph-hotel .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:4173`

### Environment Configuration

Create a `.env` file in the root directory for environment variables:

```env
VITE_API_URL=http://localhost:5000/api
# For production, update to your C# backend API URL
# VITE_API_URL=https://your-api-domain.com/api
```

### Admin Access

To access the admin dashboard:
1. Navigate to `/auth`
2. Use the demo admin credentials:
   - **Email:** admin@wphhotel.com
   - **Password:** Admin123!

### Backend Integration (C# .NET)

This frontend is designed to work with a C# .NET backend API. The application includes:

#### API Service Layer
- **RESTful API calls** ready for C# backend integration
- **JWT token management** for secure authentication
- **Comprehensive error handling** for API responses
- **TypeScript-ready** data models and DTOs

#### Expected Backend Endpoints
```
Authentication:
POST /api/auth/login
POST /api/auth/register

Rooms:
GET /api/rooms
POST /api/rooms (Admin)
PUT /api/rooms/{id} (Admin)
DELETE /api/rooms/{id} (Admin)

Bookings:
GET /api/bookings (User's bookings)
GET /api/bookings/all (Admin - all bookings)
POST /api/bookings
PUT /api/bookings/{id}/status (Admin)

User Profile:
GET /api/profile
PUT /api/profile
```

#### Database Models
The `types.txt` file contains complete C# entity models and DTOs ready for your backend implementation, including:
- **User/Profile entities**
- **Room entities with status management**
- **Booking entities with full lifecycle**
- **Authentication DTOs**
- **API response wrappers**

### Production Deployment

For production deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider (Netlify, Vercel, etc.)

3. **Configure environment variables** on your hosting platform:
   ```env
   VITE_API_URL=https://your-csharp-api.com/api
   ```

### API Integration Notes

- **Mock Data**: Currently uses mock data for development
- **Service Layer**: All API calls are abstracted in service files
- **Authentication**: JWT token handling is implemented
- **Error Handling**: Comprehensive error handling for API failures
- **Type Safety**: TypeScript interfaces ready for C# backend integration

### Troubleshooting

**Common Issues:**

- **Port already in use:** Change the port in `vite.config.js` or kill the process using the port
- **Dependencies not installing:** Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Build errors:** Ensure all environment variables are properly set
- **API connection issues:** Verify your C# backend is running and CORS is configured

**Development Tips:**

- Use the browser's developer tools to inspect responsive design
- Check the console for any JavaScript errors
- The application includes comprehensive error handling and validation
- All service functions are ready for immediate C# backend integration

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Support

For support or questions about the WPH Hotel Booking System, please refer to the documentation or contact the development team.

**Live Demo:** [https://wph-hotel.gregdoesdev.xyz](https://wph-hotel.gregdoesdev.xyz)

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
**Backend-ready for C# .NET API integration**