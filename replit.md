# Rent2Own Kenya - Property Marketplace

## Overview

Rent2Own Kenya is a full-stack web application that provides a rent-to-own property marketplace specifically designed for the Kenyan real estate market. The platform allows users to browse properties, calculate rent-to-own payments, and explore detailed property information with interactive room viewers.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom grass-green color palette
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database migrations
- **Session Storage**: PostgreSQL sessions with connect-pg-simple

## Key Components

### Database Schema
- **Properties Table**: Core property data including pricing, location, features, and rent-to-own calculations
- **Locations Table**: Kenyan geographical data (counties, cities, neighborhoods)
- **Property Rooms**: JSON-based room data with images and descriptions
- **Users Table**: User authentication and profile data for Replit Auth integration
- **Property Applications Table**: User loan applications with status tracking and KYC data storage

### Frontend Components
- **Navigation**: Responsive navigation with mobile support
- **Property Cards**: Feature-rich property listings with images and key metrics
- **Property Search**: Advanced filtering by location, type, and price
- **Rent Calculator**: Interactive calculator for rent-to-own payments
- **Room Viewer**: Virtual room-by-room property exploration
- **UI Components**: Comprehensive set of accessible components from Radix UI

### Backend Services
- **Property Service**: CRUD operations for property management
- **Search Service**: Advanced property filtering and search with external API integration
- **Calculator Service**: Rent-to-own payment calculations
- **Storage Layer**: PostgreSQL database with Drizzle ORM
- **API Integration Service**: Multi-source property data aggregation from Kenyan real estate APIs
- **Mock Data Service**: Demonstration data for API integration testing

## Data Flow

1. **Property Browsing**: Client fetches properties via REST API, displays in responsive grid
2. **Search & Filter**: Real-time search with debounced API calls using React Query
3. **Property Details**: Dynamic routing to individual property pages with room viewer
4. **Calculations**: Interactive rent-to-own calculator with instant updates
5. **Session Management**: Server-side sessions stored in PostgreSQL

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Embla Carousel**: Touch-friendly carousel component

### Data & API
- **TanStack Query**: Server state management and caching
- **Zod**: Runtime type validation and schema validation
- **date-fns**: Date manipulation utilities

### Development
- **Vite**: Fast build tool with HMR
- **TSX**: TypeScript execution for development
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with Express API proxy
- **Hot Reload**: Full-stack HMR with Vite middleware
- **Type Checking**: Real-time TypeScript validation

### Production Build
- **Frontend**: Vite builds React app to static assets
- **Backend**: ESBuild bundles Express server with external dependencies
- **Database**: Drizzle migrations deployed to Neon database

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for Neon connection
- **Build Process**: Unified build script for frontend and backend
- **Asset Serving**: Express serves static files in production

## Recent Changes
- January 26, 2025: Successfully deployed complete Kenya-focused rent-to-own real estate platform
  - Implemented KES currency formatting and Kenyan location data (Nairobi, Mombasa, Kisumu)
  - Added grass-green color scheme throughout the application
  - Built interactive room viewer with property interior galleries
  - Created comprehensive rent-to-own calculator with Kenya-specific interest rates
  - Integrated property search with city, type, and budget filters
  - Added responsive design for mobile and desktop viewing
  - Fixed Select component issues and ensured smooth user experience
  
- January 26, 2025: Integrated Kenyan Real Estate APIs
  - Built comprehensive API integration system for major Kenyan real estate platforms
  - Created API aggregator service supporting Kenya Property Portal, BuyRentKenya, and PropertyPoint Kenya
  - Implemented mock data system for demonstration and testing purposes
  - Added API Settings page for users to configure API keys and test connections
  - Enhanced property search to include external API results alongside local data
  - Added external property markers and data source indicators
  - Created flexible API conversion system to normalize different property data formats

- January 27, 2025: Added Comprehensive Loan Application System
  - Created multi-step loan application form with Kenyan KYC requirements
  - Implemented personal information, professional details, and loan preferences sections
  - Added specific Kenyan legal consent clauses for credit bureau access and reporting
  - Integrated loan application button in rent-to-own calculator
  - Built form validation and progress tracking system
  - Added Kenyan-specific fields: KRA PIN, county selection, banking partners
  - Created comprehensive consent system compliant with Kenyan banking regulations

- January 27, 2025: Property Application Tracking & User Dashboard
  - Built complete property application tracking system
  - Added user authentication integration with property applications
  - Created dashboard page showing user's applied properties and status
  - Implemented application status tracking (pending, processing, approved, rejected)
  - Added duplicate application prevention (one application per property per user)
  - Enhanced loan application button with authentication and status checks
  - Added "My Dashboard" navigation for signed-in users to view their applications

- January 27, 2025: Enhanced Loan Application Buttons Across Platform
  - Added loan application buttons to all property cards with smart status detection
  - Enhanced property detail pages with prominent loan application buttons in summary section
  - Updated rent calculator to show authentication-aware application buttons
  - Implemented proper authentication flow with "/api/login" redirect for unauthenticated users
  - Added application status indicators showing "Sign In to Apply", "Apply for Loan", or "Application Submitted"
  - Enhanced navigation with "My Dashboard" link for easy access to application tracking
  - Complete loan application flow now available from every property touchpoint

- January 27, 2025: Smart Navigation with Authentication-Based Visibility
  - Updated navigation to conditionally show links based on user authentication status
  - "My Dashboard" and "API Settings" links now only visible for signed-in users
  - Non-authenticated users see only "Sign In" and "Get Started" options
  - Authenticated users see "API Settings", "My Dashboard", and "Sign Out" options
  - Enhanced user experience with context-appropriate navigation options

- January 27, 2025: Seamless Loan Application Flow Without Required Sign-In
  - Implemented automatic authentication system for loan applications
  - Users can now access loan application forms without signing in first
  - System automatically handles account creation/login during application submission
  - Auto-authentication endpoint checks for existing accounts and guides users appropriately
  - Application data is preserved during authentication flow using session storage
  - Loan application buttons updated to allow direct access from all property touchpoints
  - Streamlined user experience removes friction from the application process

- January 27, 2025: Enhanced Loan Application Processing with Intelligent User Detection
  - Fixed authentication middleware issues in auto-auth endpoint
  - Implemented intelligent user detection by email address during application submission
  - Existing users: Applications automatically linked to their account, prompted to sign in for tracking
  - New users: Guided through account creation process via OAuth sign-in
  - Enhanced error handling with specific user feedback for different scenarios
  - Property cards updated with "View More" buttons, loan applications moved to detail pages
  - All loan buttons renamed to "Apply for Rent to Own" for consistent terminology
  - Fixed grass-green color palette configuration in Tailwind for proper button styling

- January 27, 2025: Interactive Property Investment Risk Calculator
  - Built comprehensive risk assessment tool analyzing multiple investment factors
  - Implemented financial risk analysis (debt-to-income ratio, down payment, employment stability)
  - Added location-based risk scoring for major Kenyan cities and regions
  - Created market risk evaluation based on property type and market exposure
  - Integrated credit score analysis and liquidity risk assessment
  - Real-time risk scoring with weighted calculations (0-100 scale)
  - Dynamic recommendations, strengths identification, and risk warnings
  - Visual progress indicators and color-coded risk levels (Low/Moderate/High/Very High)
  - Added navigation link and dedicated page at /risk-calculator
  - Kenya-specific parameters and considerations for local real estate market

- January 27, 2025: Real-Time Market Trend Visualization for Kenyan Real Estate
  - Implemented comprehensive market analytics dashboard with interactive charts
  - Built price trend analysis with filtering by city and timeframe
  - Added city-by-city market performance comparison with market share visualization
  - Created property type analysis with growth rates and market distribution
  - Integrated market activity tracking (transactions, inventory, days on market)
  - Real-time data refresh functionality with live market indicators
  - Interactive charts using Recharts library (line, area, bar, and pie charts)
  - Kenya-specific market data including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret
  - Added to navigation and accessible at /market-trends
  - Color-coded performance indicators and trend analysis tools

- January 27, 2025: Personalized Property Recommendations with AI Insights
  - Built intelligent recommendation engine using rule-based AI analysis
  - Implemented smart search with natural language query understanding
  - Created personalized match scoring system (0-100%) based on user preferences
  - Added financial fit analysis with affordability and investment potential scoring
  - Integrated market insights showing price competitiveness and trends
  - Built preference customization system for locations, property types, and goals
  - Generated personalized reasons and AI insights for each recommendation
  - Added confidence scoring and detailed recommendation explanations
  - Created dedicated recommendations page at /recommendations
  - Updated navigation and footer quick links with all new features

- January 27, 2025: Intuitive Onboarding Wizard for First-Time Property Investors
  - Built comprehensive 7-step onboarding wizard for new users
  - Created educational content explaining rent-to-own investment concepts
  - Implemented experience level assessment (first-time, some experience, experienced)
  - Added financial planning step with budget and income input
  - Built investment goals selection with visual icons and descriptions
  - Created property preferences wizard for locations, types, and lifestyle factors
  - Added risk tolerance assessment and investment timeline planning
  - Implemented smart routing based on user interests after completion
  - Enhanced "Get Started" button with onboarding flow detection
  - Added onboarding entry points in navigation for new users

## Changelog
- June 28, 2025: Initial setup
- January 26, 2025: Completed Kenya-focused rent-to-own platform with full functionality

## User Preferences

Preferred communication style: Simple, everyday language.