import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import t from '../utils/translate'

const NAV_ITEMS = {
    admin: [
        { to: '/admin', label: 'Admin Dashboard' },
        { to: '/admin/farmers', label: 'Manage Farmers' },
        { to: '/admin/experts', label: 'Manage Experts' },
        { to: '/admin/financiers', label: 'Manage All Financiers' },
        { to: '/admin/sectors', label: 'Add New Sectors' },
    ],
    farmer: [
        { to: '/farmer', label: 'My Home' },
        { to: '/farmer/query', label: 'My Suggestion Requests' },
        { to: '/farmer/responses', label: 'My Responses' },
        { to: '/farmer/loans', label: 'View All Loans' },
        { to: '/farmer/articles', label: 'Explore Farming Content' },
        { to: '/farmer/marketplace', label: 'Sell My Produce' },
    ],
    expert: [
        { to: '/expert', label: 'My Home' },
        { to: '/expert/requests', label: 'Farmer Incoming Requests' },
        { to: '/expert/responses', label: 'My Responses' },
        { to: '/expert/content', label: 'All Content' },
        { to: '/expert/article/create', label: 'Create Content' },
        { to: '/expert/marketplace', label: 'Marketplace Management' },
        { to: '/expert/gemini', label: 'AgriBot AI' },
        { to: '/expert/crop-map', label: 'Explore Interactive Map' },
    ],
    financier: [
        { to: '/financier', label: 'My Home' },
        { to: '/financier/add-loan', label: 'Add Loan' },
        { to: '/financier/loan-requests', label: 'All Loan Requests' },
        { to: '/financier/all-loans', label: 'View All Loans' },
        { to: '/financier/farmer-loans', label: 'Farmer Loan Portfolio' },
    ],
    public: [
        { to: '/public/home', label: 'My Home' },
        { to: '/public/disease-detection', label: 'Crop Disease Detection' },
        { to: '/public/content', label: 'Explore Content' },
        { to: '/public/learn', label: 'Learn Farming' },
        { to: '/public/buy', label: 'Buy Resources' },
    ],
    _landing: [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Sign In' },
        { to: '/explore', label: 'Explore' },
    ],
}


const LANGUAGES = [
    { label: 'English', code: 'en' },
    { label: 'Telugu', code: 'te' },
    { label: 'Hindi', code: 'hi' },
    { label: 'French', code: 'fr' },
]

const Navbar = ({ role: roleProp, publicNav, logoOnly }) => {
    const { user, role: authRole, logout } = useAuth()
    const { language, changeLanguage } = useLanguage()
    const navigate = useNavigate()
    const role = publicNav ? '_landing' : (roleProp || authRole || null)

    const [menuOpen, setMenuOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const langRef = useRef(null)

    // Close lang dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
        setMenuOpen(false)
    }

    const items = NAV_ITEMS[role] || []

    return (
        <>
            {/* ── Top Bar ────────────────── */}
            <nav className="top-nav">
                <NavLink to="/" className="logo">
                    <span className="agri">AGRI&nbsp;</span>
                    <span className="connect">CONNECT</span>
                </NavLink>

                <div className="nav-right">
                    {/* Navigation items based on role */}
                    {logoOnly ? null : role === '_landing' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Globe language selector for Public Home */}
                            <div style={{ position: 'relative' }} ref={langRef}>
                                <button className="globe-btn" onClick={() => setLangOpen(!langOpen)} style={{ padding: '8px', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '1.2rem'}}
                                    title="Change Language">
                                    🌐
                                </button>
                                {langOpen && (
                                    <div style={{
                                        position: 'absolute', right: 0, top: '40px',
                                        background: '#fff', color: '#111', borderRadius: 6,
                                        minWidth: 140, boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                                        zIndex: 700, overflow: 'hidden',
                                    }}>
                                        {LANGUAGES.map(lang => (
                                            <div key={lang.code}
                                                onClick={() => { changeLanguage(lang.code); setLangOpen(false) }}
                                                style={{
                                                    padding: '12px 18px',
                                                    fontWeight: language === lang.code ? 700 : 400,
                                                    background: language === lang.code ? '#16a34a' : 'transparent',
                                                    color: language === lang.code ? '#fff' : '#111',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    transition: 'all 0.2s ease',
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                {lang.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <NavLink to="/login" style={{ textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: '0.95rem', padding: '8px 12px', transition: 'color 0.2s', ':hover': { color: '#22c55e' }}}>{t('signin', language)}</NavLink>
                            <NavLink to="/register" style={{ textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: '0.95rem', background: '#22c55e', padding: '8px 20px', borderRadius: '50px', transition: 'background 0.2s', ':hover': { background: '#16a34a' }}}>{t('register', language)}</NavLink>
                        </div>
                    ) : (
                        <>
                            {/* Globe language selector for logged-in farmers */}
                            {user && roleProp === 'farmer' && (
                                <div style={{ position: 'relative' }} ref={langRef}>
                                    <button className="globe-btn" onClick={() => setLangOpen(!langOpen)}
                                        title="Change Language">
                                        🌐
                                    </button>
                                    {langOpen && (
                                        <div style={{
                                            position: 'absolute', right: 0, top: '38px',
                                            background: '#fff', color: '#111', borderRadius: 4,
                                            minWidth: 140, boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                            zIndex: 700, overflow: 'hidden',
                                        }}>
                                            {LANGUAGES.map(lang => (
                                                <div key={lang.code}
                                                    onClick={() => { changeLanguage(lang.code); setLangOpen(false) }}
                                                    style={{
                                                        padding: '10px 16px',
                                                        fontWeight: language === lang.code ? 700 : 400,
                                                        background: language === lang.code ? '#4caf50' : 'transparent',
                                                        color: language === lang.code ? '#fff' : '#111',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #eee',
                                                        transition: 'background 0.15s',
                                                    }}
                                                >
                                                    {lang.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hamburger / Close */}
                            <button
                                className={`hamburger-btn${menuOpen ? ' open' : ''}`}
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Toggle menu">
                                <span /><span /><span />
                            </button>

                            {/* Logout — only inside dashboards, not on landing page */}
                            {user && (
                                <button className="btn-logout" onClick={handleLogout}>Logout</button>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* ── Slide-in Side Menu ─────── */}
            {!logoOnly && (
                <>
                    <div className={`side-menu-overlay${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(false)} />

                    <div className={`side-menu${menuOpen ? ' open' : ''}`}>
                        {items.map((item, idx) => (
                            <NavLink
                                key={idx}
                                to={item.to}
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}>
                                {item.label}
                            </NavLink>
                        ))}
                        {!user && (
                            <NavLink to="/login" onClick={() => setMenuOpen(false)}>Sign In</NavLink>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default Navbar
