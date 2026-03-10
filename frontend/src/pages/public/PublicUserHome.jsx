import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import './PublicUserHome.css'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const ACTIONS = [
    { label: 'Explore Content', path: '/public/content', icon: '📰', color: '#2563eb' },
    { label: 'Learn Farming', path: '/public/learn', icon: '🌱', color: '#16a34a' },
    { label: 'Buy Resources', path: '/public/buy', icon: '🛒', color: '#e02020' },
]

const PublicUserHome = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <DashboardLayout
            role="public"
            photoUrl={BG}
            welcomeText={`Welcome, ${user?.name || 'Public User'}!`}
            subText='"Agriculture is the most healthful, most useful, and most noble employment of man." — George Washington'
        >
            <div className="public-user-home-container">
                <h2 className="public-user-home-title">
                    WHAT WOULD YOU LIKE TO DO?
                </h2>
                <div className="public-user-home-grid">
                    {ACTIONS.map(a => (
                        <button
                            key={a.path}
                            onClick={() => navigate(a.path)}
                            className="public-user-home-action-btn"
                            style={{ borderTop: `3px solid ${a.color}` }}
                        >
                            <span className="public-user-home-action-icon">{a.icon}</span>
                            <span className="public-user-home-action-label">
                                {a.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default PublicUserHome
