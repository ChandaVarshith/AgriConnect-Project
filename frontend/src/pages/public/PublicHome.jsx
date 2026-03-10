import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './PublicHome.css'

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
        <div className="public-home-container">
            {/* ── SECTION 1: Hero ────────────────────────────────── */}
            <div className="public-home-hero">
                <img src={BG} alt="farm" className="public-home-hero-bg" />

                <Navbar publicNav />

                <div className="public-home-hero-content">
                    <div className="public-home-hero-inner">
                        <div className="public-home-hero-divider" />
                        <h1 className="public-home-hero-title">
                            Empowering Farmers for a Sustainable Future
                        </h1>
                        <p className="public-home-hero-subtitle">
                            "Together, we can cultivate success and resilience through knowledge, innovation, and community."
                        </p>
                        <div className="public-home-hero-actions">
                            <Link to="/login" className="public-home-btn-primary">Sign In</Link>
                            <Link to="/register/farmer" className="public-home-btn-secondary">Register as Farmer</Link>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <button onClick={scrollToOverview} className="public-home-scroll-btn">
                        <span className="public-home-scroll-text">Scroll Down</span>
                        <span className="public-home-scroll-icon">↓</span>
                    </button>
                </div>
            </div>

            {/* ── SECTION 2: Platform Overview ─────────────────── */}
            <div id="platform-overview" className="public-home-overview">
                {/* Decorative bg texture */}
                <div className="public-home-overview-bg" />

                <div className="public-home-overview-inner">
                    {/* Section heading */}
                    <div className="public-home-section-header">
                        <div className="public-home-section-divider" />
                        <h2 className="public-home-section-title">
                            All-in-One Agricultural Platform
                        </h2>
                        <p className="public-home-section-desc">
                            AgriConnect bridges the gap between farmers, experts, financiers, and consumers — all in one platform.
                        </p>
                    </div>

                    {/* Two-column cards */}
                    <div className="public-home-cards-grid">
                        {/* Problem Statement */}
                        <div className="public-home-problem-card">
                            <div className="public-home-card-header">
                                <div className="public-home-card-icon-problem">⚠️</div>
                                <h3 className="public-home-card-title-problem">The Problem</h3>
                            </div>
                            <ul className="public-home-card-list">
                                {PROBLEMS.map((p, i) => (
                                    <li key={i} className="public-home-card-list-item">
                                        <span className="public-home-card-list-icon-problem">✗</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Solution */}
                        <div className="public-home-solution-card">
                            <div className="public-home-card-header">
                                <div className="public-home-card-icon-solution">✅</div>
                                <h3 className="public-home-card-title-solution">AgriConnect Solution</h3>
                            </div>
                            <ul className="public-home-card-list">
                                {SOLUTIONS.map((s, i) => (
                                    <li key={i} className="public-home-card-list-item">
                                        <span className="public-home-card-list-icon-solution">✓</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Role badges */}
                    <div className="public-home-roles">
                        <p className="public-home-roles-title">Role-based access for</p>
                        <div className="public-home-roles-grid">
                            {['Admin', 'Farmer', 'Expert', 'Financier', 'Public'].map(role => (
                                <span key={role} className="public-home-roles-badge">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="public-home-cta">
                        <Link to="/login" className="public-home-cta-btn">Get Started Today</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicHome
