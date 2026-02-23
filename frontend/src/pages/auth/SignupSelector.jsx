import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Full-page background */}
            <img src={BG} alt="farm bg" style={{
                position: 'fixed', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.32)',
                zIndex: 0,
            }} />

            {/* Minimal top bar */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                height: 56, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                zIndex: 100,
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex' }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#fff' }}>AGRI&nbsp;</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.35rem', color: '#e02020' }}>CONNECT</span>
                </Link>
            </nav>

            {/* Content */}
            <div style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '90px 24px 60px',
            }}>
                <h1 style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    color: '#fff', fontSize: '2.2rem', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 10, textAlign: 'center',
                    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}>
                    Create Your Account
                </h1>
                <p style={{
                    color: '#ccc', fontSize: '0.95rem', marginBottom: 44,
                    textAlign: 'center', maxWidth: 420,
                    textShadow: '0 1px 6px rgba(0,0,0,0.7)',
                }}>
                    Choose the role that best describes you to get started.
                </p>

                {/* Role cards */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    gap: 22, justifyContent: 'center',
                    maxWidth: 920, width: '100%',
                }}>
                    {ROLES.map(r => (
                        <div
                            key={r.id}
                            onClick={() => navigate(r.path)}
                            style={{
                                flex: '1 1 240px', maxWidth: 270,
                                background: 'rgba(255,255,255,0.09)',
                                backdropFilter: 'blur(14px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 16,
                                padding: '34px 24px 28px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.22s ease',
                                userSelect: 'none',
                            }}
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
                            <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>{r.emoji}</div>
                            <div style={{
                                color: '#fff', fontSize: '1.15rem',
                                fontWeight: 700, marginBottom: 10,
                                fontFamily: "'Barlow Condensed',sans-serif",
                                letterSpacing: '0.04em',
                            }}>
                                {r.title}
                            </div>
                            <div style={{ color: '#bbb', fontSize: '0.83rem', lineHeight: 1.5, marginBottom: 20 }}>
                                {r.desc}
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '9px 28px',
                                borderRadius: 50,
                                background: r.accent,
                                color: r.id === 'expert' ? '#fff' : '#000',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                letterSpacing: '0.04em',
                            }}>
                                Sign Up
                            </div>
                        </div>
                    ))}
                </div>

                <p style={{ color: '#999', fontSize: '0.85rem', marginTop: 38, textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#e02020', fontWeight: 600, textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignupSelector
