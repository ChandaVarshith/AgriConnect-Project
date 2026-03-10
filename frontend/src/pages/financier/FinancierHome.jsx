import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import './FinancierHome.css'

const PHOTO = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80'

const CARDS = [
    { emoji: '➕', title: 'Add Loan', desc: 'Create a new loan product', path: '/financier/add-loan', accent: '#22c55e' },
    { emoji: '📋', title: 'Loan Requests', desc: 'Review farmer applications', path: '/financier/loan-requests', accent: '#3b82f6' },
    { emoji: '📊', title: 'All Loans', desc: 'View and manage all products', path: '/financier/all-loans', accent: '#f59e0b' },
    { emoji: '👨‍🌾', title: 'Farmer Portfolio', desc: 'Applications grouped by farmer', path: '/financier/farmer-loans', accent: '#a855f7' },
]

const FinancierHome = () => {
    const navigate = useNavigate()
    return (
        <DashboardLayout
            role="financier"
            photoUrl={PHOTO}
            welcomeText="WELCOME, FINANCIER!!"
            subText="Thank you for being a vital part of the AgriConnect community. Continue managing resources, guiding users, and driving impactful decisions to support farming excellence."
        >
            <div className="financier-home-cards-container">
                {CARDS.map(c => (
                    <div key={c.path} onClick={() => navigate(c.path)}
                        className="financier-home-card"
                        style={{ border: `1px solid ${c.accent}40` }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${c.accent}18`
                            e.currentTarget.style.boxShadow = `0 12px 28px ${c.accent}33`
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}>
                        <div className="financier-home-emoji">{c.emoji}</div>
                        <div className="financier-home-title">{c.title}</div>
                        <div className="financier-home-desc">{c.desc}</div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    )
}

export default FinancierHome
