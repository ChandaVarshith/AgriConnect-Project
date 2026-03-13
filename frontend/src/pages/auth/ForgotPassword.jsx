import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import Navbar from '../../components/Navbar'
import './ForgotPassword.css'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const ROLES = [
    { value: 'farmer', label: ' Farmer', identifierType: 'phone', placeholder: 'Registered phone number' },
    { value: 'expert', label: '🧑‍🔬 Expert', identifierType: 'email', placeholder: 'Registered email address' },
    { value: 'financier', label: '🏦 Financier', identifierType: 'email', placeholder: 'Registered email address' },
    { value: 'admin', label: ' Admin', identifierType: 'email', placeholder: 'Admin email address' },
    { value: 'public', label: ' Public User', identifierType: 'email', placeholder: 'Registered email address' },
]

const ForgotPassword = () => {
    const [step, setStep] = useState(1)          // Step 1: Role + ID, Step 2: OTP, Step 3: New Password
    const [role, setRole] = useState('farmer')
    const [identifier, setIdentifier] = useState('')
    const [resolvedEmail, setResolvedEmail] = useState('') // actual email used for OTP (for farmer, found from phone)
    const [otp, setOtp] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const currentRole = ROLES.find(r => r.value === role)
    const isFarmer = role === 'farmer'

    const sendOtp = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try {
            const payload = isFarmer
                ? { phone: identifier, role: 'farmer' }
                : { email: identifier, role }
            const res = await authService.sendOTP(payload)
            // Backend returns the actual email we will send to (especially useful for farmer)
            setResolvedEmail(res.data.email || identifier)
            setStep(2)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
        } finally { setLoading(false) }
    }

    const verifyOtp = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try {
            await authService.verifyOTP(resolvedEmail, otp)
            setStep(3)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.')
        } finally { setLoading(false) }
    }

    const resetPass = async (e) => {
        e.preventDefault(); setError('');
        if (newPass !== confirmPass) { setError('Passwords do not match.'); return }
        setLoading(true)
        try {
            const payload = isFarmer
                ? { phone: identifier, email: resolvedEmail, otp, newPassword: newPass, role }
                : { email: resolvedEmail, otp, newPassword: newPass, role }
            await authService.resetPassword(payload)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed.')
        } finally { setLoading(false) }
    }

    const goBack = () => { setStep(s => s - 1); setError('') }

    return (
        <div className="fp-container">
            <img src={BG} alt="farm" className="fp-bg" />

            <Navbar logoOnly />

            <div className="fp-content">
                <div className="fp-card">

                    {/* ── Step Indicator ── */}
                    <div className="fp-steps">
                        {['Identify', 'Verify OTP', 'New Password'].map((label, i) => (
                            <div key={i} className={`fp-step ${step === i + 1 ? 'fp-step--active' : step > i + 1 ? 'fp-step--done' : ''}`}>
                                <span className="fp-step-num">{step > i + 1 ? '' : i + 1}</span>
                                <span className="fp-step-label">{label}</span>
                            </div>
                        ))}
                    </div>

                    <h2 className="fp-title">Forgot Password</h2>

                    {/* ── STEP 1: Role + Identifier ── */}
                    {step === 1 && (
                        <form onSubmit={sendOtp} className="fp-form">
                            <div>
                                <label className="fp-label">Your Role</label>
                                <select
                                    value={role}
                                    onChange={e => { setRole(e.target.value); setIdentifier(''); setError('') }}
                                    className="fp-input fp-select"
                                >
                                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="fp-label">{isFarmer ? 'Phone Number' : 'Email Address'}</label>
                                <input
                                    type={isFarmer ? 'tel' : 'email'}
                                    placeholder={currentRole?.placeholder}
                                    value={identifier}
                                    onChange={e => { setIdentifier(e.target.value); setError('') }}
                                    required
                                    className="fp-input"
                                />
                            </div>

                            {error && <p className="fp-error">{error}</p>}

                            <button type="submit" disabled={loading} className="fp-btn fp-btn-primary">
                                {loading ? 'Sending OTP…' : '📧 Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* ── STEP 2: OTP Verification ── */}
                    {step === 2 && (
                        <form onSubmit={verifyOtp} className="fp-form">
                            <div className="fp-otp-info">
                                📧 OTP sent to <strong>{resolvedEmail}</strong>
                            </div>

                            <div>
                                <label className="fp-label">Enter 6-digit OTP</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="• • • • • •"
                                    value={otp}
                                    onChange={e => { setOtp(e.target.value); setError('') }}
                                    required
                                    className="fp-input fp-otp-input"
                                />
                            </div>

                            {error && <p className="fp-error">{error}</p>}

                            <button type="submit" disabled={loading || otp.length < 4} className="fp-btn fp-btn-primary">
                                {loading ? 'Verifying…' : 'Verify OTP'}
                            </button>
                            <button type="button" onClick={goBack} className="fp-btn fp-btn-secondary">
                                ← Back
                            </button>
                        </form>
                    )}

                    {/* ── STEP 3: New Password ── */}
                    {step === 3 && (
                        <form onSubmit={resetPass} className="fp-form">
                            <div>
                                <label className="fp-label">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPass}
                                    onChange={e => { setNewPass(e.target.value); setError('') }}
                                    required
                                    className="fp-input"
                                />
                            </div>
                            <div>
                                <label className="fp-label">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPass}
                                    onChange={e => { setConfirmPass(e.target.value); setError('') }}
                                    required
                                    className="fp-input"
                                />
                            </div>

                            {error && <p className="fp-error">{error}</p>}

                            <button type="submit" disabled={loading} className="fp-btn fp-btn-primary">
                                {loading ? 'Resetting…' : '🔑 Reset Password'}
                            </button>
                            <button type="button" onClick={goBack} className="fp-btn fp-btn-secondary">
                                ← Back
                            </button>
                        </form>
                    )}

                    <p className="fp-footer">
                        Remember it?{' '}
                        <Link to="/login" className="fp-link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
