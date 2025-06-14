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
  - Advanced room management (add, edit, delete rooms)
  - Booking status management with real-time updates
  - Visual analytics with progress bars and status indicators
  - Multi-tab interface for organized administration

- **User Experience:**
  - Modern, clean design with smooth animations and micro-interactions
  - Mobile-responsive interface with optimized navigation
  - Intuitive booking flow with room selection cards
  - Professional hotel branding with custom logo
  - Enhanced navigation with distinct "Book Now" button

## Tools and Frameworks Used

### Frontend Technologies
- **React 18.2.0** - Modern JavaScript library for building user interfaces
- **React Router DOM 6.14.0** - Client-side routing for single-page application
- **Vite 4.4.5** - Fast build tool and development server
- **Tailwind CSS 3.3.3** - Utility-first CSS framework for styling
- **React Icons 4.10.1** - Comprehensive icon library for React
- **React DatePicker 4.16.0** - Date selection component for booking forms

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixing
- **@tailwindcss/forms** - Enhanced form styling with Tailwind CSS

### Backend Integration (API-Ready)
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **JWT Authentication** - Secure token-based authentication
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live data updates

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
│   ├── Header/          # Navigation header with enhanced Book Now button
│   ├── Footer/          # Site footer
│   ├── RoomCard/        # Room display cards
│   ├── RoomFilter/      # Room filtering controls
│   └── RoomForm/        # Admin room management form
├── pages/               # Main application pages
│   ├── Home/            # Landing page with hero section
│   ├── Rooms/           # Room browsing and filtering
│   ├── RoomDetails/     # Detailed room information with image gallery
│   ├── Booking/         # Enhanced multi-step booking process
│   ├── Auth/            # Admin authentication
│   ├── Admin/           # Admin dashboard with analytics
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
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Admin Access

To access the admin dashboard:
1. Navigate to `/auth`
2. Use the demo admin credentials:
   - **Email:** admin@wphhotel.com
   - **Password:** Admin123!

### Admin Dashboard Features

The admin dashboard includes:

#### Dashboard Overview
- **Revenue Analytics**: Total and monthly revenue tracking with growth indicators
- **Booking Statistics**: Total bookings, monthly bookings, and trends
- **Occupancy Metrics**: Real-time occupancy rate and average stay duration
- **Room Status**: Visual overview of available, occupied, and maintenance rooms
- **Recent Bookings**: Quick access to latest booking information
- **Monthly Trends**: Revenue and booking trends with visual progress bars

#### Room Management
- Add, edit, and delete rooms
- Update room status (available, occupied, maintenance)
- Manage room pricing and capacity
- Upload and manage room images

#### Booking Management
- View all bookings with filtering options
- Update booking status (pending, confirmed, cancelled)
- Monitor guest information and special requests
- Track booking revenue and duration

### Supabase Integration

This application is fully integrated with Supabase for:

#### Database Schema
- **Profiles**: User profile management with RLS
- **Rooms**: Room inventory with status tracking
- **Bookings**: Comprehensive booking management

#### Authentication
- Email/password authentication
- JWT token management
- Row Level Security (RLS) policies
- Admin role management

#### Real-time Features
- Live booking updates
- Real-time room availability
- Instant status changes

### API Integration

The application includes a complete service layer ready for backend integration:

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
The `types.txt` file contains complete TypeScript interfaces and C# entity models ready for backend implementation, including:
- **User/Profile entities** with authentication
- **Room entities** with multiple image support and status management
- **Booking entities** with full lifecycle management
- **Authentication DTOs** for secure login/registration
- **API response wrappers** for consistent data handling

### Production Deployment

For production deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider (Netlify, Vercel, etc.)

3. **Configure environment variables** on your hosting platform:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Key Features Highlights

#### Enhanced Booking Experience
- **Room Selection Interface**: Visual room cards with pricing and capacity
- **Multi-step Process**: Form → Summary → Confirmation
- **Comprehensive Validation**: Guest capacity, date validation, required fields
- **Cost Breakdown**: Detailed pricing with taxes and service charges

#### Advanced Room Details
- **Auto-changing Image Gallery**: 6-image slideshow with manual controls
- **Full-screen Modal**: Expandable image viewer with keyboard navigation
- **Comprehensive Information**: Amenities, features, and included services
- **Similar Rooms**: Recommendations for alternative options

#### Professional Admin Dashboard
- **Key Performance Indicators**: Revenue, bookings, occupancy, growth
- **Visual Analytics**: Progress bars, status indicators, trend charts
- **Real-time Data**: Live booking status and room availability
- **Comprehensive Management**: Rooms, bookings, and user management

### Troubleshooting

**Common Issues:**

- **Port already in use:** Change the port in `vite.config.js` or kill the process using the port
- **Dependencies not installing:** Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Build errors:** Ensure all environment variables are properly set
- **Supabase connection issues:** Verify your Supabase project URL and API keys
- **Icon import errors:** Ensure all React Icons are properly imported and available

**Development Tips:**

- Use the browser's developer tools to inspect responsive design
- Check the console for any JavaScript errors
- The application includes comprehensive error handling and validation
- All service functions are ready for immediate Supabase integration
- Admin dashboard provides real-time insights into system performance

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different devices
5. Submit a pull request

### Support

For support or questions about the WPH Hotel Booking System, please refer to the documentation or contact the development team.

**Live Demo:** [https://wph-hotel.gregdoesdev.xyz](https://wph-hotel.gregdoesdev.xyz)

### Recent Updates

- ✅ **Enhanced Admin Dashboard** with comprehensive analytics and KPIs
- ✅ **Improved Booking Flow** with visual room selection interface
- ✅ **Advanced Room Gallery** with auto-changing slideshow and modal viewer
- ✅ **Professional Navigation** with distinct Book Now button styling
- ✅ **Supabase Integration** with complete database schema and RLS policies
- ✅ **Mobile Optimization** with responsive design across all components
- ✅ **Real-time Analytics** with revenue tracking and occupancy monitoring

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Supabase**
**Production-ready with comprehensive admin dashboard and analytics**