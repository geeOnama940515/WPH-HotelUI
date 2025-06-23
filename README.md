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
- **Portainer** - Container management interface
- **Nginx Proxy Manager (NPM)** - Reverse proxy and SSL management
- **Cloudflare Tunnel** - Secure tunnel for external access

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

The application will be available at `http://localhost:4174`

### Production Deployment Process

This project is deployed using a comprehensive containerized setup:

#### 1. Docker Containerization
- **Dockerfile**: Multi-stage build using Node.js 18 Alpine
- **Docker Compose**: Orchestrates the application container
- **Port**: Application runs on port 4174

#### 2. Portainer Stack Deployment
1. **Create Stack in Portainer:**
   - Navigate to Portainer dashboard
   - Go to "Stacks" section
   - Click "Add stack"
   - Choose "Repository" method
   - Provide repository URL and branch
   - Deploy the stack

#### 3. Nginx Proxy Manager (NPM) Configuration
1. **Add Proxy Host:**
   - Domain: `wph-hotel.gregdoesdev.xyz`
   - Scheme: `http`
   - Forward Hostname/IP: `localhost` (or container IP)
   - Forward Port: `4174`
   - Enable SSL certificate (Let's Encrypt)
   - Configure redirects if needed

#### 4. Cloudflare Tunnel Setup
1. **Create Tunnel:**
   - Install Cloudflare Tunnel client
   - Create tunnel in Cloudflare dashboard
   - Configure tunnel to point to local NPM instance
   - Set up DNS records to route traffic through tunnel

#### 5. Environment Configuration

Create a `.env` file in the root directory for environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://wph-backend.gregdoesdev.xyz
VITE_DEV_MODE=false
VITE_ENABLE_API_LOGGING=false
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
  - Secure token-based access
  - Complete booking information display
  - Contact information for support

### 🆕 Enhanced Admin Dashboard
- **Real-time Analytics**: Revenue tracking, booking trends, occupancy rates
- **Advanced Booking Management**: Status updates, date modifications, pagination
- **Comprehensive User Management**: Role-based access control, account status management
- **Visual Data Representation**: Progress bars, status indicators, growth metrics

### 🆕 Improved Booking Flow
- **Multi-step Process**: Form → Review → OTP Verification → Confirmation
- **Email Verification**: Secure OTP-based booking confirmation
- **Real-time Availability**: Check room availability before booking
- **Cost Calculation**: Automatic tax and service charge calculations

## Compliance with Requirements

This project fully complies with all mandatory requirements:

✅ **User Authentication and Registration**
- Secure login/registration system
- JWT-based authentication
- Role-based access control (Admin/User)

✅ **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Responsive navigation and components
- Optimized for all screen sizes

✅ **Home Page**
- Welcome banner with hotel branding
- Navigation bar (Home, Rooms, Book Now, Contact)
- Professional hotel presentation

✅ **Room Listings**
- Complete room information display
- Room name/type, description, price, amenities
- Availability status
- Image galleries

✅ **Filter/Search Functionality**
- Price range filtering
- Capacity filtering
- Sorting options (price, capacity)
- Real-time filtering

✅ **Booking Page**
- Comprehensive booking form with all required fields:
  - Guest Full Name
  - Email Address
  - Phone Number
  - Room type selection
  - Check-in and Check-out dates
- Cost calculation based on dates and room type
- Multi-step booking process

✅ **Booking Summary**
- Complete confirmation with guest and booking details
- Total cost breakdown (room rate, tax, service charge)
- Booking confirmation system

✅ **Admin Page**
- Complete booking management interface
- View all bookings with details
- User and room management
- Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@wphhotel.com or create an issue in the repository.