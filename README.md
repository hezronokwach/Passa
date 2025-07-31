# Passa - Creator Economy Platform

A modern blockchain-powered creator economy platform built on Stellar, connecting creators, fans, and brands through transparent value distribution and instant payments.

## 🚀 What We've Built

Passa is a comprehensive creator economy platform featuring:

### ✅ **Complete Frontend Application**
- **Modern React 18 + TypeScript** with Vite build system
- **Responsive Design** that works perfectly on all devices
- **Futuristic Dark Theme** with glass-morphism and neon effects
- **Smooth Animations** powered by Framer Motion
- **Professional UI Components** with consistent design system

### ✅ **Full Page Structure**
- **Landing Page** - Hero section, features, testimonials, stats, and CTA
- **Events Page** - Discover and purchase event tickets with USDC pricing
- **Creators Page** - Tools and features for content creators
- **Brands Page** - Marketing solutions for businesses
- **About Page** - Company mission, values, and goals
- **Contact Page** - Multiple contact methods and contact form

### ✅ **Authentication System**
- **Sign In Page** - Email/password and social login options
- **Sign Up Page** - User type selection (Creator/Brand/Fan) with validation
- **Forgot Password** - Password reset flow with email verification
- **Terms & Privacy** - Legal pages for compliance

### ✅ **Advanced Features**
- **Blockchain Integration Ready** - Built for Stellar network
- **Wallet Connection** - Ready for crypto wallet integration
- **Global Accessibility** - Internationalization-ready design
- **SEO Optimized** - Proper meta tags and semantic HTML
- **Performance Optimized** - Fast loading and efficient animations

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **Heroicons** for consistent iconography

### Backend (Ready for Development)
- **Node.js** with Express framework
- **TypeScript** for type safety
- **Stellar SDK** for blockchain integration
- **JWT** for authentication
- **Rate limiting** and security middleware

### Blockchain Integration
- **Stellar Network** for fast, low-cost transactions
- **USDC** for stable cryptocurrency payments
- **Smart contracts** for automated revenue distribution
- **Wallet integration** for seamless user experience

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **npm** or **yarn**
- **PostgreSQL 14+**
- **Git**

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/hezronokwach/Passa.git
cd Passa
```

2. **Install dependencies:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Setup environment:**
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your database credentials
```

4. **Setup database:**
```bash
cd backend

# Create databases
createdb passa_dev
createdb passa_dev_test

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

5. **Start development servers:**
```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Open your browser:**
```
Frontend: http://localhost:3000
Backend API: http://localhost:3001
```

### Build for Production

```bash
# Build the frontend
cd frontend
npm run build
npm run preview

# Build the backend
cd backend
npm run build
npm start
```

## 📁 Project Structure

```
Passa/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── layout/      # Header, Footer, Navigation
│   │   │   ├── sections/    # Page sections (Hero, Features, etc.)
│   │   │   └── ui/          # UI components (Cards, Buttons, etc.)
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Global styles and Tailwind config
│   │   └── utils/           # Utility functions
├── backend/                 # Node.js backend API (ready for development)
├── docs/                    # Documentation
└── README.md
```

## 🌟 Key Features Implemented

### 🎯 **User Experience**
- Smooth page transitions and micro-interactions
- Responsive design for all screen sizes
- Intuitive navigation and user flows
- Professional loading states and feedback

### 🔐 **Authentication Flow**
- Complete sign-up process with user type selection
- Password strength validation
- Social login integration ready
- Forgot password with email verification

### 💳 **Payment Ready**
- USDC pricing for events and services
- Wallet connection UI components
- Blockchain transaction preparation

### 📱 **Mobile Optimized**
- Touch-friendly interface
- Optimized spacing and typography
- Responsive navigation menu
- Fast loading on mobile networks

## 🛠️ Backend Development

### Database Commands

```bash
cd backend

# Migration commands
npm run db:migrate          # Run latest migrations
npm run db:rollback         # Rollback last migration
npm run db:reset            # Reset database (rollback all + migrate + seed)
npm run db:status           # Check migration status

# Seed commands
npm run db:seed             # Run all seed files

# Utility commands
npm run db:setup            # Setup database from scratch
npm run db:validate         # Validate database schema
```

### Testing

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Test specific file
npm test -- User.test.ts
```

### Code Quality

```bash
cd backend

# Linting
npm run lint                # Check for linting errors
npm run lint:fix            # Fix linting errors

# Formatting
npm run format              # Format code with Prettier
```

### Development Scripts

```bash
cd backend

# Development
npm run dev                 # Start development server with hot reload
npm run build               # Build for production
npm start                   # Start production server

# Documentation
npm run docs:generate       # Generate API documentation
```

### User Model API

The User Model provides comprehensive user management:

```typescript
// Create user
const user = await UserModel.create({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepassword123',
  first_name: 'John',
  last_name: 'Doe'
});

// Find user
const user = await UserModel.findByEmail('john@example.com');

// Update user
const updated = await UserModel.update(userId, { first_name: 'Johnny' });

// Role management
await UserRoleModel.assignRole(userId, 'creator');
const roles = await UserRoleModel.getUserRoles(userId);

// Activity logging
await UserActivityModel.logActivity(userId, 'login', { ip_address: '127.0.0.1' });
```

## 🗺️ Development Roadmap

### Phase 1: Frontend Foundation ✅ **COMPLETED**
- [x] Project setup with React 18 + TypeScript + Vite
- [x] Tailwind CSS configuration with dark theme
- [x] Component library with design system
- [x] All main pages (Landing, Events, Creators, Brands, About, Contact)
- [x] Authentication pages (Sign In, Sign Up, Forgot Password)
- [x] Responsive design and mobile optimization
- [x] Animation system with Framer Motion
- [x] Legal pages (Terms, Privacy)

### Phase 2: Backend Development 🚧 **NEXT**
- [ ] Node.js/Express server setup
- [ ] Database design and setup (PostgreSQL)
- [ ] User authentication system (JWT)
- [ ] API endpoints for user management
- [ ] Email service integration
- [ ] Rate limiting and security middleware
- [ ] API documentation with Swagger

### Phase 3: Blockchain Integration 🔮 **UPCOMING**
- [ ] Stellar SDK integration
- [ ] Wallet connection (Freighter, LOBSTR)
- [ ] USDC payment processing
- [ ] Smart contract development (Soroban)
- [ ] NFT ticketing system
- [ ] Automated revenue distribution
- [ ] Transaction history and analytics

### Phase 4: Advanced Features 🚀 **FUTURE**
- [ ] Real-time notifications
- [ ] Creator dashboard and analytics
- [ ] Brand campaign management
- [ ] Event management system
- [ ] Content upload and streaming
- [ ] Social features and messaging
- [ ] Mobile app development

### Phase 5: Production & Scale 🌍 **FUTURE**
- [ ] Performance optimization
- [ ] Security audits
- [ ] Load testing and scaling
- [ ] CI/CD pipeline setup
- [ ] Monitoring and logging
- [ ] Beta testing program
- [ ] Production deployment
- [ ] Marketing and user acquisition

## 🛡️ Security & Compliance

### Implemented
- ✅ Input validation and sanitization
- ✅ HTTPS-ready configuration
- ✅ Secure authentication flow
- ✅ Privacy policy and terms of service

### Planned
- 🔄 JWT token security
- 🔄 Rate limiting and DDoS protection
- 🔄 Blockchain security best practices
- 🔄 GDPR compliance features
- 🔄 Security audit and penetration testing

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write responsive, mobile-first code
- Include proper error handling
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact & Support

- **Email**: hezronokwach@gmail.com
- **GitHub**: [Passa Repository](https://github.com/hezronokwach/Passa.git)
- **Issues**: Report bugs and request features via GitHub Issues

---

**Built with ❤️ for the global creator community**
