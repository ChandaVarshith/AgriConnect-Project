import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 6, color: '#fff',
    fontSize: '0.92rem', outline: 'none',
    boxSizing: 'border-box', backdropFilter: 'blur(4px)',
}
const labelStyle = {
    display: 'block', color: '#fff',
    fontSize: '0.82rem', fontWeight: 600,
    marginBottom: 5, letterSpacing: '0.03em',
}

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
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <img src={BG} alt="farm bg" style={{
                position: 'fixed', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', filter: 'brightness(0.32)', zIndex: 0,
            }} />
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 24px', background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)', zIndex: 100,
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex' }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#fff' }}>AGRI&nbsp;</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#e02020' }}>CONNECT</span>
                </Link>
            </nav>
            <div style={{
                position: 'relative', zIndex: 10, minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '80px 20px 40px',
            }}>
                <div style={{
                    width: '100%', maxWidth: 420,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 14, padding: '36px 32px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                }}>
                    <h2 style={{
                        color: '#fff', textAlign: 'center',
                        fontFamily: "'Barlow Condensed',sans-serif",
                        fontSize: '2rem', fontWeight: 800,
                        marginBottom: 6, letterSpacing: '0.04em',
                    }}>Public User</h2>
                    <p style={{ color: '#aaa', textAlign: 'center', fontSize: '0.85rem', marginBottom: 24 }}>
                        Explore farming content and buy fresh produce
                    </p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input type="email" placeholder="Enter email address" value={form.email} onChange={set('email')} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input type="password" placeholder="Create a password" value={form.password} onChange={set('password')} required minLength={6} style={inputStyle} />
                        </div>
                        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}
                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '12px 0',
                            background: loading ? '#5a2daa' : '#a855f7',
                            color: '#fff', fontWeight: 700, fontSize: '1rem',
                            border: 'none', borderRadius: 6,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            marginTop: 4, transition: 'background 0.2s',
                        }}>
                            {loading ? 'Creating Account…' : 'Create Account'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: '#ccc' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#a855f7', fontWeight: 600, textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PublicRegister
