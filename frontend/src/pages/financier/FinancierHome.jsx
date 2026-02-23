import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                {CARDS.map(c => (
                    <div key={c.path} onClick={() => navigate(c.path)} style={{
                        flex: '1 1 200px', maxWidth: 260,
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

export default FinancierHome
