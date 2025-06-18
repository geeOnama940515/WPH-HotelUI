# WPH Hotel Booking System

A modern, responsive hotel booking system built with React and Vite, featuring a clean user interface, comprehensive booking management capabilities, and a powerful admin dashboard with analytics.

## 🌐 Live Demo

**[View Live Demo](https://wph-hotel.gregdoesdev.xyz)**

Experience the full functionality of the WPH Hotel Booking System with our live demonstration.

## Project Overview

The WPH Hotel Booking System is a full-featured web application designed for hotel management and guest bookings. It provides an intuitive interface for guests to browse rooms, make reservations, and manage their bookings, while offering administrators powerful tools to manage rooms, bookings, and view comprehensive analytics.

### Key Features

- **Guest Features:**
  - Browse available rooms with detailed information and image galleries
  - Interactive room details with auto-changing image slideshow
  - Enhanced booking flow with room selection interface
  - Multi-step booking process with comprehensive validation
  - **Public booking summary page** - View booking details via email links
  - Responsive design optimized for all devices
  - Contact form with inquiry management

- **Admin Features:**
  - **Comprehensive Dashboard** with key metrics and analytics:
    - Revenue tracking (total and monthly)
    - Booking statistics and trends
    - Occupancy rate monitoring
    - Room status overview
    - Recent bookings summary
    - Growth rate indicators
  - **Advanced Booking Management:**
    - **Enhanced booking status system** with 6 status types (Pending, Confirmed, Cancelled, Checked In, Checked Out, Completed)
    - **Pagination** - Manage large numbers of bookings efficiently (10 per page)
    - **Status filtering** - Filter bookings by status for focused management
    - **Search and date filtering** - Find specific bookings quickly
    - **Real-time status updates** with API integration
    - **Booking details modal** with comprehensive guest information
  - Advanced room management (add, edit, delete rooms)
  - Visual analytics with progress bars and status indicators
  - Multi-tab interface for organized administration

- **User Experience:**
  - Modern, clean design with smooth animations and micro-interactions
  - Mobile-responsive interface with optimized navigation
  - Intuitive booking flow with room selection cards
  - Professional hotel branding with custom logo
  - Enhanced navigation with distinct "Book Now" button
  - **Loading states** and user feedback throughout the application
  - **Route protection** - Automatic redirects for invalid URLs

## Tools and Frameworks Used

### Frontend Technologies
- **React 18.2.0** - Modern JavaScript library for building user interfaces
- **React Router DOM 6.14.0** - Client-side routing for single-page application
- **Vite 4.4.5** - Fast build tool and development server
- **Tailwind CSS 3.3.3** - Utility-first CSS framework for styling
- **React Icons 4.10.1** - Comprehensive icon library for React
- **React DatePicker 4.16.0** - Date selection component for booking forms
- **React Hot Toast** - Toast notifications for user feedback

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixing
- **@tailwindcss/forms** - Enhanced form styling with Tailwind CSS

### Backend Integration (API-Ready)
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **JWT Authentication** - Secure token-based authentication
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live data updates
- **RESTful API** - Full CRUD operations for bookings, rooms, and users

### Deployment & Containerization
- **Docker** - Containerization for consistent deployment
- **Docker Compose** - Multi-container application orchestration
- **Netlify** - Frontend deployment platform

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/           # Admin-specific components
│   │   ├── BookingsTable.jsx  # Enhanced booking table with pagination
│   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   └── RoomsTable.jsx     # Room management table
│   ├── BookingForm/     # Booking form with validation
│   ├── BookingSummary/  # Booking review and confirmation (supports view-only mode)
│   ├── Header/          # Navigation header with enhanced Book Now button
│   ├── Footer/          # Site footer
│   ├── RoomCard/        # Room display cards
│   ├── RoomFilter/      # Room filtering controls
│   ├── RoomForm/        # Admin room management form
│   └── Modal/           # Reusable modal components
├── pages/               # Main application pages
│   ├── Home/            # Landing page with hero section
│   ├── Rooms/           # Room browsing and filtering
│   ├── RoomDetails/     # Detailed room information with image gallery
│   ├── Booking/         # Enhanced multi-step booking process
│   │   └── ViewBookingSummary.jsx  # Public booking summary page
│   ├── Auth/            # Admin authentication
│   ├── Admin/           # Admin dashboard with analytics
│   ├── MyBookings/      # User booking management
│   └── Contact/         # Contact information and form
├── context/             # React context for state management
│   └── AuthContext.jsx  # Authentication state management
├── services/            # API service layers
│   ├── api.js           # Base API configuration
│   ├── authService.js   # Authentication services
│   ├── bookingService.js # Enhanced booking management with status updates
│   ├── roomService.js   # Room management
│   └── userService.js   # User profile management
├── data/                # Static data and mock data
│   └── roomsData.js     # Room information
├── utils/               # Utility functions
│   └── notifications.js # Toast notification system
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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Admin Access

To access the admin dashboard:
1. Navigate to `/auth`
2. Use the demo admin credentials:
   - **Email:** admin@wphhotel.com
   - **Password:** Admin123!

## New Features & Enhancements

### 🆕 Public Booking Summary Page
- **URL**: `/view-booking-summary?bookingtoken={token}`
- **Purpose**: Allows guests to view their booking details via email links
- **Features**:
  - No authentication required
  - Displays complete booking information
  - Contact information for support
  - Responsive design for all devices

### 🆕 Enhanced Booking Status Management
- **6 Status Types**: Pending, Confirmed, Cancelled, Checked In, Checked Out, Completed
- **Real-time Updates**: Status changes are immediately reflected in the UI
- **API Integration**: Full backend integration with proper error handling
- **Visual Indicators**: Color-coded status badges for easy identification

### 🆕 Admin Booking Management Improvements
- **Pagination**: 10 bookings per page for better performance
- **Status Filtering**: Filter bookings by any status
- **Advanced Search**: Search by guest name or room name
- **Date Range Filtering**: Filter by check-in/check-out dates
- **Clear Filters**: One-click filter reset
- **Results Counter**: Shows "X to Y of Z results"

### 🆕 Enhanced User Experience
- **Loading States**: Visual feedback during API calls
- **Toast Notifications**: Success/error messages throughout the app
- **Route Protection**: Automatic redirects for invalid URLs
- **Booking Confirmation**: Loading state during booking submission
- **Contact Integration**: Direct links to contact page from booking summary

### 🆕 API Enhancements
- **Booking Status Updates**: `PUT /api/booking/{id}/status`
- **Public Booking View**: `GET /api/booking/view/{token}`
- **Enhanced Error Handling**: Proper validation and user feedback
- **Type Safety**: Integer-based status values for backend compatibility

## Admin Dashboard Features

The admin dashboard includes:

### Dashboard Overview
- **Revenue Analytics**: Total and monthly revenue tracking with growth indicators
- **Booking Statistics**: Total bookings, monthly bookings, and trends
- **Occupancy Metrics**: Real-time occupancy rate and average stay duration
- **Room Status**: Visual overview of available, occupied, and maintenance rooms
- **Recent Bookings**: Quick access to latest booking information
- **Monthly Trends**: Revenue and booking trends with visual progress bars

### Enhanced Booking Management
- **Comprehensive Booking Table**:
  - Pagination (10 bookings per page)
  - Status filtering dropdown
  - Search functionality
  - Date range filtering
  - Clear filters option
  - Results counter
- **Booking Details Modal**:
  - Complete guest information
  - Booking details and costs
  - Special requests display
  - Status update dropdown
  - Real-time status changes
- **Status Management**:
  - 6 different booking statuses
  - Color-coded status indicators
  - API-integrated status updates
  - Success/error notifications

### Room Management
- Add, edit, and delete rooms
- Update room status (available, occupied, maintenance)
- Manage room pricing and capacity
- Upload and manage room images

## API Endpoints

### Booking Management
- `GET /api/booking` - Get all bookings (admin)
- `POST /api/booking` - Create new booking
- `PUT /api/booking/{id}/status` - Update booking status
- `GET /api/booking/view/{token}` - Get booking by public token

### Room Management
- `GET /api/room` - Get all rooms
- `POST /api/room` - Create new room
- `PUT /api/room/{id}` - Update room
- `DELETE /api/room/{id}` - Delete room
- `PUT /api/room/{id}/status` - Update room status

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@wphhotel.com or create an issue in the repository.