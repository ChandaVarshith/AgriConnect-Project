import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import authService from '../../services/authService'

const BG = 'https://images.unsplash.com/photo-1542785853-cd7048c2b6d8?w=1400&auto=format&fit=crop&q=80'

const ForgotPassword = () => {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPass, setNewPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const sendOtp = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try { await authService.sendOTP(email); setStep(2) }
        catch (err) { setError(err.response?.data?.message || 'Failed to send OTP.') }
        finally { setLoading(false) }
    }

    const verifyOtp = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try { await authService.verifyOTP(email, otp); setStep(3) }
        catch (err) { setError(err.response?.data?.message || 'Invalid OTP.') }
        finally { setLoading(false) }
    }

    const resetPass = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try {
            await authService.resetPassword(email, otp, newPass)
            navigate('/login')
        } catch (err) { setError(err.response?.data?.message || 'Reset failed.') }
        finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="farm"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)', zIndex: 0 }} />
            <Navbar publicNav />
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
                <div className="glass-card">
                    <h2>Forgot Password</h2>
                    {step === 1 && (
                        <form onSubmit={sendOtp}>
                            <label>Registered Email</label>
                            <input type="email" placeholder="your@email.com" value={email}
                                onChange={e => setEmail(e.target.value)} required />
                            {error && <p className="msg-error">{error}</p>}
                            <button className="btn-submit" type="submit" disabled={loading}>
                                {loading ? 'Sending…' : 'Send OTP'}
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={verifyOtp}>
                            <p style={{ color: '#444', fontSize: '0.88rem', marginBottom: 14 }}>OTP sent to <strong>{email}</strong></p>
                            <label>Enter OTP</label>
                            <input type="text" maxLength={6} placeholder="6-digit OTP" value={otp}
                                onChange={e => setOtp(e.target.value)} required
                                style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' }} />
                            {error && <p className="msg-error">{error}</p>}
                            <button className="btn-submit" type="submit" disabled={loading}>
                                {loading ? 'Verifying…' : 'Verify OTP'}
                            </button>
                        </form>
                    )}
                    {step === 3 && (
                        <form onSubmit={resetPass}>
                            <label>New Password</label>
                            <input type="password" placeholder="Enter new password" value={newPass}
                                onChange={e => setNewPass(e.target.value)} required />
                            {error && <p className="msg-error">{error}</p>}
                            <button className="btn-submit" type="submit" disabled={loading}>
                                {loading ? 'Resetting…' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                    <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: '#555' }}>
                        Remember it? <Link to="/login" className="link-red">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
