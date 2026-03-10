import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * This page handles the redirect from Google OAuth.
 * The backend redirects here with `?data=<encoded JSON>` containing user + token.
 */
const GoogleCallback = () => {
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        try {
            const raw = searchParams.get('data')
            if (!raw) throw new Error('No data received')
            const { user, token, role } = JSON.parse(decodeURIComponent(raw))
            login(user, token, role)
            navigate('/public/home', { replace: true })
        } catch {
            navigate('/login?error=google_failed', { replace: true })
        }
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <p>Completing Google Sign-In...</p>
        </div>
    )
}

export default GoogleCallback
