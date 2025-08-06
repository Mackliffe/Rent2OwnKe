# Rent2Own Kenya 🏠

A comprehensive rent-to-own real estate marketplace platform designed specifically for the Kenyan market. Rent2Own Kenya simplifies the path to homeownership by connecting buyers with flexible rent-to-own properties across major Kenyan cities.

## 🌟 Features

### Core Functionality
- **Property Search & Discovery**: Advanced search with filters for location, type, and price range
- **Rent-to-Own Calculator**: Interactive tool for calculating monthly payments and ownership timeline
- **Property Virtual Tours**: Immersive room-by-room navigation for detailed property exploration
- **Market Trends Analytics**: Real-time insights into Kenyan real estate market conditions
- **AI-Powered Recommendations**: Personalized property suggestions based on user preferences

### Financial Tools
- **Risk Assessment Calculator**: Investment risk analysis specific to Kenyan market conditions
- **Loan Application System**: Complete multi-step application process with KYC compliance
- **Payment Journey Tracker**: Visual milestone tracking for rent-to-own progress

### User Management
- **Multi-Role System**: Support for buyers, sellers, account managers, and administrators
- **Guided Onboarding**: Interactive tutorials and progressive feature disclosure
- **Demo User Access**: Try the platform with pre-configured demo accounts

### Seller Platform
- **Property Inspection Booking**: Professional inspection scheduling with document upload
- **Seller Registration**: Automatic seller account creation from inspection forms
- **Property Listing Management**: Tools for managing property details and status

### Administrative Portal
- **User Management**: Comprehensive user account and role management
- **Property Management**: Property approval, featuring, and content management
- **Inspection Tracking**: Monitor property inspection bookings and status
- **Application Processing**: Review and manage loan applications
- **Analytics Dashboard**: Platform usage statistics and insights

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for robust component development
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management
- **Tailwind CSS** with custom grass-green theme
- **Radix UI + shadcn/ui** for accessible component primitives
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express.js for server-side logic
- **TypeScript** for type-safe development
- **RESTful API** architecture with JSON responses

### Database
- **PostgreSQL** with Neon Database (serverless)
- **Drizzle ORM** for type-safe database operations
- **Drizzle Kit** for database migrations

### Development Tools
- **Vite** for fast development and building
- **ESBuild** for optimized bundling
- **TSX** for TypeScript execution

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rent2own-kenya.git
   cd rent2own-kenya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   PGHOST=your_db_host
   PGUSER=your_db_user
   PGPASSWORD=your_db_password
   PGDATABASE=your_db_name
   PGPORT=your_db_port
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main application: http://localhost:5000
   - Admin portal: http://localhost:5000/admin-login

### Demo Access
- **Demo User**: john.mwangi@gmail.com / demo123
- **Admin Access**: admin@rent2own.co.ke / admin123

## 📁 Project Structure

```
rent2own-kenya/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Application pages/routes
│   │   └── App.tsx         # Main application component
├── server/                 # Backend application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database configuration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
└── README.md              # This file
```

## 🏗️ Key Components

### Data Models
- **Properties**: Comprehensive property data with rent-to-own calculations
- **Users**: Multi-role user system (buyers, sellers, admins, account managers)
- **Applications**: Loan application tracking with KYC data
- **Inspections**: Property inspection booking and management
- **Locations**: Kenyan geographical data (counties, subcounties)

### API Endpoints
- `/api/properties` - Property search, details, and management
- `/api/calculate` - Rent-to-own payment calculations
- `/api/applications` - Loan application processing
- `/api/property-inspection` - Inspection booking system
- `/api/admin/*` - Administrative operations
- `/api/auth/*` - User authentication and management

### Core Features Implementation

#### Property Search
```typescript
// Advanced search with location, type, and price filters
const searchProperties = async (criteria: SearchCriteria) => {
  // Implementation includes fuzzy matching and location-based filtering
}
```

#### Rent-to-Own Calculator
```typescript
// Calculate monthly payments based on property price and terms
const calculatePayments = (price: number, downPayment: number, years: number) => {
  // Returns monthly rent, ownership timeline, and total cost
}
```

#### Risk Assessment
```typescript
// Evaluate investment risk based on Kenyan market factors
const assessRisk = (property: Property, userProfile: UserProfile) => {
  // Returns risk score and recommendations
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Grass Green (#22c55e) - represents growth and prosperity
- **Secondary**: Various green shades for consistency
- **Neutral**: Gray scales for text and backgrounds
- **Accent**: Custom colors for status indicators

### Typography
- **Headings**: Bold, readable fonts for hierarchy
- **Body**: Clean, accessible text styling
- **Interactive**: Clear button and link styling

### Components
- Consistent spacing and sizing
- Accessible color contrasts
- Responsive design patterns
- Smooth animations and transitions

## 🔐 Security & Compliance

### KYC Requirements
- National ID document upload and verification
- KRA PIN validation for tax compliance
- Phone number verification
- Email verification

### Data Protection
- Secure file upload handling
- Encrypted sensitive data storage
- User data privacy compliance

## 🌍 Kenyan Market Features

### Location Support
- All 47 Kenyan counties
- Major subcounties and cities
- Location-based property filtering

### Currency & Pricing
- KES (Kenyan Shilling) formatting
- Local market pricing standards
- Affordability calculations

### Compliance
- Kenyan real estate regulations
- Tax compliance (KRA PIN)
- Banking and finance standards

## 📈 Analytics & Insights

### Market Trends
- Real-time property price analysis
- Location-based market insights
- Investment opportunity tracking

### User Analytics
- Property viewing patterns
- Application success rates
- User engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Write comprehensive tests
- Update documentation for new features

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit via GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Kenyan real estate market
- Designed to make homeownership accessible
- Powered by modern web technologies
- Community-driven development

---

**Rent2Own Kenya** - Making homeownership accessible to all Kenyans through innovative rent-to-own solutions.