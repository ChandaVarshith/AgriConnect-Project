import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './SignupSelector.css'

// Farm field at dusk — consistent with the overall auth page theme
const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const ROLES = [
    {
        id: 'farmer',
        emoji: '🌾',
        title: 'Farmer',
        desc: 'Browse loans, submit queries, and explore expert articles.',
        path: '/register/farmer',
        accent: '#22c55e',
    },
    {
        id: 'expert',
        emoji: '🧑‍🔬',
        title: 'Expert',
        desc: 'Answer farmer queries and publish agricultural articles.',
        path: '/register/expert',
        accent: '#3b82f6',
    },
    {
        id: 'financier',
        emoji: '🏦',
        title: 'Financier',
        desc: 'Offer loan products and manage farmer loan requests.',
        path: '/register/financier',
        accent: '#f59e0b',
    },
    {
        id: 'public',
        emoji: '👤',
        title: 'Public User',
        desc: 'Explore farming content, learn agriculture, and buy fresh produce.',
        path: '/register/public',
        accent: '#a855f7',
    },
]


const SignupSelector = () => {
    const navigate = useNavigate()

    return (
        <div className="signup-selector-container">
            {/* Full-page background */}
            <img src={BG} alt="farm bg" className="signup-selector-bg" />

            {/* Minimal top bar */}
            <nav className="signup-selector-nav">
                <Link to="/" className="signup-selector-logo-link">
                    <span className="signup-selector-logo-1">AGRI&nbsp;</span>
                    <span className="signup-selector-logo-2">CONNECT</span>
                </Link>
            </nav>

            {/* Content */}
            <div className="signup-selector-content">
                <h1 className="signup-selector-title">
                    Create Your Account
                </h1>
                <p className="signup-selector-subtitle">
                    Choose the role that best describes you to get started.
                </p>

                {/* Role cards */}
                <div className="signup-selector-grid">
                    {ROLES.map(r => (
                        <div
                            key={r.id}
                            onClick={() => navigate(r.path)}
                            className="signup-selector-card"
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = r.accent
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                                e.currentTarget.style.transform = 'translateY(-6px)'
                                e.currentTarget.style.boxShadow = `0 14px 32px ${r.accent}40`
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            <div className="signup-selector-card-emoji">{r.emoji}</div>
                            <div className="signup-selector-card-title">
                                {r.title}
                            </div>
                            <div className="signup-selector-card-desc">
                                {r.desc}
                            </div>
                            <div className="signup-selector-card-btn" style={{
                                background: r.accent,
                                color: r.id === 'expert' ? '#fff' : '#000',
                            }}>
                                Sign Up
                            </div>
                        </div>
                    ))}
                </div>

                <p className="signup-selector-footer-text">
                    Already have an account?{' '}
                    <Link to="/login" className="signup-selector-footer-link">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignupSelector
