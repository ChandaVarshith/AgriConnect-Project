import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

// Unsplash farming photo – rice paddy with farmer silhouette
const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const PublicHome = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}>
            {/* Full-screen background photo */}
            <img src={BG} alt="farm"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38)', zIndex: 0 }} />

            <Navbar publicNav />

            {/* Hero content */}
            <div style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 24px 40px',
            }}>
                <div>
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
                        fontSize: '1.1rem',
                        color: '#ddd',
                        maxWidth: 620,
                        margin: '0 auto 36px',
                        fontStyle: 'italic',
                        textShadow: '0 1px 8px rgba(0,0,0,0.7)',
                    }}>
                        "Together, we can cultivate success and resilience through knowledge, innovation, and community."
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/login" style={{
                            background: '#e02020', color: '#fff', padding: '13px 36px',
                            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                            fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                            borderRadius: 3, textDecoration: 'none', transition: 'background 0.2s',
                        }}>Sign In</Link>
                        <Link to="/register/farmer" style={{
                            background: 'transparent', color: '#fff', padding: '12px 36px',
                            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                            fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                            borderRadius: 3, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.6)',
                            transition: 'border-color 0.2s',
                        }}>Register as Farmer</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicHome
