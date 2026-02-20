import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import authService from '../../services/authService'

const BG = 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1400&auto=format&fit=crop&q=80'

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
            setSuccess('Registration successful! Please sign in.')
            setTimeout(() => navigate('/login'), 1800)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="farm"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)', zIndex: 0 }} />
            <Navbar publicNav />
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
                <div className="glass-card">
                    <h2>Farmer Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Full Name</label>
                        <input type="text" placeholder="Your full name" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <label>Phone Number</label>
                        <input type="tel" placeholder="10-digit mobile number" value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })} required />
                        <label>Password</label>
                        <input type="password" placeholder="Create a password" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })} required />
                        <label>Location (District, State)</label>
                        <input type="text" placeholder="e.g. Guntur, Andhra Pradesh" value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })} />
                        <label>Preferred Language</label>
                        <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="te">Telugu</option>
                            <option value="ta">Tamil</option>
                            <option value="mr">Marathi</option>
                            <option value="kn">Kannada</option>
                        </select>
                        {error && <p className="msg-error">{error}</p>}
                        {success && <p className="msg-success">{success}</p>}
                        <button className="btn-submit" type="submit" disabled={loading}>
                            {loading ? 'Registering…' : 'Create Account'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: '#444' }}>
                        Already have an account? <Link to="/login" className="link-red">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FarmerRegister
