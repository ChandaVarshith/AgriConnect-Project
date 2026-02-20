import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import authService from '../../services/authService'

// Rice paddy / misty farm background
const BG = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1400&auto=format&fit=crop&q=80'

const Login = () => {
    const [role, setRole] = useState('farmer')
    const [identifier, setId] = useState('')
    const [password, setPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await authService.login(role, identifier, password)
            login(res.data.user, res.data.token, role)
            navigate(`/${role}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="farm bg"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38)', zIndex: 0 }} />

            <Navbar publicNav />

            <div style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '90px 20px 40px',
            }}>
                <div className="glass-card">
                    <h2>Sign In</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="farmer">Farmer</option>
                            <option value="expert">Expert</option>
                            <option value="admin">Admin</option>
                            <option value="financier">Financier</option>
                        </select>

                        <label>{role === 'farmer' ? 'Phone Number' : 'Email'}</label>
                        <input type={role === 'farmer' ? 'tel' : 'email'}
                            placeholder={role === 'farmer' ? 'Phone number' : 'Email address'}
                            value={identifier} onChange={e => setId(e.target.value)} required />

                        <label>Password</label>
                        <input type="password" placeholder="Password"
                            value={password} onChange={e => setPass(e.target.value)} required />

                        {error && <p className="msg-error">{error}</p>}

                        <button className="btn-submit" type="submit" disabled={loading}>
                            {loading ? 'Signing In…' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: '#444' }}>
                        No account? Don't worry! Signup takes very little time.{' '}
                        <Link to="/register/farmer" className="link-red">Sign Up Now</Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: '#444' }}>
                        Forgot Password ?{' '}
                        <Link to="/forgot-password" className="link-gold">Lets change it!</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
