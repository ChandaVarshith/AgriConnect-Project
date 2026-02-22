import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80'

const ACTIONS = [
    { labelKey: 'sendcropsuggestionrequest', path: '/farmer/query', icon: '🌾', color: '#16a34a' },
    { labelKey: 'viewallresponses', path: '/farmer/responses', icon: '💬', color: '#2563eb' },
    { labelKey: 'viewallloans', path: '/farmer/loans', icon: '🏦', color: '#d97706' },
    { labelKey: 'explorefarmingcontent', path: '/farmer/articles', icon: '📰', color: '#7c3aed' },
    { labelKey: 'sellyourproduce', path: '/farmer/marketplace', icon: '🛒', color: '#e02020' },
]

const FarmerHome = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()

    return (
        <DashboardLayout
            role="farmer"
            photoUrl={BG}
            welcomeText={t('welcomefarmer')}
            subText={t('farmerinspirationquote')}
        >
            {/* Quick-action cards below the hero */}
            <div style={{
                padding: '0 0 60px',
            }}>
                <h2 style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1.4rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    marginBottom: 20,
                }}>
                    {t('quickactions')}
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 16,
                }}>
                    {ACTIONS.map(a => (
                        <button key={a.path} onClick={() => navigate(a.path)} style={{
                            background: 'rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid rgba(255,255,255,0.12)`,
                            borderTop: `3px solid ${a.color}`,
                            borderRadius: 12,
                            padding: '20px 18px',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'flex-start', gap: 10,
                            cursor: 'pointer', textAlign: 'left',
                            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.6)`
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>{a.icon}</span>
                            <span style={{
                                color: '#e5e5e5', fontSize: '0.82rem',
                                fontWeight: 600, lineHeight: 1.35,
                                letterSpacing: '0.01em',
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                {t(a.labelKey)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default FarmerHome
