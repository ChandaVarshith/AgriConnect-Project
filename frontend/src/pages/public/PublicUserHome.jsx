import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PageLayout from '../../components/PageLayout'

const CARDS = [
    { emoji: '📰', title: 'Explore Content', desc: 'Read expert farming articles', path: '/public/content', accent: '#3b82f6' },
    { emoji: '🌱', title: 'Learn Farming', desc: 'Farming guides and seasonal tips', path: '/public/learn', accent: '#22c55e' },
    { emoji: '🛒', title: 'Buy Resources', desc: 'Browse fresh farm produce', path: '/public/buy', accent: '#f59e0b' },
]

const PublicUserHome = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <PageLayout role="public" title="Public Dashboard">
            <div style={{
                background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: 16, padding: '28px 32px', marginBottom: 36,
            }}>
                <h1 style={{
                    fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2.4rem',
                    fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '0.04em',
                }}>
                    Welcome, {user?.name || 'Explorer'}! 👤
                </h1>
                <p style={{ color: '#c4b5fd', marginTop: 10, fontSize: '0.97rem', fontStyle: 'italic', margin: '10px 0 0' }}>
                    "Agriculture is the most healthful, most useful, and most noble employment of man." — George Washington
                </p>
            </div>

            <h2 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.4rem', marginBottom: 18 }}>
                What would you like to do?
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {CARDS.map(c => (
                    <div key={c.path} onClick={() => navigate(c.path)} style={{
                        flex: '1 1 220px', background: 'rgba(255,255,255,0.07)',
                        border: `1px solid ${c.accent}40`, borderRadius: 14,
                        padding: '28px 22px', cursor: 'pointer', textAlign: 'center',
                        transition: 'all 0.22s',
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${c.accent}18`
                            e.currentTarget.style.transform = 'translateY(-5px)'
                            e.currentTarget.style.boxShadow = `0 12px 28px ${c.accent}33`
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}>
                        <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>{c.emoji}</div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6, fontFamily: "'Barlow Condensed',sans-serif" }}>{c.title}</div>
                        <div style={{ color: '#aaa', fontSize: '0.82rem' }}>{c.desc}</div>
                    </div>
                ))}
            </div>
        </PageLayout>
    )
}

export default PublicUserHome
