import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const PROBLEMS = [
    'Farmer-to-resource disconnection',
    'Limited access to agricultural finance',
    'Challenges in selling produce profitably',
    'Language and literacy barriers',
    'Outdated farming techniques & knowledge gaps',
    'Unpredictable weather and climate risks',
    'Low technology adoption among rural farmers',
]

const SOLUTIONS = [
    'Full-stack AgriConnect platform with role-based access',
    'Expert-guided crop suggestion & response system',
    'Integrated loan marketplace with direct financier contact',
    'Multilingual interface (English, Telugu, Hindi, Spanish)',
    'Modern farming content library with expert articles',
    'Real-time weather widget for informed decision-making',
    'Peer marketplace for selling farm produce directly',
]

const PublicHome = () => {
    const scrollToOverview = () => {
        document.getElementById('platform-overview')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div style={{ background: '#000', position: 'relative' }}>
            {/* ── SECTION 1: Hero ────────────────────────────────── */}
            <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
                <img src={BG} alt="farm"
                    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38)', zIndex: 0 }} />

                <Navbar publicNav />

                <div style={{
                    position: 'relative', zIndex: 10,
                    minHeight: '100vh',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center',
                    padding: '80px 24px 40px',
                }}>
                    <div style={{ maxWidth: 720 }}>
                        <div style={{ width: 56, height: 4, background: '#e02020', borderRadius: 2, margin: '0 auto 28px' }} />
                        <h1 style={{
                            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 800,
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            marginBottom: 20,
                            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                        }}>
                            Empowering Farmers for a Sustainable Future
                        </h1>
                        <p style={{
                            fontSize: '1.15rem',
                            color: '#ddd',
                            maxWidth: 620,
                            margin: '0 auto 36px',
                            fontStyle: 'italic',
                            textShadow: '0 1px 8px rgba(0,0,0,0.7)',
                            lineHeight: 1.8,
                        }}>
                            "Together, we can cultivate success and resilience through knowledge, innovation, and community."
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/login" style={{
                                background: '#e02020', color: '#fff', padding: '14px 40px',
                                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                                fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                borderRadius: 3, textDecoration: 'none', transition: 'background 0.2s',
                                boxShadow: '0 4px 20px rgba(224,32,32,0.4)',
                            }}>Sign In</Link>
                            <Link to="/register/farmer" style={{
                                background: 'transparent', color: '#fff', padding: '13px 40px',
                                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                                fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                borderRadius: 3, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.6)',
                                transition: 'border-color 0.2s',
                            }}>Register as Farmer</Link>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <button onClick={scrollToOverview} style={{
                        position: 'absolute', bottom: 36,
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        color: 'rgba(255,255,255,0.5)',
                        animation: 'bounce 2s infinite',
                    }}>
                        <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>Scroll Down</span>
                        <span style={{ fontSize: '1.4rem' }}>↓</span>
                    </button>
                </div>
            </div>

            {/* ── SECTION 2: Platform Overview ─────────────────── */}
            <div id="platform-overview" style={{
                minHeight: '100vh',
                position: 'relative',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d1a0d 100%)',
                padding: '80px 40px',
            }}>
                {/* Decorative bg texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(22,163,74,0.06) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
                    {/* Section heading */}
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <div style={{ width: 56, height: 4, background: '#22c55e', borderRadius: 2, margin: '0 auto 20px' }} />
                        <h2 style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            color: '#fff', textTransform: 'uppercase',
                            letterSpacing: '0.06em', marginBottom: 14,
                        }}>
                            All-in-One Agricultural Platform
                        </h2>
                        <p style={{ color: '#888', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>
                            AgriConnect bridges the gap between farmers, experts, financiers, and consumers — all in one platform.
                        </p>
                    </div>

                    {/* Two-column cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 28,
                    }}>
                        {/* Problem Statement */}
                        <div style={{
                            background: 'rgba(220,38,38,0.06)',
                            border: '1px solid rgba(220,38,38,0.25)',
                            borderTop: '3px solid #e02020',
                            borderRadius: 14,
                            padding: '32px 30px',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <div style={{ width: 40, height: 40, background: 'rgba(220,38,38,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>⚠️</div>
                                <h3 style={{ color: '#e02020', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>The Problem</h3>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {PROBLEMS.map((p, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#ccc', fontSize: '0.92rem', lineHeight: 1.5 }}>
                                        <span style={{ color: '#e02020', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✗</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Solution */}
                        <div style={{
                            background: 'rgba(34,197,94,0.06)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            borderTop: '3px solid #22c55e',
                            borderRadius: 14,
                            padding: '32px 30px',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <div style={{ width: 40, height: 40, background: 'rgba(34,197,94,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>✅</div>
                                <h3 style={{ color: '#22c55e', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>AgriConnect Solution</h3>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {SOLUTIONS.map((s, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#ccc', fontSize: '0.92rem', lineHeight: 1.5 }}>
                                        <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Role badges */}
                    <div style={{ textAlign: 'center', marginTop: 60 }}>
                        <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'Barlow Condensed', sans-serif" }}>Role-based access for</p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Admin', 'Farmer', 'Expert', 'Financier', 'Public'].map(role => (
                                <span key={role} style={{
                                    padding: '8px 20px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: 50,
                                    color: '#bbb',
                                    fontSize: '0.82rem',
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    background: 'rgba(255,255,255,0.04)',
                                }}>
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: 'center', marginTop: 56 }}>
                        <Link to="/login" style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                            color: '#000', padding: '16px 52px',
                            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                            fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                            borderRadius: 4, textDecoration: 'none',
                            boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
                            transition: 'transform 0.2s',
                        }}>Get Started Today</Link>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }
            `}</style>
        </div>
    )
}

export default PublicHome
