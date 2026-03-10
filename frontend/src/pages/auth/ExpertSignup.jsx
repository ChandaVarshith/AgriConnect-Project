import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import './ExpertSignup.css'

const BG = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&auto=format&fit=crop&q=80'

const ExpertSignup = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' })
    const [otpSent, setOtpSent] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [otp, setOtp] = useState('')
    const [emailVerified, setEmailVerified] = useState(false)
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [otpError, setOtpError] = useState('')
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    // ── Step 1: Send OTP ──────────────────────────────────────
    const handleSendOtp = async () => {
        if (!form.email) { setOtpError('Please enter your email first.'); return }
        setOtpError(''); setOtpLoading(true)
        try {
            await authService.sendOTP(form.email)
            setOtpSent(true)
            setEmailVerified(false)
            setOtp('')
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Failed to send OTP. Try again.')
        } finally { setOtpLoading(false) }
    }

    // ── Step 2: Verify OTP ────────────────────────────────────
    const handleVerifyOtp = async () => {
        if (!otp) { setOtpError('Enter the OTP first.'); return }
        setOtpError(''); setVerifyLoading(true)
        try {
            await authService.verifyOTP(form.email, otp)
            setEmailVerified(true)
            setOtpSent(false) // hide OTP box, show verified badge
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Invalid or expired OTP.')
        } finally { setVerifyLoading(false) }
    }

    // ── Step 3: Send Request to Admin ─────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(''); setSubmitLoading(true)
        try {
            await authService.registerExpert(form)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3500)
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to submit request. Try again.')
        } finally { setSubmitLoading(false) }
    }

    return (
        <div className="expert-signup-container">
            <img src={BG} alt="farm bg" className="expert-signup-bg" />

            <nav className="expert-signup-nav">
                <Link to="/" className="expert-signup-logo-link">
                    <span className="expert-signup-logo-1">AGRI&nbsp;</span>
                    <span className="expert-signup-logo-2">CONNECT</span>
                </Link>
            </nav>

            <div className="expert-signup-content">
                <div className="expert-signup-card">

                    {/* ── SUCCESS SCREEN ── */}
                    {success ? (
                        <div className="expert-signup-success-container">
                            <div className="expert-signup-success-icon">🎉</div>
                            <h2 className="expert-signup-success-title">Request Sent!</h2>
                            <p className="expert-signup-success-text">
                                Your expert registration request has been sent to the admin.<br />
                                You'll be able to login once the admin <strong className="expert-signup-success-highlight">approves your account</strong>.
                            </p>
                            <p className="expert-signup-success-redirect">Redirecting to login…</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="expert-signup-title">
                                Expert Sign Up
                            </h2>

                            <form onSubmit={handleSubmit} className="expert-signup-form">

                                {/* Full Name */}
                                <div>
                                    <label className="expert-signup-label">Full Name</label>
                                    <input type="text" placeholder="Dr. / Prof. Full Name" value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })} required className="expert-signup-input" />
                                </div>

                                {/* Email + Send OTP inline */}
                                <div>
                                    <label className="expert-signup-label">Email</label>
                                    <div className="expert-signup-email-row">
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={form.email}
                                            onChange={e => {
                                                setForm({ ...form, email: e.target.value })
                                                setEmailVerified(false)
                                                setOtpSent(false)
                                                setOtp('')
                                                setOtpError('')
                                            }}
                                            required
                                            className="expert-signup-input expert-signup-email-input"
                                            disabled={emailVerified}
                                        />
                                        {/* Verified badge OR Send OTP button */}
                                        {emailVerified ? (
                                            <div className="expert-signup-verified-badge">
                                                ✅ Verified
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpLoading || !form.email}
                                                className={`expert-signup-otp-btn ${otpLoading ? 'expert-signup-otp-btn-loading' : 'expert-signup-otp-btn-active'}`}
                                            >
                                                {otpLoading ? 'Sending…' : otpSent ? 'Resend' : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>

                                    {/* OTP Input – appears after OTP is sent */}
                                    {otpSent && !emailVerified && (
                                        <div className="expert-signup-otp-container">
                                            <p className="expert-signup-otp-text">
                                                📧 OTP sent to <strong className="expert-signup-otp-email">{form.email}</strong>
                                            </p>
                                            <div className="expert-signup-otp-input-row">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit OTP"
                                                    value={otp}
                                                    onChange={e => { setOtp(e.target.value); setOtpError('') }}
                                                    className="expert-signup-input expert-signup-otp-input"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={verifyLoading || otp.length < 4}
                                                    className={`expert-signup-verify-btn ${verifyLoading ? 'expert-signup-verify-btn-loading' : 'expert-signup-verify-btn-active'}`}
                                                >
                                                    {verifyLoading ? 'Checking…' : 'Verify'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* OTP error */}
                                    {otpError && (
                                        <p className="expert-signup-error">
                                            {otpError}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="expert-signup-label">Password</label>
                                    <input type="password" placeholder="Create a password" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })} required className="expert-signup-input" />
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className="expert-signup-label">Specialization</label>
                                    <input type="text" placeholder="e.g. Soil Science, Agronomy" value={form.specialization}
                                        onChange={e => setForm({ ...form, specialization: e.target.value })} required className="expert-signup-input" />
                                </div>

                                {/* Submit error */}
                                {submitError && (
                                    <p className="expert-signup-submit-error">
                                        {submitError}
                                    </p>
                                )}

                                {/* Submit Button – only active when email is verified */}
                                <button
                                    type="submit"
                                    disabled={!emailVerified || submitLoading}
                                    title={!emailVerified ? 'Please verify your email first' : ''}
                                    className={`expert-signup-submit-btn ${!emailVerified ? 'expert-signup-submit-btn-disabled' : submitLoading ? 'expert-signup-submit-btn-loading' : 'expert-signup-submit-btn-active'}`}
                                >
                                    {submitLoading ? 'Sending Request…' : '🚀 Send Request to Admin'}
                                </button>

                                {/* Helper hint */}
                                {!emailVerified && (
                                    <p className="expert-signup-helper-text">
                                        Verify your email above to enable this button
                                    </p>
                                )}
                            </form>
                        </>
                    )}

                    <p className="expert-signup-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="expert-signup-link-primary">Sign In</Link>
                    </p>
                    <p className="expert-signup-footer-text-secondary">
                        Not an expert?{' '}
                        <Link to="/register" className="expert-signup-link-secondary">Choose a different role</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ExpertSignup
