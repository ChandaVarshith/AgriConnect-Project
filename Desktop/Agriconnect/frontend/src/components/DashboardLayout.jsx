import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

/**
 * Nav items for each role — matches reference "right nav" design.
 * Clicking an item navigates to that route.
 */
const NAV_ITEMS = {
    farmer: [
        { label: 'MY HOME', path: '/farmer' },
        { label: 'MY SUGGESTION REQUESTS', path: '/farmer/query' },
        { label: 'MY RESPONSES', path: '/farmer/responses' },
        { label: 'VIEW ALL LOANS', path: '/farmer/loans' },
        { label: 'EXPLORE FARMING CONTENT', path: '/farmer/articles' },
    ],
    expert: [
        { label: 'MY HOME', path: '/expert' },
        { label: 'FARMER REQUESTS', path: '/expert/requests' },
        { label: 'MY RESPONSES', path: '/expert/responses' },
        { label: 'CREATE CONTENT', path: '/expert/article/create' },
        { label: 'GEMINI ASSISTANCE', path: '/expert/gemini' },
    ],
    financier: [
        { label: 'MY HOME', path: '/financier' },
        { label: 'ADD LOAN', path: '/financier/add-loan' },
        { label: 'LOAN REQUESTS', path: '/financier/loan-requests' },
        { label: 'ALL LOANS', path: '/financier/loans' },
    ],
    admin: [
        { label: 'ADMIN HOME', path: '/admin' },
        { label: 'ADD FARMER', path: '/admin/farmers' },
        { label: 'VIEW ALL FARMERS', path: '/admin/farmers' },
        { label: 'ADD EXPERT', path: '/admin/experts' },
        { label: 'APPROVE EXPERTS', path: '/admin/experts' },
        { label: 'VIEW ALL EXPERTS', path: '/admin/experts' },
        { label: 'ADD FINANCIER', path: '/admin/financiers' },
        { label: 'VIEW ALL FINANCIERS', path: '/admin/financiers' },
        { label: 'ADMIN DASHBOARD', path: '/admin' },
    ],
}

/**
 * DashboardLayout — matches the reference "stacked 3D card + right nav" design.
 * Props:
 *   role        — the user role string (for Navbar + nav items)
 *   photoUrl    — URL of the main photo to show in the card
 *   welcomeText — bold heading inside the photo card
 *   subText     — paragraph under the heading
 *   children    — any extra content below (stats, charts, etc.)
 */
const DashboardLayout = ({ role, photoUrl, welcomeText, subText, children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const navItems = NAV_ITEMS[role] || []

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative' }}>
            <Navbar role={role} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '100vh',
                paddingTop: 70,
                position: 'relative',
                zIndex: 1,
            }}>
                {/* ── Left: Stacked photo cards ──────────── */}
                <div style={{
                    flex: '0 0 62%',
                    position: 'relative',
                    height: 480,
                    paddingLeft: 60,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {/* Ghost cards (depth layers) */}
                    {[
                        { w: 560, h: 398, left: 35, bg: '#1c1c1c', opacity: 0.55, z: 1 },
                        { w: 590, h: 416, left: 18, bg: '#252525', opacity: 0.45, z: 2 },
                        { w: 615, h: 432, left: 2, bg: '#2e2e2e', opacity: 0.35, z: 3 },
                    ].map((c, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: c.w, height: c.h,
                            left: c.left,
                            top: '50%', transform: 'translateY(-50%)',
                            background: c.bg,
                            opacity: c.opacity,
                            borderRadius: 6,
                            zIndex: c.z,
                        }} />
                    ))}

                    {/* Main photo card */}
                    <div style={{
                        position: 'absolute',
                        width: 570, height: 408,
                        left: 50,
                        top: '50%', transform: 'translateY(-50%)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        zIndex: 10,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                    }}>
                        <img src={photoUrl} alt="dashboard background"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
                        {/* Text overlay at bottom */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            padding: '32px 36px',
                            textAlign: 'center',
                        }}>
                            <h2 style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontWeight: 800,
                                fontSize: '1.75rem',
                                color: '#fff',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                marginBottom: 12,
                                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                            }}>{welcomeText}</h2>
                            {subText && (
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#e0e0e0',
                                    lineHeight: 1.6,
                                    maxWidth: 380,
                                    textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                                }}>{subText}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right: Nav menu items ──────────────── */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingLeft: 40,
                    gap: 20,
                }}>
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '1.3rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: isActive ? '#e02020' : '#ffffff',
                                    padding: 0,
                                    textAlign: 'left',
                                    transition: 'color 0.2s',
                                    lineHeight: 1.15,
                                }}
                                onMouseEnter={e => { if (!isActive) e.target.style.color = '#e02020' }}
                                onMouseLeave={e => { if (!isActive) e.target.style.color = '#ffffff' }}
                            >
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── Extra content below hero ─────────────────────────────── */}
            {children && (
                <div style={{ padding: '0 60px 60px', maxWidth: 1300 }}>
                    {children}
                </div>
            )}
        </div>
    )
}

export default DashboardLayout
