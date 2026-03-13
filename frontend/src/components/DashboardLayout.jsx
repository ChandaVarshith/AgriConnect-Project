import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * DashboardLayout — used ONLY for the home/landing page of each role.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  TOP NAVBAR: Logo ·  · ☰ (nav items in hamburger) · Logout│
 *   ├──────────────────────────────────────────────────────────────┤
 *   │              Full-page background image                      │
 *   │         (centered glassmorphism welcome card)                │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * Nav items live in the Navbar hamburger side-menu — NOT on the right side.
 */
const DashboardLayout = ({ role, photoUrl, welcomeText, subText, children }) => {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

            {/* ── Full-page background image (fixed, darkened) ─── */}
            <img
                src={photoUrl}
                alt="background"
                style={{
                    position: 'fixed', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    filter: 'brightness(0.4)',
                    zIndex: 0,
                }}
            />

            {/* ── Top Navbar (hamburger contains all nav items) ── */}
            <Navbar role={role} />

            {/* ── Hero section: text directly on background ────── */}
            <div style={{
                position: 'relative', zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '80px 32px 40px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 700 }}>
                    {/* Accent bar */}
                    <div style={{ width: 56, height: 4, background: '#e02020', borderRadius: 2, margin: '0 auto 28px' }} />

                    <h1 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 900,
                        fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        lineHeight: 1.1,
                        marginBottom: 22,
                        textShadow: '0 2px 24px rgba(0,0,0,0.95)',
                    }}>
                        {welcomeText}
                    </h1>

                    {subText && (
                        <p style={{
                            fontSize: '1rem',
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.8,
                            maxWidth: 560,
                            margin: '0 auto',
                            fontStyle: 'italic',
                            textShadow: '0 1px 12px rgba(0,0,0,0.9)',
                        }}>
                            "{subText}"
                        </p>
                    )}
                </div>
            </div>

            {/* Children (quick-action cards, admin stats, etc.) */}
            {children && (
                <div style={{ position: 'relative', zIndex: 10, padding: '0 32px 60px', maxWidth: 1300, margin: '0 auto' }}>
                    {children}
                </div>
            )}

            {/* Global Footer added safely at the bottom of the layout boundary */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <Footer />
            </div>
        </div>
    )
}

export default DashboardLayout
