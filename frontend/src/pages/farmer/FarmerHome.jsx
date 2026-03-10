import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import './FarmerHome.css'

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
            <div className="farmer-home-container">
                <h2 className="farmer-home-title">
                    {t('quickactions')}
                </h2>
                <div className="farmer-home-grid">
                    {ACTIONS.map(a => (
                        <button
                            key={a.path}
                            onClick={() => navigate(a.path)}
                            className="farmer-home-action-btn"
                            style={{ borderTop: `3px solid ${a.color}` }}
                        >
                            <span className="farmer-home-action-icon">{a.icon}</span>
                            <span className="farmer-home-action-label">
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
