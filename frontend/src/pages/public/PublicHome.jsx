import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useLanguage } from '../../context/LanguageContext'
import t from '../../utils/translate'
import './PublicHome.css'

// Background image requested by user
const HERO_BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

// --- ROLLING NUMBER COMPONENT ---
const RollingNumber = ({ target, suffix = '', duration = 1500 }) => {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const domRef = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsVisible(true)
            }
        })
        const el = domRef.current
        if (el) observer.observe(el)
        return () => {
            if (el) observer.unobserve(el)
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTimestamp = null
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeProgress * target))
            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }
        window.requestAnimationFrame(step)
    }, [isVisible, target, duration])

    return (
        <div ref={domRef} className="stat-number">
            {count}{suffix}
        </div>
    )
}


const PublicHome = () => {
    const { language } = useLanguage()

    const FEATURES = [
        {
            title: t('feature1Title', language),
            icon: '🌿',
            desc: t('feature1Desc', language)
        },
        {
            title: t('feature2Title', language),
            icon: '🛒',
            desc: t('feature2Desc', language)
        },
        {
            title: t('feature3Title', language),
            icon: '💳',
            desc: t('feature3Desc', language)
        },
        {
            title: t('feature4Title', language),
            icon: '⛅',
            desc: t('feature4Desc', language)
        },
        {
            title: t('feature5Title', language),
            icon: '🗣️',
            desc: t('feature5Desc', language)
        },
        {
            title: t('feature6Title', language),
            icon: '👨‍🏫',
            desc: t('feature6Desc', language)
        }
    ]

    const scrollToFeatures = () => {
        document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="landing-container">
            {/* Global Background Image */}
            <div className="hero-bg-overlay"></div>
            <img src={HERO_BG} alt="Farming sunrise" className="hero-bg-img" />

            <Navbar publicNav />

            {/* --- HERO SECTION --- */}
            <section className="landing-hero">
                <div className="hero-content">
                    <div className="hero-pill">{t('newEra', language)}</div>
                    <h1 className="hero-headline">
                        {t('heroHeadline', language)}
                    </h1>
                    <p className="hero-subtext">
                        {t('heroSubtext1', language)}<br/>
                        {t('heroSubtext2', language)}
                    </p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn-solid-green">{t('getStarted', language)}</Link>
                        <Link to="/register/farmer" className="btn-outline-glass">{t('joinAsFarmer', language)}</Link>
                    </div>
                </div>

                <div className="hero-scroll-indicator" onClick={scrollToFeatures}>
                    <span className="scroll-text">{t('exploreFeatures', language)}</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </section>

            {/* --- STATISTICS / PROOFS SECTION --- */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-box">
                        <RollingNumber target={93} suffix="&nbsp;%" />
                        <div className="stat-label">AI Disease Detection<br/>Accuracy</div>
                    </div>
                    <div className="stat-box">
                        <RollingNumber target={39} suffix="+" />
                        <div className="stat-label">Crop &amp; Disease Classes<br/>Supported</div>
                    </div>
                    <div className="stat-box">
                        <RollingNumber target={24} suffix="/7" />
                        <div className="stat-label">Real-Time Weather &amp;<br/>Market Access</div>
                    </div>
                    <div className="stat-box">
                        <RollingNumber target={500} suffix="+" />
                        <div className="stat-label">Certified Agricultural<br/>Experts</div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID SECTION --- */}
            <section id="features-section" className="features-section">
                <div className="features-container">
                    <div className="features-grid">
                        {FEATURES.map((feat, idx) => (
                            <div key={idx} className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <span className="feature-icon">{feat.icon}</span>
                                </div>
                                <h3 className="feature-title">{feat.title}</h3>
                                <p className="feature-desc">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2 className="cta-headline">{t('ctaHeadline', language)}</h2>
                    <Link to="/login" className="btn-solid-green pulse-effect">{t('ctaButton', language)}</Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <Footer />
        </div>
    )
}

export default PublicHome
