# AgriConnect - Complete Project Structure & Files Documentation

## 📋 Project Overview
**AgriConnect** is a full-stack agricultural platform (MERN Stack) that connects farmers, experts, financiers, and administrators. It provides features for farm visits, loans, marketplace, AI-powered assistance, and community interactions.

**Tech Stack:**
- **Frontend**: React 18, Vite, React Router v6, Axios, Leaflet, React Quill
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT Auth, Bcrypt
- **Tools**: Multer (file upload), Nodemailer (email), Nodemon (dev)

---

## 📁 Complete Directory Structure

```
Agriconnect/
├── README (Root Level Configs)
│   ├── package.json                  # Root package (Monorepo setup)
│   ├── package-lock.json
│   ├── vite.config.js                # Root Vite config
│   ├── index.html                    # Root HTML entry
│   └── .gitignore
│
├── backend/                          # Node.js/Express Backend
│   ├── server.js                     # Main server entry point (67 lines)
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json
│   ├── .gitignore
│   │
│   ├── config/                       # Configuration Files
│   │   ├── db.js                     # MongoDB connection setup
│   │   └── mailer.js                 # Nodemailer configuration
│   │
│   ├── models/                       # Mongoose Database Models (14 models)
│   │   ├── Admin.model.js            # Admin user schema
│   │   ├── Farmer.model.js           # Farmer profile schema
│   │   ├── Expert.model.js           # Expert/Extension officer schema
│   │   ├── Financier.model.js        # Loan provider schema
│   │   ├── Article.model.js          # Educational articles
│   │   ├── Query.model.js            # Farmer queries/questions
│   │   ├── Response.model.js         # Expert responses to queries
│   │   ├── CommunityPost.model.js    # Community discussion posts
│   │   ├── FarmVisit.model.js        # Expert farm visit records
│   │   ├── Loan.model.js             # Loan product offerings
│   │   ├── LoanApplication.model.js  # Farmer loan applications
│   │   ├── OTP.model.js              # One-time password records
│   │   ├── Produce.model.js          # Marketplace produce listings
│   │   └── Produce.model.js          # Duplicate (check for consolidation)
│   │
│   ├── routes/                       # API Route Handlers (12 routes)
│   │   ├── auth.routes.js            # Authentication (login, signup, logout)
│   │   ├── admin.routes.js           # Admin management endpoints
│   │   ├── farmer.routes.js          # Farmer-specific routes
│   │   ├── expert.routes.js          # Expert-specific routes
│   │   ├── financier.routes.js       # Financier-specific routes
│   │   ├── query.routes.js           # Query/Q&A endpoints
│   │   ├── article.routes.js         # Article CRUD operations
│   │   ├── loan.routes.js            # Loan management
│   │   ├── community.routes.js       # Community posts
│   │   ├── farmvisit.routes.js       # Farm visit scheduling
│   │   ├── marketplace.routes.js     # Produce marketplace
│   │   ├── weather.routes.js         # Weather data
│   │   └── ai.routes.js              # AI assistance (Gemini)
│   │
│   ├── controllers/                  # Business Logic (13 controllers)
│   │   ├── auth.controller.js        # Auth logic (register, login, verify)
│   │   ├── admin.controller.js       # Admin operations
│   │   ├── farmer.controller.js      # (Implied) Farmer operations
│   │   ├── expert.controller.js      # (Implied) Expert operations
│   │   ├── article.controller.js     # Article CRUD logic
│   │   ├── query.controller.js       # Query management
│   │   ├── response.controller.js    # Response handling
│   │   ├── community.controller.js   # Community post logic
│   │   ├── farmvisit.controller.js   # Farm visit logic
│   │   ├── loan.controller.js        # Loan operations
│   │   ├── loanApplication.controller.js  # Application processing
│   │   ├── marketplace.controller.js # Marketplace logic
│   │   ├── weather.controller.js     # Weather API integration
│   │   └── ai.controller.js          # Gemini AI logic
│   │
│   ├── middleware/                   # Express Middleware (4 files)
│   │   ├── auth.middleware.js        # JWT token verification
│   │   ├── role.middleware.js        # Role-based access control
│   │   ├── error.middleware.js       # Global error handling
│   │   └── upload.middleware.js      # Multer file upload config
│   │
│   ├── utils/                        # Utility Functions (4 files)
│   │   ├── encrypt.js                # Password encryption (bcrypt)
│   │   ├── generateToken.js          # JWT token generation
│   │   ├── generateOTP.js            # One-time password generation
│   │   └── sendEmail.js              # Email sending via Nodemailer
│   │
│   ├── uploads/                      # File Storage Directory
│   │   ├── article-images/           # Article cover images
│   │   │   └── README.md
│   │   ├── documents/                # User documents (verification, etc.)
│   │   └── produce-images/           # Marketplace produce photos
│   │
│   └── seed-admin.js                 # Database seeding (admin users)
│   └── seed-expert.js                # Database seeding (expert users)
│
├── frontend/                         # React + Vite Frontend
│   ├── index.html                    # Main HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── package-lock.json
│   ├── vite.config.js                # Vite bundler config
│   ├── .gitignore
│   │
│   └── src/
│       ├── main.jsx                  # React app entry point
│       ├── App.jsx                   # Root app component
│       ├── index.css                 # Global styles
│       │
│       ├── context/                  # React Context (2 files)
│       │   ├── AuthContext.jsx       # Authentication state management
│       │   └── LanguageContext.jsx   # Multi-language support state
│       │
│       ├── components/               # Reusable React Components (15 files)
│       │   ├── Navbar.jsx            # Top navigation bar
│       │   ├── Sidebar.jsx           # Side navigation menu
│       │   ├── DashboardLayout.jsx   # Layout wrapper for dashboards
│       │   ├── PageLayout.jsx        # Generic page layout
│       │   ├── Modal.jsx             # Reusable modal dialog
│       │   ├── ArticleCard.jsx       # Article display card
│       │   ├── LoanCard.jsx          # Loan product card
│       │   ├── ProduceCard.jsx       # Marketplace produce card
│       │   ├── QueryCard.jsx         # Query/Q&A display card
│       │   ├── Pagination.jsx        # Table/list pagination
│       │   ├── ProtectedRoute.jsx    # Authenticated route wrapper
│       │   ├── WeatherWidget.jsx     # Weather display widget
│       │   ├── VoiceAssistant.jsx    # Speech recognition component
│       │   ├── GeminiPanel.jsx       # AI chat interface
│       │   └── LanguageSwitcher.jsx  # Language toggle component
│       │
│       ├── pages/                    # Page Components (40+ files)
│       │
│       ├── pages/auth/               # Authentication Pages (6 files)
│       │   ├── Login.jsx             # User login page
│       │   ├── SignupSelector.jsx    # Choose signup type
│       │   ├── FarmerRegister.jsx    # Farmer registration
│       │   ├── ExpertSignup.jsx      # Expert registration
│       │   ├── FinancierSignup.jsx   # Financier registration
│       │   └── ForgotPassword.jsx    # Password recovery
│       │
│       ├── pages/admin/              # Admin Panel Pages (4 files)
│       │   ├── AdminDashboard.jsx    # Admin overview
│       │   ├── ManageFarmers.jsx     # Farmer management
│       │   ├── ManageExperts.jsx     # Expert management
│       │   └── ManageFinanciers.jsx  # Financier management
│       │
│       ├── pages/farmer/             # Farmer Dashboard Pages (7 files)
│       │   ├── FarmerHome.jsx        # Farmer main dashboard
│       │   ├── SubmitQuery.jsx       # Submit Q&A to experts
│       │   ├── MyResponses.jsx       # View responses from experts
│       │   ├── ExploreArticles.jsx   # Browse expert articles
│       │   ├── BrowseLoans.jsx       # View available loans
│       │   ├── LoanApplication.jsx   # Apply for loan
│       │   └── MarketplaceFarmer.jsx # Sell produce
│       │
│       ├── pages/expert/             # Expert Dashboard Pages (7 files)
│       │   ├── ExpertHome.jsx        # Expert main dashboard
│       │   ├── FarmerRequests.jsx    # Incoming farmer queries
│       │   ├── RespondToQuery.jsx    # Answer farmer queries
│       │   ├── MyResponses.jsx       # View published responses
│       │   ├── CreateArticle.jsx     # Write educational articles
│       │   ├── GeminiAssistance.jsx  # AI-powered expert helper
│       │   └── CropSuitabilityMap.jsx # Interactive crop mapping
│       │
│       ├── pages/financier/          # Financier Pages (4 files)
│       │   ├── FinancierHome.jsx     # Financier dashboard
│       │   ├── AddLoan.jsx           # Create new loan product
│       │   ├── AllLoans.jsx          # View/manage loans
│       │   └── LoanRequests.jsx      # Review loan applications
│       │
│       ├── pages/public/             # Public Pages (5 files)
│       │   ├── PublicHome.jsx        # Landing page
│       │   ├── Marketplace.jsx       # Public produce marketplace
│       │   ├── Community.jsx         # Community discussion forum
│       │   ├── FarmVisit.jsx         # Farm visit booking
│       │   └── ExploreUs.jsx         # About/info page
│       │
│       ├── services/                 # API Integration Services (8 files)
│       │   ├── api.js                # Axios instance & base config
│       │   ├── authService.js        # Auth API calls
│       │   ├── articleService.js     # Article API integration
│       │   ├── queryService.js       # Query/Q&A API
│       │   ├── loanService.js        # Loan API calls
│       │   ├── marketplaceService.js # Marketplace API
│       │   ├── weatherService.js     # Weather API integration
│       │   └── geminiService.js      # Gemini AI API calls
│       │
│       └── utils/                    # Utility Functions (3 files)
│           ├── encrypt.js            # Client-side encryption utilities
│           ├── formatDate.js         # Date formatting helpers
│           └── translate.js          # Translation/i18n utilities
│
└── src/                              # Root src/ (Duplicate/Legacy)
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/                   # Components (duplicate of frontend/src)
    ├── context/
    ├── pages/
    ├── services/
    └── utils/
```

---

## 📊 File Count Summary

| Directory | Count | Purpose |
|-----------|-------|---------|
| Backend Models | 14 | Database schemas |
| Backend Routes | 12 | API endpoints |
| Backend Controllers | 13 | Business logic |
| Frontend Components | 15 | Reusable UI components |
| Frontend Pages | 35+ | Page/screen components |
| Frontend Services | 8 | API integration layers |
| Middleware | 4 | Request processing |
| Utils | 7 | Helper functions |
| **TOTAL** | **~150+** | **Complete application** |

---

## 🔑 Key Features Implemented

### 1. **Authentication & Authorization**
- Role-based users: Admin, Farmer, Expert, Financier
- JWT-based authentication
- OTP verification for signup
- Password encryption with bcrypt
- Protected routes

### 2. **Farmer Features**
- Submit agricultural queries to experts
- View responses and expert advice
- Browse & apply for loans
- Sell produce on marketplace
- Track loan applications

### 3. **Expert Features**
- Respond to farmer queries
- Create educational articles
- AI-powered Gemini assistance
- Crop suitability mapping
- Schedule farm visits

### 4. **Financier Features**
- Create & manage loan products
- Review loan applications
- Manage loan portfolio

### 5. **Admin Features**
- Manage farmers, experts, financiers
- Moderation capabilities
- System oversight dashboard

### 6. **Public Features**
- Marketplace browse (no login needed)
- Community discussions
- About/Info pages
- Weather information

### 7. **AI Integration**
- Gemini AI assistant for expert guidance
- Natural language query processing

### 8. **Marketplace**
- Produce listing & browsing
- Buy/sell functionality
- Product image uploads

---

## 🔄 API Routes Structure

### Authentication (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login
- POST `/verify-otp` - OTP verification
- POST `/logout` - User logout
- POST `/forgot-password` - Password reset

### Admin (`/api/admin`)
- GET `/farmers` - List all farmers
- GET `/experts` - List all experts
- GET `/financiers` - List all financiers
- DELETE `/user/:id` - Remove user

### Farmer (`/api/farmer`)
- GET `/profile` - Get profile
- PUT `/profile` - Update profile
- GET `/dashboard` - Dashboard data

### Expert (`/api/expert`)
- GET `/profile` - Get profile
- PUT `/profile` - Update profile
- GET `/dashboard` - Dashboard data

### Queries (`/api/queries`)
- POST `/` - Create query
- GET `/` - Get all queries
- GET `/:id` - Get single query
- PUT `/:id` - Update query

### Articles (`/api/articles`)
- POST `/` - Create article
- GET `/` - Get all articles
- GET `/:id` - Get single article
- PUT `/:id` - Update article
- DELETE `/:id` - Delete article

### Loans (`/api/loans`)
- POST `/` - Create loan product
- GET `/` - Get all loans
- GET `/:id` - Get loan details
- POST `/apply` - Apply for loan

### Marketplace (`/api/marketplace`)
- POST `/produce` - List produce
- GET `/produce` - Get all listings
- DELETE `/produce/:id` - Remove listing

### Community (`/api/community`)
- POST `/posts` - Create post
- GET `/posts` - Get all posts
- DELETE `/posts/:id` - Delete post

### Farm Visits (`/api/farmvisit`)
- POST `/` - Schedule visit
- GET `/` - Get all scheduled visits
- PUT `/:id` - Update visit

### Weather (`/api/weather`)
- GET `/:location` - Get weather data

### AI (`/api/ai`)
- POST `/chat` - Chat with Gemini
- POST `/analyze` - Analyze agricultural data

---

## 🛡️ Security Features

1. **Authentication**: JWT tokens in headers
2. **Authorization**: Role-based middleware
3. **Password Security**: Bcrypt hashing
4. **CORS**: Cross-origin protection
5. **Input Validation**: Server-side validation
6. **File Upload**: Multer with restrictions
7. **Environment Variables**: Sensitive config in .env

---

## 🗄️ Database Models

### User Models
- **Admin** - System administrators
- **Farmer** - Agricultural users
- **Expert** - Domain experts/extension officers
- **Financier** - Loan providers

### Content Models
- **Article** - Educational content by experts
- **Query** - Farmer questions
- **Response** - Expert answers
- **CommunityPost** - Discussion forum posts

### Transaction Models
- **Loan** - Loan product offerings
- **LoanApplication** - Farmer loan requests
- **Produce** - Marketplace product listings
- **FarmVisit** - Expert visit scheduling records

### Utility Models
- **OTP** - One-time passwords for verification

---

## 🚀 Running the Application

### Backend
```bash
cd backend
npm install
npm run dev  # Or: npm start for production
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Root Level (Monorepo)
```bash
npm install
npm run dev
```

---

## 📝 Environment Variables (Backend .env)

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://...
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_key
WEATHER_API_KEY=your_weather_api_key
```

---

## 📦 Dependencies

### Backend
- express, mongoose, cors, dotenv
- bcryptjs, jsonwebtoken
- multer, nodemailer
- axios (for external APIs)

### Frontend
- react, react-dom, react-router-dom
- axios
- react-leaflet, leaflet (mapping)
- react-quill (rich text editor)
- react-speech-recognition (voice)

---

## 🎯 Project Goals

- **Connect Stakeholders**: Bridge farmers, experts, and financiers
- **Knowledge Sharing**: Educational articles and query-response system
- **Financial Inclusion**: Simplified loan application and management
- **Market Access**: Marketplace for direct produce sales
- **AI-Powered Assistance**: Gemini integration for expert guidance
- **Community Building**: Discussion forums and peer support
- **Accessibility**: Multi-language support and voice assistance

---

**Last Updated**: February 2026
**Project Status**: Active Development
**Stack**: MERN (MongoDB, Express, React, Node.js)
