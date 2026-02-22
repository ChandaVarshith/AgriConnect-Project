import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

const BG = 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1400&auto=format&fit=crop&q=80'

const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 6, color: '#fff', fontSize: '0.92rem',
    outline: 'none', boxSizing: 'border-box',
}
const labelStyle = {
    display: 'block', color: '#fff', fontSize: '0.82rem',
    fontWeight: 600, marginBottom: 5, letterSpacing: '0.03em',
}

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
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <img src={BG} alt="finance bg" style={{
                position: 'fixed', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', filter: 'brightness(0.35)', zIndex: 0,
            }} />

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
                position: 'relative', zIndex: 10, minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '80px 20px 40px',
            }}>
                <div style={{
                    width: '100%', maxWidth: 440,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 14, padding: '36px 32px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                }}>

                    {/* ── SUCCESS SCREEN ── */}
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🎉</div>
                            <h2 style={{
                                color: '#fff', fontFamily: "'Barlow Condensed',sans-serif",
                                fontSize: '2rem', fontWeight: 800, marginBottom: 10,
                            }}>Request Sent!</h2>
                            <p style={{ color: '#ccc', fontSize: '0.92rem', lineHeight: 1.6 }}>
                                Your financier registration request has been sent to the admin.<br />
                                You'll be able to login once the admin <strong style={{ color: '#f59e0b' }}>approves your account</strong>.
                            </p>
                            <p style={{ color: '#888', fontSize: '0.8rem', marginTop: 18 }}>Redirecting to login…</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{
                                color: '#fff', textAlign: 'center',
                                fontFamily: "'Barlow Condensed',sans-serif",
                                fontSize: '1.9rem', fontWeight: 800, marginBottom: 24, letterSpacing: '0.04em',
                            }}>
                                Financier Sign Up
                            </h2>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Organisation Name */}
                                <div>
                                    <label style={labelStyle}>Organisation Name</label>
                                    <input type="text" placeholder="e.g. AgriBank Ltd." value={form.orgName}
                                        onChange={e => setForm({ ...form, orgName: e.target.value })} required style={inputStyle} />
                                </div>

                                {/* Email + Send OTP inline */}
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <div style={{ display: 'flex', gap: 8 }}>
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
                                            style={{ ...inputStyle, flex: 1 }}
                                            disabled={emailVerified}
                                        />
                                        {/* Verified badge OR Send OTP button */}
                                        {emailVerified ? (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 5,
                                                background: 'rgba(76,175,80,0.2)', border: '1px solid #4caf50',
                                                borderRadius: 6, padding: '0 12px', whiteSpace: 'nowrap',
                                                color: '#4caf50', fontWeight: 700, fontSize: '0.82rem',
                                            }}>
                                                ✅ Verified
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpLoading || !form.email}
                                                style={{
                                                    padding: '0 14px',
                                                    background: otpLoading ? '#b06a00' : '#f59e0b',
                                                    color: '#000', fontWeight: 700, fontSize: '0.78rem',
                                                    border: 'none', borderRadius: 6,
                                                    cursor: otpLoading ? 'not-allowed' : 'pointer',
                                                    whiteSpace: 'nowrap', letterSpacing: '0.04em',
                                                    textTransform: 'uppercase', minWidth: 90,
                                                }}
                                            >
                                                {otpLoading ? 'Sending…' : otpSent ? 'Resend' : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>

                                    {/* OTP Input – slides in after OTP is sent */}
                                    {otpSent && !emailVerified && (
                                        <div style={{
                                            marginTop: 10,
                                            background: 'rgba(245,158,11,0.08)',
                                            border: '1px solid rgba(245,158,11,0.35)',
                                            borderRadius: 8, padding: '14px 14px 12px',
                                            animation: 'fadeSlideIn 0.25s ease',
                                        }}>
                                            <p style={{ color: '#fbbf24', fontSize: '0.8rem', margin: '0 0 10px' }}>
                                                📧 OTP sent to <strong style={{ color: '#fff' }}>{form.email}</strong>
                                            </p>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit OTP"
                                                    value={otp}
                                                    onChange={e => { setOtp(e.target.value); setOtpError('') }}
                                                    style={{
                                                        ...inputStyle, flex: 1,
                                                        textAlign: 'center', letterSpacing: '0.3em',
                                                        fontSize: '1.1rem', fontWeight: 700,
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={verifyLoading || otp.length < 4}
                                                    style={{
                                                        padding: '0 14px',
                                                        background: verifyLoading ? '#b06a00' : '#d97706',
                                                        color: '#fff', fontWeight: 700, fontSize: '0.78rem',
                                                        border: 'none', borderRadius: 6,
                                                        cursor: verifyLoading ? 'not-allowed' : 'pointer',
                                                        whiteSpace: 'nowrap', textTransform: 'uppercase',
                                                        letterSpacing: '0.04em',
                                                    }}
                                                >
                                                    {verifyLoading ? 'Checking…' : 'Verify'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* OTP error */}
                                    {otpError && (
                                        <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: 6, margin: '6px 0 0' }}>
                                            {otpError}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label style={labelStyle}>Password</label>
                                    <input type="password" placeholder="Create a strong password" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })} required style={inputStyle} />
                                </div>

                                {/* Contact */}
                                <div>
                                    <label style={labelStyle}>Contact Number</label>
                                    <input type="tel" placeholder="10-digit contact number" value={form.contact}
                                        onChange={e => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
                                </div>

                                {/* Submit error */}
                                {submitError && (
                                    <p style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                                        {submitError}
                                    </p>
                                )}

                                {/* Submit Button – only active when email is verified */}
                                <button
                                    type="submit"
                                    disabled={!emailVerified || submitLoading}
                                    title={!emailVerified ? 'Please verify your email first' : ''}
                                    style={{
                                        width: '100%', padding: '13px 0',
                                        background: !emailVerified
                                            ? 'rgba(100,100,100,0.4)'
                                            : submitLoading ? '#b06a00' : '#f59e0b',
                                        color: emailVerified ? '#000' : '#888',
                                        fontWeight: 700, fontSize: '1rem',
                                        border: 'none', borderRadius: 6,
                                        cursor: !emailVerified || submitLoading ? 'not-allowed' : 'pointer',
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        marginTop: 4, transition: 'background 0.2s',
                                    }}
                                >
                                    {submitLoading ? 'Sending Request…' : '🚀 Send Request to Admin'}
                                </button>

                                {/* Helper hint */}
                                {!emailVerified && (
                                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#888', margin: '-8px 0 0' }}>
                                        Verify your email above to enable this button
                                    </p>
                                )}
                            </form>
                        </>
                    )}

                    <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: '#ccc' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#e02020', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: '#ccc' }}>
                        Not a financier?{' '}
                        <Link to="/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Choose a different role</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default FinancierSignup
