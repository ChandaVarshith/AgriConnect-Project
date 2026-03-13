# 🌾 AgriConnect: Empowering Farmers for a Sustainable Future

AgriConnect is a comprehensive, role-based MERN-stack platform designed to eliminate the friction in modern agriculture. It serves as a unified ecosystem connecting **Farmers**, **Agricultural Experts**, **Financial Institutions**, and the **General Public**.

By leveraging Artificial Intelligence for instant crop disease detection, secure micro-loan pipelines, and a direct-to-consumer marketplace, AgriConnect digitizes and accelerates the agricultural lifecycle.

---

## 🎯 The Core Problem & Solution

**The Gap:** Rural farmers lack immediate access to scientific agronomy, secure financial capital, and direct consumer markets. Middlemen deplete profit margins, and language barriers make existing software inaccessible.

**The AgriConnect Solution:**
1. **Instant Diagnostics:** Google Gemini AI powers instant crop disease detection from uploaded photos, giving farmers immediate, actionable treatment plans without waiting days for an agronomist's visit.
2. **Direct Expert Access:** A built-in Q&A system connects farmers directly with verified agricultural scientists for complex issues.
3. **Financial Inclusion:** A role-specific dashboard allows Financiers to post micro-loans and securely review applications from farmers based on their platform portfolio.
4. **Direct-to-Consumer Commerce:** An auction-style marketplace where farmers sell fresh produce directly to the public. To ensure quality, all listings must pass an **Expert Quality Control** review before going live.
5. **Localization:** The platform is fully responsive and supports dynamic translation (English, Hindi, Telugu, Spanish) to serve rural users natively.

---

## 👥 Role-Based Architecture

The platform features strict Role-Based Access Control (RBAC) powered by JWT middlewares.

* 👨‍🌾 **Farmer:** Can submit queries, apply for loans, upload produce for sale, run AI disease detection, and consume educational content.
* 👩‍🔬 **Expert:** Moderates the ecosystem. Approves/rejects marketplace listings, responds to farmer tickets, and publishes agricultural articles.
* 🏦 **Financier:** Creates capital products (loans) and manages a portfolio of farmer applications.
* 👤 **Public Buyer:** Browses the expert-approved marketplace to buy produce directly from farmers, and learns about agriculture via the community and articles. Authenticates simply via Google OAuth.
* 🛡️ **Admin:** Governs platform integrity by verifying Expert and Financier signups and managing global platform statistics.

---

## 🛠️ The Technology Stack

### **Frontend**
* **React.js 18 (Vite):** Utilized for fast compilation and optimized production builds.
* **Context API:** Handles global state management for User Authentication and UI Localization.
* **Custom CSS (Glassmorphism):** Completely custom vanilla CSS utilizing backdrop-filters and flexbox/grid for a modern, responsive, application-like experience across all devices.
* **Lucide-React:** Lightweight SVG iconography.
* **Recharts:** Live data visualization on the Admin dashboard.
* **React Leaflet:** Interactive mapping.

### **Backend**
* **Node.js & Express.js:** RESTful API architecture.
* **MongoDB & Mongoose:** Highly flexible NoSQL database to support the heavily divergent data structures across the 5 user roles.
* **JSON Web Tokens (JWT) & Bcrypt.js:** Stateless authentication and password cryptography.

### **Third-Party Integrations & Microservices**
* **Cloudinary:** Decoupled external CDN for processing and hosting all image assets (produce listings, article covers, disease photos) to ensure database scalability.
* **Nodemailer:** Automated SMTP pipeline for OTP verification and Help Center routing.
* **Google OAuth 2.0:** Secure single-sign-on (SSO) for Public users.
* **OpenRouter / Google Gemini API:** Powers the AI chatbot capabilities and crop disease analysis.
* **OpenWeather API:** Real-time localized weather data.

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **Git** installed on your machine. You will also need a **MongoDB** instance (local or Atlas) and a **Cloudinary** account.

### 2. Clone the Repository
```bash
git clone https://github.com/ChandaVarshith/AgriConnect-Project.git
cd AgriConnect-Project
```

### 3. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<your_mongo_credentials>
   JWT_SECRET=your_super_secret_jwt_string
   CLIENT_URL=http://localhost:3000
   SERVER_URL=http://localhost:5000
   
   # APIs
   OPENROUTER_API_KEY=your_gemini_key
   WEATHER_API_KEY=your_openweather_key
   
   # Email Services
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   
   # Cloud Storage
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   
   # Google SSO
   GOOGLE_CLIENT_ID=your_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_oauth_secret
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### 4. Frontend Setup
1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` directory with the following variables:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_OPENROUTER_API_KEY=your_gemini_key
   VITE_WEATHER_API_KEY=your_openweather_key
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 5. Access the App
Open your browser and navigate to `http://localhost:3000` (or the port Vite provides) to view the application!

---

## 🗺️ Project Structure
For a complete, in-depth look at every single page, component, database schema, and API endpoint, please refer to the detailed [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) file included in this repository.
