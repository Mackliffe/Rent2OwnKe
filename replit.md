# Rent2Own Kenya - Property Marketplace

## Overview
Rent2Own Kenya is a full-stack web application serving as a rent-to-own property marketplace for the Kenyan real estate market. The platform enables users to explore properties, calculate rent-to-own payments, and view detailed property information using interactive room viewers. It aims to simplify the rent-to-own process for Kenyans, providing accessible pathways to homeownership and leveraging AI for personalized recommendations and market insights.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application features a modern, accessible UI with a custom grass-green color palette, using Radix UI components and the shadcn/ui design system. It is designed for responsiveness, ensuring optimal viewing on both mobile and desktop devices. Interactive elements like a virtual room viewer, intuitive navigation, and animated progress trackers enhance the user experience.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query for state management, Tailwind CSS for styling, and Vite for building.
- **Backend**: Node.js with Express.js, TypeScript, and a RESTful API returning JSON responses.
- **Database**: PostgreSQL with Drizzle ORM, utilizing Neon Database for serverless PostgreSQL. Drizzle Kit handles database migrations.
- **Data Models**: Key entities include Properties (with rent-to-own calculations and room details), Locations (Kenyan geographical data), Users, and Property Applications (including KYC data).
- **Core Features**:
    - **Property Search & Filtering**: Advanced search capabilities by location, type, and price.
    - **Rent-to-Own Calculator**: Interactive tool for payment calculations.
    - **Loan Application System**: Multi-step application form adhering to Kenyan KYC requirements, with automated authentication and application tracking.
    - **Market Trend Visualization**: Interactive charts for real-time Kenyan real estate market analytics.
    - **AI Recommendations**: Personalized property recommendations based on user preferences and AI insights.
    - **Gentle Onboarding Animations**: Interactive guided tours with three core components:
        - OnboardingAnimations: Step-by-step introduction with animated icons and progress tracking
        - PropertyJourneyAnimation: Interactive timeline showing rent-to-own investment stages
        - GuideTooltip: Smart overlay tooltips with contextual help and navigation
    - **Enhanced User Experience**: Welcome animations, progressive feature disclosure, auto-play tours, and personalized guidance for new users.
    - **Risk Calculator**: An interactive tool assessing property investment risk specific to the Kenyan market.
    - **Property Journey Progress Tracker**: A playful visualization of the rent-to-own process with milestone animations.
    - **House Selling Platform**: Comprehensive property inspection booking system for sellers with:
        - Professional inspection booking form with KYC requirements
        - Document upload support (National ID, KRA PIN)
        - Inspection scheduling with date/time selection
        - Pricing transparency (minimum KShs 5,000)
        - Kenyan county/subcounty selection

### System Design Choices
The system employs a clear separation of concerns with distinct frontend and backend architectures. Data flow is managed via RESTful API calls, optimized with client-side caching using TanStack Query. Server-side sessions are stored in PostgreSQL for robust session management. The architecture supports integration with external Kenyan real estate APIs for comprehensive data aggregation.

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Embla Carousel**: Touch-friendly carousel component.

### Data & API
- **TanStack Query**: Server state management and caching.
- **Zod**: Runtime type validation and schema validation.
- **date-fns**: Date manipulation utilities.

### Development & Database
- **Vite**: Fast build tool.
- **TSX**: TypeScript execution.
- **ESBuild**: Fast JavaScript bundler.
- **Neon Database**: Serverless PostgreSQL provider.
- **Drizzle ORM**: Type-safe ORM for PostgreSQL.