import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import Navbar from '../../components/Navbar'
import './FinancierSignup.css'

const BG = 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1400&auto=format&fit=crop&q=80'

const FinancierSignup = () => {
    const [form, setForm] = useState({ orgName: '', email: '', password: '', contact: '' })
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
            setOtpSent(false)
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Invalid or expired OTP.')
        } finally { setVerifyLoading(false) }
    }

    // ── Step 3: Register Financier ────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(''); setSubmitLoading(true)
        try {
            await authService.registerFinancier(form)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3500)
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to submit request. Try again.')
        } finally { setSubmitLoading(false) }
    }

    return (
        <div className="financier-signup-container">
            <img src={BG} alt="finance bg" className="financier-signup-bg" />

            <Navbar logoOnly />

            <div className="financier-signup-content">
                <div className="financier-signup-card">

                    {/* ── SUCCESS SCREEN ── */}
                    {success ? (
                        <div className="financier-signup-success-container">
                            <div className="financier-signup-success-icon"></div>
                            <h2 className="financier-signup-success-title">Request Sent!</h2>
                            <p className="financier-signup-success-text">
                                Your financier registration request has been sent to the admin.<br />
                                You'll be able to login once the admin <strong className="financier-signup-success-highlight">approves your account</strong>.
                            </p>
                            <p className="financier-signup-success-redirect">Redirecting to login…</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="financier-signup-title">
                                Financier Sign Up
                            </h2>

                            <form onSubmit={handleSubmit} className="financier-signup-form">

                                {/* Organisation Name */}
                                <div>
                                    <label className="financier-signup-label">Organisation Name</label>
                                    <input type="text" placeholder="e.g. AgriBank Ltd." value={form.orgName}
                                        onChange={e => setForm({ ...form, orgName: e.target.value })} required className="financier-signup-input" />
                                </div>

                                {/* Email + Send OTP inline */}
                                <div>
                                    <label className="financier-signup-label">Email</label>
                                    <div className="financier-signup-email-row">
                                        <input
                                            type="email"
                                            placeholder="official@organisation.com"
                                            value={form.email}
                                            onChange={e => {
                                                setForm({ ...form, email: e.target.value })
                                                setEmailVerified(false)
                                                setOtpSent(false)
                                                setOtp('')
                                                setOtpError('')
                                            }}
                                            required
                                            className="financier-signup-input financier-signup-email-input"
                                            disabled={emailVerified}
                                        />
                                        {/* Verified badge OR Send OTP button */}
                                        {emailVerified ? (
                                            <div className="financier-signup-verified-badge">
                                                Verified
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpLoading || !form.email}
                                                className={`financier-signup-otp-btn ${otpLoading ? 'financier-signup-otp-btn-loading' : 'financier-signup-otp-btn-active'}`}
                                            >
                                                {otpLoading ? 'Sending…' : otpSent ? 'Resend' : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>

                                    {/* OTP Input – slides in after OTP is sent */}
                                    {otpSent && !emailVerified && (
                                        <div className="financier-signup-otp-container">
                                            <p className="financier-signup-otp-text">
                                                📧 OTP sent to <strong className="financier-signup-otp-email">{form.email}</strong>
                                            </p>
                                            <div className="financier-signup-otp-input-row">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit OTP"
                                                    value={otp}
                                                    onChange={e => { setOtp(e.target.value); setOtpError('') }}
                                                    className="financier-signup-input financier-signup-otp-input"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={verifyLoading || otp.length < 4}
                                                    className={`financier-signup-verify-btn ${verifyLoading ? 'financier-signup-verify-btn-loading' : 'financier-signup-verify-btn-active'}`}
                                                >
                                                    {verifyLoading ? 'Checking…' : 'Verify'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* OTP error */}
                                    {otpError && (
                                        <p className="financier-signup-error">
                                            {otpError}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="financier-signup-label">Password</label>
                                    <input type="password" placeholder="Create a strong password" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })} required className="financier-signup-input" />
                                </div>

                                {/* Contact */}
                                <div>
                                    <label className="financier-signup-label">Contact Number</label>
                                    <input type="tel" placeholder="10-digit contact number" value={form.contact}
                                        onChange={e => setForm({ ...form, contact: e.target.value })} className="financier-signup-input" />
                                </div>

                                {/* Submit error */}
                                {submitError && (
                                    <p className="financier-signup-submit-error">
                                        {submitError}
                                    </p>
                                )}

                                {/* Submit Button – only active when email is verified */}
                                <button
                                    type="submit"
                                    disabled={!emailVerified || submitLoading}
                                    title={!emailVerified ? 'Please verify your email first' : ''}
                                    className={`financier-signup-submit-btn ${!emailVerified ? 'financier-signup-submit-btn-disabled' : submitLoading ? 'financier-signup-submit-btn-loading' : 'financier-signup-submit-btn-active'}`}
                                >
                                    {submitLoading ? 'Sending Request…' : 'Send Request to Admin'}
                                </button>

                                {/* Helper hint */}
                                {!emailVerified && (
                                    <p className="financier-signup-helper-text">
                                        Verify your email above to enable this button
                                    </p>
                                )}
                            </form>
                        </>
                    )}

                    <p className="financier-signup-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="financier-signup-link-primary">Sign In</Link>
                    </p>
                    <p className="financier-signup-footer-text-secondary">
                        Not a financier?{' '}
                        <Link to="/register" className="financier-signup-link-secondary">Choose a different role</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FinancierSignup
