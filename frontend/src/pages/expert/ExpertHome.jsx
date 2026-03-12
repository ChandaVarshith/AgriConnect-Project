import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import './ExpertHome.css'

const PHOTO = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop&q=80'

const CARDS = [
    { emoji: '📩', title: 'Farmer Requests', desc: 'View and respond to farmer queries', path: '/expert/requests', accent: '#3b82f6' },
    { emoji: '✍️', title: 'My Responses', desc: 'Track your resolved queries', path: '/expert/responses', accent: '#22c55e' },
    { emoji: '🔍', title: 'Disease Detection', desc: 'Upload a crop image to detect disease', path: '/expert/disease-detection', accent: '#06b6d4' },
    { emoji: '📰', title: 'All Content', desc: 'Browse and manage articles', path: '/expert/content', accent: '#a855f7' },
    { emoji: '➕', title: 'Create Article', desc: 'Publish new farming content', path: '/expert/article/create', accent: '#f59e0b' },
    { emoji: '🛒', title: 'Marketplace', desc: 'Approve or reject farmer produce', path: '/expert/marketplace', accent: '#ec4899' },
    { emoji: '🤖', title: 'Gemini AI', desc: 'Get AI-powered agriculture insights', path: '/expert/gemini', accent: '#84cc16' },
    { emoji: '🗺️', title: 'Crop Map', desc: 'Explore interactive suitability map', path: '/expert/crop-map', accent: '#e02020' },
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
            <div className="expert-home-grid">
                {CARDS.map(c => (
                    <div
                        key={c.path}
                        onClick={() => navigate(c.path)}
                        className="expert-home-card"
                        style={{
                            '--accent-light': `${c.accent}40`,
                            '--accent-hover': `${c.accent}18`,
                            '--accent-shadow': `${c.accent}33`
                        }}
                    >
                        <div className="expert-home-emoji">{c.emoji}</div>
                        <div className="expert-home-card-title">{c.title}</div>
                        <div className="expert-home-card-desc">{c.desc}</div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    )
}

export default ExpertHome
