import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

const BG = 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1400&auto=format&fit=crop&q=80'

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
}
const labelStyle = {
    display: 'block',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: 5,
    letterSpacing: '0.03em',
}

const FarmerRegister = () => {
    const [form, setForm] = useState({ name: '', phone: '', password: '', location: '', language: 'en' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await authService.registerFarmer(form)
            setSuccess('Registration successful! Redirecting to sign in…')
            setTimeout(() => navigate('/login'), 1800)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <img src={BG} alt="farm bg" style={{
                position: 'fixed', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', filter: 'brightness(0.35)', zIndex: 0,
            }} />

            {/* Top bar */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: 56,
                display: 'flex', alignItems: 'center', padding: '0 24px',
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 100,
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex' }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#fff' }}>AGRI&nbsp;</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#e02020' }}>CONNECT</span>
                </Link>
            </nav>

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
                        fontSize: '1.9rem', fontWeight: 800,
                        marginBottom: 24, letterSpacing: '0.04em',
                    }}>
                        Farmer Sign Up
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" placeholder="Your full name" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone Number</label>
                            <input type="tel" placeholder="10-digit mobile number" value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input type="password" placeholder="Create a password" value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Location (District, State)</label>
                            <input type="text" placeholder="e.g. Guntur, Andhra Pradesh" value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Preferred Language</label>
                            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}>
                                {[['en', 'English'], ['hi', 'Hindi'], ['te', 'Telugu'], ['ta', 'Tamil'], ['mr', 'Marathi'], ['kn', 'Kannada']].map(([v, l]) => (
                                    <option key={v} value={v} style={{ background: '#1a1a1a', color: '#fff' }}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}
                        {success && <p style={{ color: '#4caf50', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{success}</p>}

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '12px 0',
                            background: loading ? '#2d7a2d' : '#22c55e',
                            color: '#000', fontWeight: 700, fontSize: '1rem',
                            border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4,
                        }}>
                            {loading ? 'Registering…' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: '#ccc' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#e02020', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: '#ccc' }}>
                        Not a farmer?{' '}
                        <Link to="/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Choose a different role</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FarmerRegister
