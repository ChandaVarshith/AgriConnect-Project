import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a page component and verifies:
 * 1. User is authenticated (has a token)
 * 2. User's role matches the required role
 */
const ProtectedRoute = ({ children, role }) => {
    const { token, role: userRole } = useAuth()

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (role && userRole !== role) {
        // Redirect to home of their actual role
        const roleHome = {
            admin: '/admin',
            farmer: '/farmer',
            expert: '/expert',
            financier: '/financier',
        }
        return <Navigate to={roleHome[userRole] || '/'} replace />
    }

    return children
}

export default ProtectedRoute
