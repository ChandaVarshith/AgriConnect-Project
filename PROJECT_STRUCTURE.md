# AgriConnect — Complete Platform Documentation

---

## 🌾 What Is AgriConnect?

**AgriConnect** is a full-stack web platform built to solve the real problems faced by Indian farmers. It bridges the gap between **farmers**, **agricultural experts**, **loan providers (financiers)**, and **buyers (public)** — all in one place.

The platform is built on the **MERN Stack** (MongoDB, Express, React, Node.js).

### The Problem It Solves

| Problem | AgriConnect Solution |
|---------|---------------------|
| Farmers can't get expert advice easily | Built-in Q&A system: farmers post queries, experts respond |
| Farmers can't find loans | Loan marketplace where financiers post products, farmers apply |
| Farmers struggle to sell produce | Expert-moderated auction-style produce marketplace |
| Language barriers for rural users | Multilingual UI: English, Hindi, Telugu, Spanish |
| No weather info before farming decisions | Live weather widget on the dashboard |
| Outdated knowledge & techniques | Expert-authored article library |
| No platform connection for buyers | Public marketplace to browse and directly contact farmers |

### Who Uses It?

| Role | What They Do |
|------|-------------|
| 🌱 **Farmer** | Submit queries, apply for loans, sell produce, read articles |
| 👩‍🔬 **Expert** | Answer farmer queries, write articles, approve/reject produce listings |
| 🏦 **Financier** | Post loan products, review farmer loan applications |
| 🛒 **Public (Buyer)** | Browse approved produce, contact farmers directly to buy |
| 🛡️ **Admin** | Oversee all users and platform stats via dashboard |

---

## 🏗️ How the App is Built

```
AgriConnect/
├── backend/          ← Node.js + Express API server (PORT 5000)
│   ├── models/       ← MongoDB data schemas (Mongoose)
│   ├── routes/       ← URL endpoint definitions
│   ├── controllers/  ← Business logic for each endpoint
│   ├── middleware/   ← JWT auth, roles, file uploads, error handling
│   ├── utils/        ← Email, tokens, OTP, encryption helpers
│   └── uploads/      ← Stored images (articles, produce photos)
│
└── frontend/         ← React 18 + Vite (PORT 5173)
    └── src/
        ├── components/  ← Reusable UI building blocks
        ├── pages/       ← One folder per user role
        ├── context/     ← Global state (AuthContext, LanguageContext)
        └── services/    ← Axios functions that call the backend API
```

---

## 🌐 Page-by-Page Breakdown

---

### 🔓 Public Landing Page (No Login Required)

#### `PublicHome.jsx`
The **first page** visitors see when they open the website.

- Full-screen farm background image (Unsplash)
- Hero section with the tagline **"Empowering Farmers for a Sustainable Future"**
- Two call-to-action buttons: **Sign In** and **Register as Farmer**
- Scroll-down button that animates to a second section
- **Platform Overview section**: Two side-by-side cards showing:
  - ⚠️ **The Problem** — 7 real farmer pain points (disconnection, finance gaps, language barriers, etc.)
  - ✅ **AgriConnect Solution** — 7 matching solutions the platform provides
- Role badges: Admin · Farmer · Expert · Financier · Public
- "Get Started Today" CTA button

---

### 👩‍🌾 Farmer Section

#### `FarmerHome.jsx` — Farmer Dashboard
The **entry screen** after a farmer logs in.

- Glassmorphism hero with a farm background image
- Welcome heading and inspirational farming quote (both translated based on the farmer's preferred language)
- **5 Quick Action buttons**, each with icon + color accent:
  - 🌾 Send Crop Suggestion Request → `/farmer/query`
  - 💬 View All Responses → `/farmer/responses`
  - 🏦 View All Loans → `/farmer/loans`
  - 📰 Explore Farming Content → `/farmer/articles`
  - 🛒 Sell Your Produce → `/farmer/marketplace`
- All labels are **translated** using the LanguageContext (supports English, Telugu, Hindi, Spanish)

#### `SubmitQuery.jsx` — Ask an Expert
- Form to type a crop/farming question and submit it to experts
- Submitted query goes into the shared query pool that experts see

#### `MyResponses.jsx` — View Expert Answers
- Lists all queries the farmer submitted with:
  - The original question
  - Expert's response (if answered)
  - Status badge (Pending / Answered)

#### `ExploreArticles.jsx` — Read Expert Articles
- Grid of article cards written by experts
- Each card has: cover image, title, description preview, author name, date
- Click to open full article

#### `BrowseLoans.jsx` — View Available Loans
- Lists all loan products posted by financiers
- Shows interest rate, max amount, tenure, eligibility conditions
- Button to apply for each loan

#### `LoanApplication.jsx` — Apply for a Loan
- Form with: loan amount, purpose, land area, expected repayment
- Submits a loan application tied to the farmer's profile

#### `AppliedLoans.jsx` — Track Loan Status
- Shows all loans the farmer has applied for
- Status badge: Pending / Approved / Rejected

#### `MarketplaceFarmer.jsx` ⭐ — Sell Produce (Auction-Style)
This is the **core commerce page** for farmers. It has multiple interactive sections:

**Top Bar:**
- Live count of approved listings in the marketplace
- **📋 Pending Requests button** — shows count badge of own pending listings; click to open a drawer showing all listings awaiting expert approval
- **+ Add New Listing button** — expands an inline form

**Add Listing Form (inline, no page redirect):**
- Fields: Produce Name, Category (dropdown: Vegetables/Fruits/Grains/Dairy/Other), Quantity, Unit (kg/quintal/tonne), Price per unit (₹), Description, Harvest Date
- On submit: listing is created in DB with `status: "pending"`, `available: false` — **not visible to the public yet**
- Toast: "✅ Listing submitted! Waiting for expert approval."
- Pending drawer auto-opens so farmer sees their new listing immediately

**Pending Requests Drawer:**
- Shows only the farmer's own listings where `status === "pending"`
- Clearly labeled: "waiting for expert approval"
- Each card shows: name, category badge, quantity, price, description

**Main Listings Grid (Search + Filter + Sort):**
- 🔍 Search bar — searches by produce name
- Category tabs — All / Vegetables / Fruits / Grains / Dairy / Other
- Sort dropdown — Newest First / Name A–Z / Price Low→High / Price High→Low
- **"Your Listings" section** — only your approved produce (green border cards, Remove button)
- **"Other Farmers" section** — all other approved produce from other farmers (shows their name + phone)

**💬 My Messages Widget (bottom-right floating button):**
- Badge shows count of the farmer's rejected listings
- Click to open a popup showing:
  - Which expert reviewed it (`rejectedByEmail`)
  - The produce name, quantity, price
  - ❌ **Expert's rejection reason** — so farmer knows exactly what to fix
  - "Dismiss" button → deletes the listing from DB and farmer can create a fresh one

---

### 👩‍🔬 Expert Section

#### `ExpertHome.jsx` — Expert Dashboard
- Glassmorphism hero with agricultural background
- **7 clickable navigation cards**, each with emoji + description + color accent:
  - 📩 Farmer Requests, ✍️ My Responses, 📰 All Content, ➕ Create Article
  - 🛒 Marketplace (approve/reject), 🤖 Gemini AI, 🗺️ Crop Map

#### `FarmerRequests.jsx` — View Farmer Queries
- Lists all queries submitted by farmers across the platform
- Expert can click to open and respond

#### `RespondToQuery.jsx` — Answer a Query
- Shows the farmer's question in full
- Text area for expert to type detailed response
- Submit sends response tied to the query

#### `MyResponses.jsx` — Expert's Published Responses
- All queries the expert has already responded to
- Shows query text + expert's response + date

#### `CreateArticle.jsx` — Write an Article
- Rich text editor (React Quill) for writing long-form content
- Fields: Title, Category, Cover Image upload (Multer), Content
- All styles in external `CreateArticle.css` (no inline styles)

#### `ExpertAllContent.jsx` — Manage Articles
- Table/grid of all articles the expert has created
- Edit and delete buttons per article

#### `ExpertMarketplace.jsx` ⭐ — Approve/Reject Farmer Produce
The expert's **quality control interface** for the marketplace.

**Controls Bar:**
- Search (by farmer name, phone, or produce name)
- Category tabs — All / Vegetables / Fruits / Grains / Dairy / Other
- Sort dropdown — Newest / By Farmer Phone / By Farmer Name / Produce A–Z / Price Low→High

**⏳ Pending Approval section:**
- All produce listings from ALL farmers waiting for review
- Each card shows: produce name, category, quantity, price, description, farmer name + phone, harvest date
- Two action buttons:
  - ✓ **Approve** → listing is immediately set to `status: "approved"`, `available: true` → goes live on public marketplace instantly
  - ✕ **Reject** → opens an inline textarea for the expert to type a rejection reason → on confirm, sends `rejectionReason + rejectedByEmail` (expert's JWT email) back to the farmer via My Messages

**✅ All Active Listings section:**
- All currently live/approved listings across the platform
- Expert can still **Remove** a listing (sets it back to rejected/unavailable)

#### `GeminiAssistance.jsx` — AI Help
- Chat interface powered by Google Gemini AI
- Expert can ask agricultural questions, get AI-generated insights and analysis

#### `CropSuitabilityMap.jsx` — Crop Map
- Interactive map (React Leaflet) showing which crops are suitable for which regions
- Expert can visualize geographic crop data

---

### 🏦 Financier Section

#### `FinancierHome.jsx` — Financier Dashboard
- Glassmorphism hero with financial/stock market background
- **4 clickable action cards** with hover color animations:
  - ➕ Add Loan — create a new loan product
  - 📋 Loan Requests — review farmer applications
  - 📊 All Loans — view and manage all products
  - 👨‍🌾 Farmer Portfolio — applications grouped by farmer

#### `AddLoan.jsx` — Create Loan Product
- Form: Loan name, interest rate (%), max amount, tenure (months), eligibility conditions, description
- Submitted loan appears in the Farmer's Browse Loans page

#### `AllLoans.jsx` — Manage Loan Products
- Table of all loans the financier has posted
- Edit / Delete buttons per loan

#### `LoanRequests.jsx` — Review Applications
- All loan applications received from farmers
- Shows farmer's name, requested amount, purpose
- Approve / Reject actions per application

---

### 🛡️ Admin Section

#### `AdminDashboard.jsx` — Platform Overview
- **5 stat cards** pulled live from the API:
  - Total Farmers (green), Active Experts (blue), Financiers (amber), Total Queries (purple), Active Loans (pink)
- **3 Recharts visualizations**:
  - 🥧 **Users by Role** — Pie chart (Farmers / Experts / Financiers)
  - 🍩 **Query Status** — Donut chart (Pending / Resolved queries)
  - 📊 **System Activity** — Bar chart (Queries count / Loans count)
- All charts use custom tooltips and are fully responsive

#### `ManageFarmers.jsx` — Farmer Management
- Search bar (searches by name, phone, district, state, primary crops)
- Sort dropdown (Newest / A–Z / Farm Size Large→Small / Farm Size Small→Large)
- Compact card grid for each farmer showing:
  - Language badge, farm size badge, name, phone, email, district, state, crops, join date
- **+ Add Farmer button** — inline form to create a new farmer directly (name, phone, password, email, district, state, farm size, crops, preferred language)
- 🗑️ **Remove Farmer** button — confirms before permanently deleting

#### `ManageExperts.jsx` — Expert Management
- Same searchable, sortable grid pattern as ManageFarmers
- Shows: expert's specialization, credentials, contact info
- Add Expert and Remove Expert actions

#### `ManageFinanciers.jsx` — Financier Management
- Searchable grid with financier details
- Add and Remove actions consistent with the other manage pages

#### `AddNewSector.jsx` — Add Produce Categories
- Form to add new sector/category names for the marketplace
- Keeps produce categories dynamic and extensible

---

### 🌐 Public (Authenticated Buyers)

#### `PublicUserHome.jsx` — Buyer Dashboard
- Same `DashboardLayout` used by Farmers, Experts, and Financiers (fully consistent UI)
- Farm background image with glassmorphism welcome text
- Personalized greeting: "Welcome, [User Name]!"
- **3 Quick Action buttons**:
  - 📰 Explore Content — browse expert articles
  - 🌱 Learn Farming — farming guides and tips
  - 🛒 Buy Resources → goes to the auction board

#### `PublicBuyResources.jsx` ⭐ — The Auction Board (Buyer's Marketplace)
This is where **buyers discover and contact farmers** directly.

- Only shows **expert-approved listings** (quality-gated — no unverified produce visible)
- Header subtitle: "Browse expert-approved produce directly from farmers"
- **3 cascading filters (applied in order)**:
  1. 🔍 **Search** — real-time, filters by produce name OR category keyword
  2. 🗂️ **Category Tabs** — All / Vegetables / Fruits / Grains / Dairy / Other
  3. ⬆️⬇️ **Sort** — Newest First / A–Z / Price Low→High / Price High→Low
- **Listing cards** show: produce image (if uploaded), name, category badge, price per unit (₹), quantity available, description
- **📞 Contact Farmer button** (per card):
  - On click: makes an API call to `/marketplace/:id/purchase`
  - Backend reveals the farmer's name + phone number
  - Button transforms to show: "✓ Farmer Contact Revealed" with farmer's name and phone number
  - No payment gateway — buyers contact farmers directly (phone/WhatsApp)

#### `PublicContent.jsx` — Browse Expert Articles
- Grid of articles written and published by experts
- Public buyers can read farming guides and crop information

#### `PublicLearnFarming.jsx` — Learn Farming
- Curated farming guides, seasonal tips, best practices
- Educational cards with farming knowledge

#### `Community.jsx` — Community Forum
- Discussion board where users can post and read farming discussions
- Open community for advice sharing

#### `FarmVisit.jsx` — Book a Farm Visit
- Form for scheduling an expert to visit the farm
- Selects date, purpose, location

---

## 🔄 The Produce Listing Flow (End-to-End)

This is the **most important flow** in the application:

```
1. FARMER fills the "Add New Listing" form
   → Listing saved in DB: status="pending", available=false
   → Toast: "Waiting for expert approval"
   → Pending Requests drawer opens showing the submission

2. EXPERT opens ExpertMarketplace
   → Sees the listing in "Pending Approval" section with farmer's details
   → Reviews the listing

   IF APPROVED:
   → Listing: status="approved", available=true
   → Listing immediately appears in PublicBuyResources (buyers can see it)
   → Listing also appears in "Your Listings" section in MarketplaceFarmer

   IF REJECTED:
   → Expert types rejection reason (required field) in the inline textarea
   → Listing: status="rejected", rejectionReason=<text>, rejectedByEmail=<expert's email>
   → Listing disappears from expert view (not publicly visible)
   → Farmer's "💬 My Messages" badge count increases

3. FARMER opens "My Messages" widget
   → Sees: which expert reviewed it, produce name, price, quantity
   → Sees: the rejection reason ("e.g. Produce image is missing, price too high")
   → Clicks "Dismiss" → listing is permanently deleted from DB
   → Farmer clicks "+ Add New Listing" → submits a corrected listing

4. PUBLIC BUYER opens PublicBuyResources
   → Sees all approved listings
   → Searches / filters / sorts to find desired produce
   → Clicks "📞 Contact Farmer"
   → Farmer's name and phone number are revealed
   → Buyer calls/WhatsApps the farmer directly
```

---

## 🗄️ Database Models (What's Stored in MongoDB)

### Produce (Marketplace Listing)
The most complex model. Every field explained:

| Field | Type | Purpose |
|-------|------|---------|
| `farmerId` | ObjectId → Farmer | Which farmer owns this listing |
| `name` | String | Produce name (e.g. "Tomato", "Rice") |
| `description` | String | Details about the produce |
| `category` | String | vegetables / fruits / grains / dairy / other |
| `quantity` | Number | Amount available |
| `unit` | String | kg / quintal / tonne |
| `price` | Number | Price per unit in ₹ |
| `images` | [String] | Array of image file paths |
| `status` | String | `pending` → `approved` or `rejected` |
| `available` | Boolean | `false` until approved; `true` once expert approves |
| `rejectionReason` | String | Expert's written reason if rejected |
| `rejectedByEmail` | String | Expert's email — shown to farmer in My Messages |
| `farmerName` | String | Cached at listing time for fast public display |
| `farmerPhone` | String | Revealed to buyer only after "Contact Farmer" click |
| `createdAt` | Date | Auto-timestamp (Mongoose) |

### Other Models

| Model | Purpose |
|-------|---------|
| `Farmer` | Profile: name, phone, district, state, farm size, primary crops, preferred language |
| `Expert` | Profile: name, email, specialization, credentials |
| `Financier` | Profile: name, organization, contact |
| `Admin` | System administrator accounts |
| `Query` | A question submitted by a farmer to experts |
| `Response` | Expert's answer to a query (linked to Query) |
| `Article` | Expert-authored educational post with rich text + cover image |
| `Loan` | A loan product created by a financier (interest rate, amount, tenure) |
| `LoanApplication` | A farmer's application for a specific loan product |
| `CommunityPost` | A discussion post in the community forum |
| `FarmVisit` | A farm visit request with date and location |
| `OTP` | One-time passwords for signup verification (TTL-based) |

---

## ⚙️ Backend API — All Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register new user (farmer/expert/financier/public)
- `POST /login` — Login and receive JWT token
- `POST /verify-otp` — Verify OTP sent to email during signup
- `POST /logout` — Invalidate session
- `POST /forgot-password` — Send password reset link

### Admin (`/api/admin`)
- `GET /stats` — Platform-wide counts (farmers, experts, financiers, queries, loans)
- `GET /query-stats` — Query pending vs resolved breakdown for charts
- `GET /farmers` — List all farmers
- `POST /farmers` — Add a new farmer (admin action)
- `DELETE /farmers/:id` — Remove a farmer
- `GET /experts` — List all experts
- `GET /financiers` — List all financiers

### Farmer (`/api/farmer`)
- `GET /profile` — Get farmer's profile
- `PUT /profile` — Update farmer's profile

### Expert (`/api/expert`)
- `GET /profile` — Get expert's profile
- `PUT /profile` — Update expert's profile

### Queries (`/api/queries`)
- `POST /` — Farmer submits a query
- `GET /` — Get all queries (experts see all; farmers see their own)
- `GET /:id` — Get a single query
- `PUT /:id` — Expert responds to query

### Articles (`/api/articles`)
- `POST /` — Expert creates an article (with image upload)
- `GET /` — Get all published articles
- `GET /:id` — Get a single article
- `PUT /:id` — Update an article
- `DELETE /:id` — Delete an article

### Loans (`/api/loans`)
- `POST /` — Financier creates a loan product
- `GET /` — Get all loan products
- `GET /:id` — Get one loan
- `POST /apply` — Farmer applies for a loan
- `GET /applications` — Financier sees all received applications

### Marketplace (`/api/marketplace`) ⭐
| Endpoint | Who Uses It | What It Does |
|----------|------------|-------------|
| `POST /` | Farmer | Create listing → status=pending, available=false |
| `GET /` | Public / Expert | Get all **approved** listings |
| `GET /farmer/my` | Farmer | Get only the logged-in farmer's own listings |
| `GET /farmer/all` | Farmer | Get all approved + own pending/rejected (with _isOwner flag) |
| `GET /expert/pending` | Expert | Get all listings with status=pending |
| `PUT /:id/approve` | Expert | Approve → status=approved, available=true |
| `PUT /:id/reject` | Expert | Reject → saves reason + expert email, available=false |
| `DELETE /:id` | Farmer | Delete own listing (any status) |
| `DELETE /:id/expert-remove` | Expert | Remove an already-approved live listing |
| `POST /:id/purchase` | Public | Reveal farmer contact (name + phone) |

### Community (`/api/community`)
- `POST /posts` — Create a community post
- `GET /posts` — Get all posts
- `DELETE /posts/:id` — Delete a post

### Farm Visits (`/api/farmvisit`)
- `POST /` — Schedule a visit
- `GET /` — Get all visits
- `PUT /:id` — Update visit details

### Weather (`/api/weather`)
- `GET /:location` — Fetch live weather data for any location

### AI (`/api/ai`)
- `POST /chat` — Send a message to Gemini AI, get a response

---

## 🧩 Reusable Components

| Component | What It Does |
|-----------|-------------|
| `DashboardLayout` | Hero layout used for all home screens: full-page background image + glassmorphism welcome text + children below. Used by Farmer, Expert, Financier, and Public home pages |
| `PageLayout` | Sidebar + Navbar wrapper used for all inner pages (non-home screens). Has role-based sidebar links |
| `Navbar` | Top bar with logo, language switcher (🌐), hamburger menu |
| `Sidebar` | Left sidebar with navigation links relevant to the role |
| `ProduceCard` | Card to display a single produce listing (name, price, qty, category) |
| `ArticleCard` | Card to display an expert article (title, author, date, preview) |
| `LoanCard` | Card to display a loan product (interest, amount, tenure) |
| `QueryCard` | Card showing a farmer's Q&A query and status |
| `WeatherWidget` | Live weather data display for a given location |
| `GeminiPanel` | Floating AI chat panel accessible across the app |
| `VoiceAssistant` | Microphone-based voice query input (React Speech Recognition) |
| `LanguageSwitcher` | Toggle between English / Telugu / Hindi / Spanish |
| `Modal` | Generic reusable popup dialog |
| `Pagination` | Navigate through long lists/tables |
| `ProtectedRoute` | Wrapper that redirects un-authenticated or wrong-role users |

---

## 🌍 Multilingual Support

The platform supports 4 languages: **English, Telugu, Hindi, Spanish**

- Controlled by `LanguageContext.jsx`
- Farmer selects preferred language during registration
- All Farmer-facing UI text uses `t('key')` translation function
- Keys include: welcome messages, quick action labels, quotes, field labels

---

## 🔐 Security

| Layer | Mechanism |
|-------|----------|
| **Authentication** | JWT tokens sent in `Authorization: Bearer <token>` header |
| **Role Control** | Every protected route checks `req.user.role` via `role.middleware.js` |
| **Password Storage** | bcryptjs hashing — plain passwords never stored |
| **File Uploads** | Multer restricts file type and size, stores in `/uploads/` |
| **CORS** | Only allows requests from the frontend `CLIENT_URL` |
| **OTP** | Email-based one-time passwords for signup verification |
| **Env Variables** | All secrets (JWT secret, DB URI, API keys) in `.env` file |

---

## 🚀 Running the Project

### Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev       # Runs on http://localhost:5000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev       # Runs on http://localhost:5173
```

### Required `.env` (inside `/backend/`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret_key
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_key
WEATHER_API_KEY=your_weather_api_key
```

---

## 📦 Tech Stack & Libraries

### Backend
| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |
| `mongoose` | MongoDB ORM / schema definitions |
| `cors` | Cross-origin request handling |
| `dotenv` | Load environment variables from `.env` |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT creation and verification |
| `multer` | File uploads (images) |
| `nodemailer` | Send emails (OTP, notifications) |
| `axios` | HTTP client for external API calls (weather, AI) |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing and navigation |
| `axios` | API calls to backend |
| `react-leaflet` + `leaflet` | Interactive crop suitability map |
| `react-quill` | Rich text editor for expert articles |
| `recharts` | Charts on Admin Dashboard (Pie, Bar) |
| `react-speech-recognition` | Voice input for queries |

---

## 📝 Project Status

**Last Updated:** March 2026
**Status:** Active Development
**Core Features:** ✅ Complete and working
**In Progress:** Authentication edge cases (forgot password, advanced OTP flow)

### ✅ Completed Features
- All role dashboards (Farmer, Expert, Financier, Admin, Public)
- **Full auction-style marketplace** with Farmer → Expert → Public pipeline
- Expert approve/reject with feedback loop to farmer
- Admin dashboard with live Recharts visualizations
- Multilingual support (4 languages)
- Loan marketplace (create, apply, review)
- Q&A system (submit query → expert responds)
- Expert article library with rich text editor
- AI assistant (Gemini integration)
- Interactive crop suitability map
- Weather widget
- Community discussion forum
- Farm visit scheduling

### 🔧 Known In-Progress
- Forgot password / password reset flow
- Advanced OTP signup steps
- Produce image upload in marketplace form (backend ready, frontend form pending)
