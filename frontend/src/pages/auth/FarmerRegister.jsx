import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import './FarmerRegister.css'

const BG = 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1400&auto=format&fit=crop&q=80'

const EMPTY = {
    name: '', phone: '', password: '', confirmPassword: '',
    email: '', district: '', state: '',
    farmSize: '', primaryCrops: '', preferredLanguage: 'en',
}

const LANGUAGES = [
    ['en', 'English'], ['hi', 'Hindi'], ['te', 'Telugu'],
    ['ta', 'Tamil'], ['mr', 'Marathi'], ['kn', 'Kannada'],
]

const FarmerRegister = () => {
    const [form, setForm] = useState(EMPTY)
    const [step, setStep] = useState(1) // 1 = account details, 2 = farm details
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const goToStep2 = (e) => {
        e.preventDefault()
        setError('')
        if (!form.name.trim()) return setError('Full name is required.')
        if (!form.phone.trim()) return setError('Phone number is required.')
        if (form.phone.trim().length < 10) return setError('Enter a valid 10-digit phone number.')
        if (!form.password) return setError('Password is required.')
        if (form.password.length < 6) return setError('Password must be at least 6 characters.')
        if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
        setStep(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!form.district.trim()) return setError('District is required.')
        if (!form.state.trim()) return setError('State is required.')
        if (!form.farmSize.trim()) return setError('Farm size is required.')
        if (!form.primaryCrops.trim()) return setError('Primary crops are required.')

        setLoading(true)
        try {
            await authService.registerFarmer({
                name: form.name,
                phone: form.phone,
                password: form.password,
                email: form.email,
                district: form.district,
                state: form.state,
                farmSize: form.farmSize,
                primaryCrops: form.primaryCrops,
                preferredLanguage: form.preferredLanguage,
                language: form.preferredLanguage,
            })
            setSuccess('Registration successful! Redirecting to sign in…')
            setTimeout(() => navigate('/login'), 1800)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="farmer-register-container">
            <img src={BG} alt="farm bg" className="farmer-register-bg" />

            {/* Top bar */}
            <nav className="farmer-register-nav">
                <Link to="/" className="farmer-register-logo-link">
                    <span className="farmer-register-logo-1">AGRI&nbsp;</span>
                    <span className="farmer-register-logo-2">CONNECT</span>
                </Link>
            </nav>

            <div className="farmer-register-content">
                <div className="farmer-register-card">
                    <h2 className="farmer-register-title">Farmer Sign Up</h2>

                    {/* Step indicator */}
                    <div className="farmer-register-steps">
                        <div className={`farmer-register-step ${step >= 1 ? 'active' : ''}`}>
                            <span className="farmer-register-step-num">1</span>
                            <span className="farmer-register-step-label">Account</span>
                        </div>
                        <div className="farmer-register-step-line" />
                        <div className={`farmer-register-step ${step >= 2 ? 'active' : ''}`}>
                            <span className="farmer-register-step-num">2</span>
                            <span className="farmer-register-step-label">Farm Details</span>
                        </div>
                    </div>

                    {/* ── STEP 1: Account details ── */}
                    {step === 1 && (
                        <form onSubmit={goToStep2} className="farmer-register-form">
                            <div className="farmer-register-field-group">
                                <div>
                                    <label className="farmer-register-label">Full Name <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="text" placeholder="e.g. Ramesh Kumar" value={form.name} onChange={set('name')} required />
                                </div>
                                <div>
                                    <label className="farmer-register-label">Phone Number <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={set('phone')} required />
                                </div>
                                <div>
                                    <label className="farmer-register-label">Email (optional)</label>
                                    <input className="farmer-register-input" type="email" placeholder="yourmail@example.com" value={form.email} onChange={set('email')} />
                                </div>
                                <div>
                                    <label className="farmer-register-label">Password <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
                                </div>
                                <div>
                                    <label className="farmer-register-label">Confirm Password <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
                                </div>
                                <div>
                                    <label className="farmer-register-label">Preferred Language <span className="req">*</span></label>
                                    <select className="farmer-register-input farmer-register-select" value={form.preferredLanguage} onChange={set('preferredLanguage')}>
                                        {LANGUAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                            </div>

                            {error && <p className="farmer-register-error">{error}</p>}

                            <button type="submit" className="farmer-register-btn farmer-register-btn-active">
                                Next: Farm Details →
                            </button>
                        </form>
                    )}

                    {/* ── STEP 2: Farm details ── */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="farmer-register-form">
                            <div className="farmer-register-field-group">
                                <div>
                                    <label className="farmer-register-label">District <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="text" placeholder="e.g. Guntur" value={form.district} onChange={set('district')} required />
                                </div>
                                <div>
                                    <label className="farmer-register-label">State <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="text" placeholder="e.g. Andhra Pradesh" value={form.state} onChange={set('state')} required />
                                </div>
                                <div>
                                    <label className="farmer-register-label">Farm Size (acres) <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="number" min="0.1" step="0.1" placeholder="e.g. 5" value={form.farmSize} onChange={set('farmSize')} required />
                                </div>
                                <div className="farmer-register-field-full">
                                    <label className="farmer-register-label">Primary Crops <span className="req">*</span></label>
                                    <input className="farmer-register-input" type="text" placeholder="e.g. Rice, Wheat, Tomato" value={form.primaryCrops} onChange={set('primaryCrops')} required />
                                    <span className="farmer-register-hint">Separate multiple crops with commas</span>
                                </div>
                            </div>

                            {error && <p className="farmer-register-error">{error}</p>}
                            {success && <p className="farmer-register-success">{success}</p>}

                            <div className="farmer-register-btn-row">
                                <button type="button" onClick={() => { setStep(1); setError('') }} className="farmer-register-btn farmer-register-btn-back">
                                    ← Back
                                </button>
                                <button type="submit" disabled={loading} className={`farmer-register-btn ${loading ? 'farmer-register-btn-loading' : 'farmer-register-btn-active'}`}>
                                    {loading ? 'Registering…' : '✓ Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="farmer-register-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="farmer-register-link-primary">Sign In</Link>
                    </p>
                    <p className="farmer-register-footer-text-secondary">
                        Not a farmer?{' '}
                        <Link to="/register" className="farmer-register-link-secondary">Choose a different role</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FarmerRegister
