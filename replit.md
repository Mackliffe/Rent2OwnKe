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

### Frontend Components
- **Navigation**: Responsive navigation with mobile support
- **Property Cards**: Feature-rich property listings with images and key metrics
- **Property Search**: Advanced filtering by location, type, and price
- **Rent Calculator**: Interactive calculator for rent-to-own payments
- **Room Viewer**: Virtual room-by-room property exploration
- **UI Components**: Comprehensive set of accessible components from Radix UI

### Backend Services
- **Property Service**: CRUD operations for property management
- **Search Service**: Advanced property filtering and search
- **Calculator Service**: Rent-to-own payment calculations
- **Storage Layer**: Abstract storage interface with in-memory implementation

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

## Changelog
- June 28, 2025: Initial setup
- January 26, 2025: Completed Kenya-focused rent-to-own platform with full functionality

## User Preferences

Preferred communication style: Simple, everyday language.