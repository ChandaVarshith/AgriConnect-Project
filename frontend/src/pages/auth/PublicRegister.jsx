import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import './PublicRegister.css'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const PublicRegister = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await authService.registerPublic(form.name, form.email, form.password)
            navigate('/login', { state: { message: 'Account created! Please sign in.' } })
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="public-register-container">
            <img src={BG} alt="farm bg" className="public-register-bg" />
            <nav className="public-register-nav">
                <Link to="/" className="public-register-logo-link">
                    <span className="public-register-logo-1">AGRI&nbsp;</span>
                    <span className="public-register-logo-2">CONNECT</span>
                </Link>
            </nav>
            <div className="public-register-content">
                <div className="public-register-card">
                    <h2 className="public-register-title">Public User</h2>
                    <p className="public-register-subtitle">
                        Explore farming content and buy fresh produce
                    </p>
                    <form onSubmit={handleSubmit} className="public-register-form">
                        <div>
                            <label className="public-register-label">Full Name</label>
                            <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} required className="public-register-input" />
                        </div>
                        <div>
                            <label className="public-register-label">Email</label>
                            <input type="email" placeholder="Enter email address" value={form.email} onChange={set('email')} required className="public-register-input" />
                        </div>
                        <div>
                            <label className="public-register-label">Password</label>
                            <input type="password" placeholder="Create a password" value={form.password} onChange={set('password')} required minLength={6} className="public-register-input" />
                        </div>
                        {error && <p className="public-register-error">{error}</p>}
                        <button type="submit" disabled={loading} className={`public-register-btn ${loading ? 'public-register-btn-loading' : 'public-register-btn-active'}`}>
                            {loading ? 'Creating Account…' : 'Create Account'}
                        </button>
                    </form>

                    {/* ── Google Sign Up ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0', color: '#888', fontSize: '0.82rem' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                        <span>or</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                    </div>
                    <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '11px 16px', borderRadius: '8px',
                            background: '#fff', color: '#1a1a1a',
                            fontWeight: 600, fontSize: '0.92rem',
                            textDecoration: 'none', cursor: 'pointer',
                            transition: 'opacity 0.2s', marginBottom: '4px'
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

                    <p className="public-register-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="public-register-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PublicRegister
