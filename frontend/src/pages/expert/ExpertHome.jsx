import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const PHOTO = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop&q=80'

const CARDS = [
    { emoji: '📩', title: 'Farmer Requests', desc: 'View and respond to farmer queries', path: '/expert/requests', accent: '#3b82f6' },
    { emoji: '✍️', title: 'My Responses', desc: 'Track your resolved queries', path: '/expert/responses', accent: '#22c55e' },
    { emoji: '📰', title: 'All Content', desc: 'Browse and manage articles', path: '/expert/content', accent: '#a855f7' },
    { emoji: '➕', title: 'Create Article', desc: 'Publish new farming content', path: '/expert/article/create', accent: '#f59e0b' },
    { emoji: '🛒', title: 'Marketplace', desc: 'Approve or reject farmer produce', path: '/expert/marketplace', accent: '#ec4899' },
    { emoji: '🤖', title: 'Gemini AI', desc: 'Get AI-powered agriculture insights', path: '/expert/gemini', accent: '#06b6d4' },
    { emoji: '🗺️', title: 'Crop Map', desc: 'Explore interactive suitability map', path: '/expert/crop-map', accent: '#84cc16' },
]

const ExpertHome = () => {
    const navigate = useNavigate()
    return (
        <DashboardLayout
            role="expert"
            photoUrl={PHOTO}
            welcomeText="WELCOME, EXPERT!!"
            subText="Thank you for being a vital part of the AgriConnect community. Continue managing resources, guiding users, and driving impactful decisions to support farming excellence."
        >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                {CARDS.map(c => (
                    <div key={c.path} onClick={() => navigate(c.path)} style={{
                        flex: '1 1 200px', maxWidth: 240,
                        background: 'rgba(255,255,255,0.08)',
                        border: `1px solid ${c.accent}40`,
                        borderRadius: 14, padding: '26px 20px',
                        cursor: 'pointer', textAlign: 'center',
                        transition: 'all 0.22s',
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${c.accent}18`
                            e.currentTarget.style.transform = 'translateY(-5px)'
                            e.currentTarget.style.boxShadow = `0 12px 28px ${c.accent}33`
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}>
                        <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{c.emoji}</div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.98rem', marginBottom: 5, fontFamily: "'Barlow Condensed',sans-serif" }}>{c.title}</div>
                        <div style={{ color: '#aaa', fontSize: '0.78rem' }}>{c.desc}</div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    )
}

export default ExpertHome
