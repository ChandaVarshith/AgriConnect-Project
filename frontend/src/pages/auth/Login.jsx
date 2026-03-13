import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import Navbar from '../../components/Navbar'
import './Login.css'

// Misty rice paddy farm – matches image 3 reference
const BG = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1400&auto=format&fit=crop&q=80'

const ROLES = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'expert', label: 'Expert' },
    { value: 'financier', label: 'Financier' },
    { value: 'admin', label: 'Admin' },
    { value: 'public', label: 'Public User' },
]


const Login = () => {
    const [role, setRole] = useState('farmer')
    const [identifier, setId] = useState('')
    const [password, setPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const googleError = searchParams.get('error')

    const roleHome = { farmer: '/farmer', expert: '/expert', admin: '/admin', financier: '/financier', public: '/public/home' }
    const isPhone = role === 'farmer'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await authService.login(role, identifier, password)
            login(res.data.user, res.data.token, role)
            navigate(roleHome[role] || `/${role}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page-container">
            {/* Full-page background */}
            <img src={BG} alt="farm bg" className="login-bg-img" />

            {/* Minimal top bar — logo only */}
            <Navbar logoOnly />

            {/* Centered card */}
            <div className="login-content-wrapper">
                <div className="login-card">
                    <h2 className="login-title">Sign In</h2>

                    <form onSubmit={handleSubmit} className="login-form">

                        {/* Role */}
                        <div>
                            <label className="login-label">Role</label>
                            <select
                                value={role}
                                onChange={e => { setRole(e.target.value); setId('') }}
                                className="login-input login-select"
                            >
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value} className="login-select-option">
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Identifier — phone for farmer, email for others */}
                        <div>
                            <label className="login-label">{isPhone ? 'Phone Number' : 'Email'}</label>
                            <input
                                type={isPhone ? 'tel' : 'email'}
                                placeholder={isPhone ? 'Enter phone number' : 'Enter email address'}
                                value={identifier}
                                onChange={e => setId(e.target.value)}
                                required
                                className="login-input"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="login-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPass(e.target.value)}
                                required
                                className="login-input"
                            />
                        </div>

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`login-submit-btn ${loading ? 'login-submit-btn-loading' : 'login-submit-btn-active'}`}
                        >
                            {loading ? 'Signing In…' : 'Sign In'}
                        </button>
                    </form>

                    {/* Google Login — Public Users only */}
                    {role === 'public' && (
                        <div style={{ marginTop: '8px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                margin: '16px 0', color: '#888', fontSize: '0.82rem'
                            }}>
                                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                                <span>or</span>
                                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                            </div>
                            <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    padding: '11px 16px', borderRadius: '8px',
                                    background: '#fff', color: '#1a1a1a',
                                    fontWeight: 600, fontSize: '0.92rem',
                                    textDecoration: 'none', border: 'none', cursor: 'pointer',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    style={{ width: '20px', height: '20px' }}
                                />
                                Continue with Google
                            </a>
                            {googleError === 'google_failed' && (
                                <p className="login-error" style={{ marginTop: '8px' }}>Google sign-in failed. Please try again.</p>
                            )}
                        </div>
                    )}

                    <p className="login-footer-text">
                        No account? Don't worry! Signup takes very little time.{' '}
                        <Link to="/register" className="login-footer-link">
                            Sign Up Now
                        </Link>
                    </p>
                    <p className="login-footer-text-secondary">
                        Forgot Password?{' '}
                        <Link to="/forgot-password" className="login-footer-link">
                            Let's change it!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
