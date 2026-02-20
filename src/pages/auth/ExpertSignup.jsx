import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import authService from '../../services/authService'

const BG = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&auto=format&fit=crop&q=80'

const STEPS = { DETAILS: 1, OTP: 2, SUCCESS: 3 }

const ExpertSignup = () => {
    const [step, setStep] = useState(STEPS.DETAILS)
    const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' })
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const sendOtp = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try {
            await authService.sendOTP(form.email)
            setStep(STEPS.OTP)
        } catch (err) { setError(err.response?.data?.message || 'Failed to send OTP.') }
        finally { setLoading(false) }
    }

    const verifyAndRegister = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try {
            await authService.verifyOTP(form.email, otp)
            await authService.registerExpert(form)
            setStep(STEPS.SUCCESS)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) { setError(err.response?.data?.message || 'OTP verification failed.') }
        finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="farm"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)', zIndex: 0 }} />
            <Navbar publicNav />
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
                <div className="glass-card">
                    {step === STEPS.DETAILS && (
                        <>
                            <h2>Expert Sign Up</h2>
                            <form onSubmit={sendOtp}>
                                <label>Full Name</label>
                                <input type="text" placeholder="Dr. / Prof. Full Name" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                                <label>Email</label>
                                <input type="email" placeholder="your@email.com" value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                                <label>Password</label>
                                <input type="password" placeholder="Create a password" value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })} required />
                                <label>Specialization</label>
                                <input type="text" placeholder="e.g. Soil Science, Agronomy" value={form.specialization}
                                    onChange={e => setForm({ ...form, specialization: e.target.value })} required />
                                {error && <p className="msg-error">{error}</p>}
                                <button className="btn-submit" type="submit" disabled={loading}>
                                    {loading ? 'Sending OTP…' : 'Send OTP to Email'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === STEPS.OTP && (
                        <>
                            <h2>Verify OTP</h2>
                            <p style={{ color: '#444', fontSize: '0.88rem', marginBottom: 16, textAlign: 'center' }}>
                                Enter the 6-digit OTP sent to <strong>{form.email}</strong>
                            </p>
                            <form onSubmit={verifyAndRegister}>
                                <label>OTP</label>
                                <input type="text" maxLength={6} placeholder="6-digit OTP" value={otp}
                                    onChange={e => setOtp(e.target.value)} required
                                    style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' }} />
                                {error && <p className="msg-error">{error}</p>}
                                <button className="btn-submit" type="submit" disabled={loading}>
                                    {loading ? 'Verifying…' : 'Verify & Register'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === STEPS.SUCCESS && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <p style={{ fontSize: '2.5rem' }}>✅</p>
                            <h2>Registered!</h2>
                            <p style={{ color: '#444', marginTop: 10 }}>Your account is pending admin approval. Redirecting…</p>
                        </div>
                    )}

                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: '#555' }}>
                        Already have an account? <Link to="/login" className="link-red">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ExpertSignup
