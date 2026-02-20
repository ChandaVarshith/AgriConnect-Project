import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import FarmerRegister from './pages/auth/FarmerRegister'
import ExpertSignup from './pages/auth/ExpertSignup'
import ForgotPassword from './pages/auth/ForgotPassword'

// Public Pages
import PublicHome from './pages/public/PublicHome'
import ExploreUs from './pages/public/ExploreUs'
import Community from './pages/public/Community'
import Marketplace from './pages/public/Marketplace'
import FarmVisit from './pages/public/FarmVisit'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageFarmers from './pages/admin/ManageFarmers'
import ManageExperts from './pages/admin/ManageExperts'
import ManageFinanciers from './pages/admin/ManageFinanciers'

// Farmer Pages
import FarmerHome from './pages/farmer/FarmerHome'
import SubmitQuery from './pages/farmer/SubmitQuery'
import MyResponsesFarmer from './pages/farmer/MyResponses'
import BrowseLoans from './pages/farmer/BrowseLoans'
import LoanApplication from './pages/farmer/LoanApplication'
import ExploreArticles from './pages/farmer/ExploreArticles'
import MarketplaceFarmer from './pages/farmer/MarketplaceFarmer'

// Expert Pages
import ExpertHome from './pages/expert/ExpertHome'
import FarmerRequests from './pages/expert/FarmerRequests'
import RespondToQuery from './pages/expert/RespondToQuery'
import MyResponsesExpert from './pages/expert/MyResponses'
import CreateArticle from './pages/expert/CreateArticle'
import CropSuitabilityMap from './pages/expert/CropSuitabilityMap'
import GeminiAssistance from './pages/expert/GeminiAssistance'

// Financier Pages
import FinancierHome from './pages/financier/FinancierHome'
import AddLoan from './pages/financier/AddLoan'
import LoanRequests from './pages/financier/LoanRequests'
import AllLoans from './pages/financier/AllLoans'

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<PublicHome />} />
                        <Route path="/explore" element={<ExploreUs />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/farm-visit" element={<FarmVisit />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/farmer" element={<FarmerRegister />} />
                        <Route path="/register/expert" element={<ExpertSignup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/farmers" element={<ProtectedRoute role="admin"><ManageFarmers /></ProtectedRoute>} />
                        <Route path="/admin/experts" element={<ProtectedRoute role="admin"><ManageExperts /></ProtectedRoute>} />
                        <Route path="/admin/financiers" element={<ProtectedRoute role="admin"><ManageFinanciers /></ProtectedRoute>} />

                        {/* Farmer Routes */}
                        <Route path="/farmer" element={<ProtectedRoute role="farmer"><FarmerHome /></ProtectedRoute>} />
                        <Route path="/farmer/query" element={<ProtectedRoute role="farmer"><SubmitQuery /></ProtectedRoute>} />
                        <Route path="/farmer/responses" element={<ProtectedRoute role="farmer"><MyResponsesFarmer /></ProtectedRoute>} />
                        <Route path="/farmer/loans" element={<ProtectedRoute role="farmer"><BrowseLoans /></ProtectedRoute>} />
                        <Route path="/farmer/loan-apply/:loanId" element={<ProtectedRoute role="farmer"><LoanApplication /></ProtectedRoute>} />
                        <Route path="/farmer/articles" element={<ProtectedRoute role="farmer"><ExploreArticles /></ProtectedRoute>} />
                        <Route path="/farmer/marketplace" element={<ProtectedRoute role="farmer"><MarketplaceFarmer /></ProtectedRoute>} />

                        {/* Expert Routes */}
                        <Route path="/expert" element={<ProtectedRoute role="expert"><ExpertHome /></ProtectedRoute>} />
                        <Route path="/expert/requests" element={<ProtectedRoute role="expert"><FarmerRequests /></ProtectedRoute>} />
                        <Route path="/expert/respond/:queryId" element={<ProtectedRoute role="expert"><RespondToQuery /></ProtectedRoute>} />
                        <Route path="/expert/responses" element={<ProtectedRoute role="expert"><MyResponsesExpert /></ProtectedRoute>} />
                        <Route path="/expert/article/create" element={<ProtectedRoute role="expert"><CreateArticle /></ProtectedRoute>} />
                        <Route path="/expert/crop-map" element={<ProtectedRoute role="expert"><CropSuitabilityMap /></ProtectedRoute>} />
                        <Route path="/expert/gemini" element={<ProtectedRoute role="expert"><GeminiAssistance /></ProtectedRoute>} />

                        {/* Financier Routes */}
                        <Route path="/financier" element={<ProtectedRoute role="financier"><FinancierHome /></ProtectedRoute>} />
                        <Route path="/financier/add-loan" element={<ProtectedRoute role="financier"><AddLoan /></ProtectedRoute>} />
                        <Route path="/financier/loan-requests" element={<ProtectedRoute role="financier"><LoanRequests /></ProtectedRoute>} />
                        <Route path="/financier/all-loans" element={<ProtectedRoute role="financier"><AllLoans /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    )
}

export default App
