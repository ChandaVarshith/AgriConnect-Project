import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import SignupSelector from './pages/auth/SignupSelector'
import FarmerRegister from './pages/auth/FarmerRegister'
import ExpertSignup from './pages/auth/ExpertSignup'
import FinancierSignup from './pages/auth/FinancierSignup'
import PublicRegister from './pages/auth/PublicRegister'
import ForgotPassword from './pages/auth/ForgotPassword'
import GoogleCallback from './pages/auth/GoogleCallback'

// Pre-auth Public Pages (landing)
import PublicHome from './pages/public/PublicHome'
import ExploreUs from './pages/public/ExploreUs'
import Community from './pages/public/Community'
import Marketplace from './pages/public/Marketplace'
import FarmVisit from './pages/public/FarmVisit'

// Authenticated Public User Pages
import PublicUserHome from './pages/public/PublicUserHome'
import PublicContent from './pages/public/PublicContent'
import PublicLearnFarming from './pages/public/PublicLearnFarming'
import PublicBuyResources from './pages/public/PublicBuyResources'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageFarmers from './pages/admin/ManageFarmers'
import ManageExperts from './pages/admin/ManageExperts'
import ManageFinanciers from './pages/admin/ManageFinanciers'
import AddNewSector from './pages/admin/AddNewSector'

// Farmer Pages
import FarmerHome from './pages/farmer/FarmerHome'
import CropDiseaseDetection from './pages/farmer/CropDiseaseDetection'
import SubmitQuery from './pages/farmer/SubmitQuery'
import MyResponsesFarmer from './pages/farmer/MyResponses'
import BrowseLoans from './pages/farmer/BrowseLoans'
import LoanApplication from './pages/farmer/LoanApplication'
import ExploreArticles from './pages/farmer/ExploreArticles'
import MarketplaceFarmer from './pages/farmer/MarketplaceFarmer'
import AppliedLoans from './pages/farmer/AppliedLoans'

// Expert Pages
import ExpertHome from './pages/expert/ExpertHome'
import FarmerRequests from './pages/expert/FarmerRequests'
import RespondToQuery from './pages/expert/RespondToQuery'
import MyResponsesExpert from './pages/expert/MyResponses'
import CreateArticle from './pages/expert/CreateArticle'
import ExpertAllContent from './pages/expert/ExpertAllContent'
import ExpertMarketplace from './pages/expert/ExpertMarketplace'
import CropSuitabilityMap from './pages/expert/CropSuitabilityMap'
import AgriBotAssistance from './pages/expert/AgriBotAssistance'

// Financier Pages
import FinancierHome from './pages/financier/FinancierHome'
import AddLoan from './pages/financier/AddLoan'
import LoanRequests from './pages/financier/LoanRequests'
import AllLoans from './pages/financier/AllLoans'
import FarmerLoans from './pages/financier/FarmerLoans'

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <Routes>
                        {/* Pre-auth Landing Pages */}
                        <Route path="/" element={<PublicHome />} />
                        <Route path="/explore" element={<ExploreUs />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/farm-visit" element={<FarmVisit />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignupSelector />} />
                        <Route path="/register/farmer" element={<FarmerRegister />} />
                        <Route path="/register/expert" element={<ExpertSignup />} />
                        <Route path="/register/financier" element={<FinancierSignup />} />
                        <Route path="/register/public" element={<PublicRegister />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/google-callback" element={<GoogleCallback />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/farmers" element={<ProtectedRoute role="admin"><ManageFarmers /></ProtectedRoute>} />
                        <Route path="/admin/experts" element={<ProtectedRoute role="admin"><ManageExperts /></ProtectedRoute>} />
                        <Route path="/admin/financiers" element={<ProtectedRoute role="admin"><ManageFinanciers /></ProtectedRoute>} />
                        <Route path="/admin/sectors" element={<ProtectedRoute role="admin"><AddNewSector /></ProtectedRoute>} />

                        {/* Farmer Routes */}
                        <Route path="/farmer" element={<ProtectedRoute role="farmer"><FarmerHome /></ProtectedRoute>} />
                        <Route path="/farmer/disease-detection" element={<ProtectedRoute role="farmer"><CropDiseaseDetection /></ProtectedRoute>} />
                        <Route path="/farmer/query" element={<ProtectedRoute role="farmer"><SubmitQuery /></ProtectedRoute>} />
                        <Route path="/farmer/responses" element={<ProtectedRoute role="farmer"><MyResponsesFarmer /></ProtectedRoute>} />
                        <Route path="/farmer/loans" element={<ProtectedRoute role="farmer"><BrowseLoans /></ProtectedRoute>} />
                        <Route path="/farmer/loan-apply/:loanId" element={<ProtectedRoute role="farmer"><LoanApplication /></ProtectedRoute>} />
                        <Route path="/farmer/applied-loans" element={<ProtectedRoute role="farmer"><AppliedLoans /></ProtectedRoute>} />
                        <Route path="/farmer/articles" element={<ProtectedRoute role="farmer"><ExploreArticles /></ProtectedRoute>} />
                        <Route path="/farmer/marketplace" element={<ProtectedRoute role="farmer"><MarketplaceFarmer /></ProtectedRoute>} />

                        {/* Expert Routes */}
                        <Route path="/expert" element={<ProtectedRoute role="expert"><ExpertHome /></ProtectedRoute>} />
                        <Route path="/expert/disease-detection" element={<ProtectedRoute role="expert"><CropDiseaseDetection role="expert" /></ProtectedRoute>} />
                        <Route path="/expert/requests" element={<ProtectedRoute role="expert"><FarmerRequests /></ProtectedRoute>} />
                        <Route path="/expert/respond/:queryId" element={<ProtectedRoute role="expert"><RespondToQuery /></ProtectedRoute>} />
                        <Route path="/expert/responses" element={<ProtectedRoute role="expert"><MyResponsesExpert /></ProtectedRoute>} />
                        <Route path="/expert/content" element={<ProtectedRoute role="expert"><ExpertAllContent /></ProtectedRoute>} />
                        <Route path="/expert/article/create" element={<ProtectedRoute role="expert"><CreateArticle /></ProtectedRoute>} />
                        <Route path="/expert/marketplace" element={<ProtectedRoute role="expert"><ExpertMarketplace /></ProtectedRoute>} />
                        <Route path="/expert/crop-map" element={<ProtectedRoute role="expert"><CropSuitabilityMap /></ProtectedRoute>} />
                        <Route path="/expert/gemini" element={<ProtectedRoute role="expert"><AgriBotAssistance /></ProtectedRoute>} />

                        {/* Financier Routes */}
                        <Route path="/financier" element={<ProtectedRoute role="financier"><FinancierHome /></ProtectedRoute>} />
                        <Route path="/financier/add-loan" element={<ProtectedRoute role="financier"><AddLoan /></ProtectedRoute>} />
                        <Route path="/financier/loan-requests" element={<ProtectedRoute role="financier"><LoanRequests /></ProtectedRoute>} />
                        <Route path="/financier/all-loans" element={<ProtectedRoute role="financier"><AllLoans /></ProtectedRoute>} />
                        <Route path="/financier/farmer-loans" element={<ProtectedRoute role="financier"><FarmerLoans /></ProtectedRoute>} />

                        {/* Authenticated Public User Routes */}
                        <Route path="/public/home" element={<ProtectedRoute role="public"><PublicUserHome /></ProtectedRoute>} />
                        <Route path="/public/content" element={<ProtectedRoute role="public"><PublicContent /></ProtectedRoute>} />
                        <Route path="/public/learn" element={<ProtectedRoute role="public"><PublicLearnFarming /></ProtectedRoute>} />
                        <Route path="/public/buy" element={<ProtectedRoute role="public"><PublicBuyResources /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    )
}

export default App
