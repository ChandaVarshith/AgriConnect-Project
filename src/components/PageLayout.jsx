import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

/* ── Role-based default background images ───────────────── */
const ROLE_BG = {
    farmer: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80',
    expert: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&auto=format&fit=crop&q=80',
    financier: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&auto=format&fit=crop&q=80',
    admin: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1400&auto=format&fit=crop&q=80',
}

const LANGUAGES = [
    { label: 'English', code: 'en' },
    { label: 'Telugu', code: 'te' },
    { label: 'Hindi', code: 'hi' },
    { label: 'Spanish', code: 'es' },
]

/**
 * PageLayout — wraps every non-home content page.
 *
 * Props:
 *  role        – 'farmer' | 'expert' | 'financier' | 'admin'
 *  bgUrl       – optional override bg image (defaults to role-based image)
 *  title       – page title shown in the content area header
 *  children    – page content
 */
const PageLayout = ({ role, bgUrl, title, children }) => {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const { language, changeLanguage } = useLanguage()
    const [langOpen, setLangOpen] = useState(false)
    const langRef = useRef(null)

    const bg = bgUrl || ROLE_BG[role] || ROLE_BG.farmer

    useEffect(() => {
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>

            {/* ── Fixed full-page background ────────────────────────── */}
            <img
                src={bg}
                alt="background"
                style={{
                    position: 'fixed', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.32)',
                    zIndex: 0,
                }}
            />

            {/* ── Single top bar ────────────────────────────────────── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                height: 60,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 28px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                zIndex: 200,
            }}>
                {/* Logo — click goes back to role home */}
                <NavLink
                    to={`/${role}`}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#fff', letterSpacing: '0.04em' }}>AGRI&nbsp;</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#e02020', letterSpacing: '0.04em' }}>CONNECT</span>
                </NavLink>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Language globe */}
                    <div style={{ position: 'relative' }} ref={langRef}>
                        <button
                            onClick={() => setLangOpen(v => !v)}
                            title="Change Language"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}
                        >
                            🌐
                        </button>
                        {langOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: 40,
                                background: '#fff', color: '#111',
                                borderRadius: 6, minWidth: 140,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                zIndex: 700, overflow: 'hidden',
                            }}>
                                {LANGUAGES.map(lang => (
                                    <div
                                        key={lang.code}
                                        onClick={() => { changeLanguage(lang.code); setLangOpen(false) }}
                                        style={{
                                            padding: '10px 16px', cursor: 'pointer',
                                            fontWeight: language === lang.code ? 700 : 400,
                                            background: language === lang.code ? '#4caf50' : 'transparent',
                                            color: language === lang.code ? '#fff' : '#111',
                                            borderBottom: '1px solid #eee',
                                        }}
                                    >
                                        {lang.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Back to home */}
                    <button
                        onClick={() => navigate(`/${role}`)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 5, padding: '7px 16px',
                            cursor: 'pointer', fontWeight: 600,
                            fontSize: '0.82rem', letterSpacing: '0.04em',
                        }}
                    >
                        ← HOME
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            background: '#e02020', color: '#fff',
                            border: 'none', borderRadius: 5,
                            padding: '7px 18px', cursor: 'pointer',
                            fontWeight: 700, fontSize: '0.82rem',
                            letterSpacing: '0.05em', textTransform: 'uppercase',
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* ── Scrollable content below the top bar ─────────────── */}
            <div style={{
                position: 'relative', zIndex: 10,
                paddingTop: 80, paddingBottom: 60,
                paddingLeft: 48, paddingRight: 48,
                maxWidth: 1200, margin: '0 auto',
            }}>
                {title && (
                    <h1 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 800, fontSize: '2rem',
                        color: '#fff', textTransform: 'uppercase',
                        letterSpacing: '0.06em', marginBottom: 28,
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    }}>
                        {title}
                    </h1>
                )}
                {children}
            </div>
        </div>
    )
}

export default PageLayout
