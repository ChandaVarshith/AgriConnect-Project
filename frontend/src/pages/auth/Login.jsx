import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'

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

    // Input & label shared style
    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 6,
        color: '#fff',
        fontSize: '0.92rem',
        outline: 'none',
        boxSizing: 'border-box',
        backdropFilter: 'blur(4px)',
    }
    const labelStyle = {
        display: 'block',
        color: '#fff',
        fontSize: '0.82rem',
        fontWeight: 600,
        marginBottom: 5,
        letterSpacing: '0.03em',
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Full-page background */}
            <img src={BG} alt="farm bg" style={{
                position: 'fixed', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.38)',
                zIndex: 0,
            }} />

            {/* Minimal top bar — logo + hamburger only (no user, public page) */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                height: 56, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(8px)',
                zIndex: 100,
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex' }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#fff' }}>AGRI&nbsp;</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#e02020' }}>CONNECT</span>
                </Link>
            </nav>

            {/* Centered card */}
            <div style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '80px 20px 40px',
            }}>
                <div style={{
                    width: '100%', maxWidth: 420,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 14,
                    padding: '36px 32px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                }}>
                    <h2 style={{
                        color: '#fff', textAlign: 'center',
                        fontFamily: "'Barlow Condensed',sans-serif",
                        fontSize: '2rem', fontWeight: 800,
                        marginBottom: 24, letterSpacing: '0.04em',
                    }}>Sign In</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Role */}
                        <div>
                            <label style={labelStyle}>Role</label>
                            <select
                                value={role}
                                onChange={e => { setRole(e.target.value); setId('') }}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                            >
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value} style={{ background: '#1a1a1a', color: '#fff' }}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Identifier — phone for farmer, email for others */}
                        <div>
                            <label style={labelStyle}>{isPhone ? 'Phone Number' : 'Email'}</label>
                            <input
                                type={isPhone ? 'tel' : 'email'}
                                placeholder={isPhone ? 'Enter phone number' : 'Enter email address'}
                                value={identifier}
                                onChange={e => setId(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPass(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        {error && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '12px 0',
                                background: loading ? '#2d7a2d' : '#22c55e',
                                color: '#000', fontWeight: 700,
                                fontSize: '1rem', border: 'none',
                                borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                marginTop: 4,
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Signing In…' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: '#ccc' }}>
                        No account? Don't worry! Signup takes very little time.{' '}
                        <Link to="/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>
                            Sign Up Now
                        </Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: '#ccc' }}>
                        Forgot Password?{' '}
                        <Link to="/forgot-password" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>
                            Let's change it!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
