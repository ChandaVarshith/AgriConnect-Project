import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const NAV_ITEMS = {
    admin: [
        { to: '/admin', label: 'Admin Home' },
        { to: '/admin/farmers', label: 'Add Farmer' },
        { to: '/admin/farmers', label: 'View All Farmers' },
        { to: '/admin/experts', label: 'Add Expert' },
        { to: '/admin/experts', label: 'Approve Experts' },
        { to: '/admin/experts', label: 'View All Experts' },
        { to: '/admin/financiers', label: 'Add Financier' },
        { to: '/admin/financiers', label: 'View All Financiers' },
        { to: '/admin', label: 'Admin Dashboard' },
    ],
    farmer: [
        { to: '/farmer', label: 'My Home' },
        { to: '/farmer/query', label: 'My Suggestion Requests' },
        { to: '/farmer/responses', label: 'My Responses' },
        { to: '/farmer/loans', label: 'View All Loans' },
        { to: '/farmer/articles', label: 'Explore Farming Content' },
    ],
    expert: [
        { to: '/expert', label: 'My Home' },
        { to: '/expert/requests', label: 'Farmer Incoming Requests' },
        { to: '/expert/responses', label: 'My Responses' },
        { to: '/expert/article/create', label: 'Create Content' },
        { to: '/expert/gemini', label: 'Get Gemini Assistance' },
        { to: '/expert/crop-map', label: 'Explore Interactive Map' },
    ],
    financier: [
        { to: '/financier', label: 'My Home' },
        { to: '/financier/add-loan', label: 'Add Loan' },
        { to: '/financier/loan-requests', label: 'All Loan Requests' },
        { to: '/financier/all-loans', label: 'View All Loans' },
    ],
    public: [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Sign In' },
        { to: '/explore', label: 'Explore' },
    ],
}

const LANGUAGES = ['English', 'Telugu', 'Hindi', 'Marathi', 'Tamil', 'French']

const Navbar = ({ role: roleProp, publicNav }) => {
    const { user, role: authRole, logout } = useAuth()
    const { language, changeLanguage } = useLanguage()
    const navigate = useNavigate()
    const role = roleProp || authRole || (publicNav ? 'public' : null)

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
                    {/* Globe language selector */}
                    {user && (
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
                                        <div key={lang}
                                            onClick={() => { changeLanguage(lang.toLowerCase().slice(0, 2)); setLangOpen(false) }}
                                            style={{
                                                padding: '10px 16px',
                                                fontWeight: language === lang.toLowerCase().slice(0, 2) ? 700 : 400,
                                                background: language === lang.toLowerCase().slice(0, 2) ? '#4caf50' : 'transparent',
                                                color: language === lang.toLowerCase().slice(0, 2) ? '#fff' : '#111',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => { if (language !== lang.toLowerCase().slice(0, 2)) e.target.style.background = '#f5f5f5' }}
                                            onMouseLeave={e => { if (language !== lang.toLowerCase().slice(0, 2)) e.target.style.background = 'transparent' }}
                                        >
                                            {lang}
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

                    {/* Logout */}
                    {user && (
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </nav>

            {/* ── Slide-in Side Menu ─────── */}
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
    )
}

export default Navbar
