import React from 'react'
import Navbar from './Navbar'

/* ── Role-based default background images ───────────────── */
const ROLE_BG = {
    farmer: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80',
    expert: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&auto=format&fit=crop&q=80',
    financier: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&auto=format&fit=crop&q=80',
    admin: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1400&auto=format&fit=crop&q=80',
    public: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&auto=format&fit=crop&q=80',
}

/**
 * PageLayout — wraps every non-home content page.
 *
 * Now uses the shared Navbar component (with hamburger + nav links)
 * instead of a custom minimal top bar.
 */
const PageLayout = ({ role, bgUrl, title, publicNav, children }) => {
    const bg = bgUrl || ROLE_BG[role] || ROLE_BG.farmer

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

            {/* ── Shared Navbar (hamburger contains all nav items) ── */}
            <Navbar role={role} publicNav={publicNav} />

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
