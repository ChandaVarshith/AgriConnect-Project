import React from 'react'
import PageLayout from '../../components/PageLayout'

const TOPICS = [
    {
        icon: '🌾', title: 'Seasonal Farming Guide',
        tips: [
            'Kharif (June–Nov): Paddy, Maize, Sorghum, Cotton, Groundnut',
            'Rabi (Nov–Apr): Wheat, Barley, Mustard, Chickpea, Lentil',
            'Zaid (Apr–Jun): Watermelon, Cucumber, Muskmelon',
            'Always consult local agricultural extension for variety selection.',
        ],
        accent: '#22c55e',
    },
    {
        icon: '💧', title: 'Irrigation Best Practices',
        tips: [
            'Drip irrigation saves up to 50% water vs flood irrigation.',
            'Water early morning to minimize evaporation losses.',
            'Monitor soil moisture with low-cost tensiometers.',
            'Avoid waterlogging — it reduces oxygen to roots.',
        ],
        accent: '#3b82f6',
    },
    {
        icon: '🌱', title: 'Soil Health & Nutrients',
        tips: [
            'Test your soil every 2–3 years for NPK and pH levels.',
            'Compost and green manure improve organic matter.',
            'Nitrogen fixation: legume cover crops reduce fertilizer costs.',
            'Ideal soil pH: 6–7 for most crops.',
        ],
        accent: '#f59e0b',
    },
    {
        icon: '🐛', title: 'Pest & Disease Management',
        tips: [
            'IPM (Integrated Pest Management) combines bio and chemical controls.',
            'Inspect crops weekly — early detection saves losses.',
            'Neem oil spray is effective against aphids and whiteflies.',
            'Crop rotation disrupts pest life cycles.',
        ],
        accent: '#ef4444',
    },
    {
        icon: '🤝', title: 'Government Schemes',
        tips: [
            'PM-Kisan: ₹6,000/year direct income support for farmers.',
            'Fasal Bima Yojana: Crop insurance against natural calamities.',
            'Kisan Credit Card: Low-interest credit for farm inputs.',
            'PM Krishi Sinchai Yojana: Subsidized irrigation infrastructure.',
        ],
        accent: '#a855f7',
    },
    {
        icon: '📈', title: 'Market & Pricing',
        tips: [
            'Check MSP (Minimum Support Price) before selling.',
            'eNAM (National Agriculture Market) offers online trading.',
            'FPOs (Farmer Producer Organisations) improve bargaining power.',
            'Grading and packaging increase market price by 20–40%.',
        ],
        accent: '#ec4899',
    },
]

const PublicLearnFarming = () => {
    return (
        <PageLayout role="public" title="Learn Farming">
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.6rem', margin: '0 0 6px' }}>
                    Agricultural Learning Hub 🌾
                </h2>
                <p style={{ color: '#aaa', fontSize: '0.88rem', margin: 0 }}>
                    Curated knowledge on modern farming practices, government schemes, and market insights.
                </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
                {TOPICS.map(t => (
                    <div key={t.title} style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${t.accent}30`,
                        borderRadius: 14, padding: '24px 22px',
                        transition: 'all 0.22s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${t.accent}14`; e.currentTarget.style.borderColor = `${t.accent}70` }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = `${t.accent}30` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <span style={{ fontSize: '1.8rem' }}>{t.icon}</span>
                            <h3 style={{ color: '#fff', margin: 0, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.15rem' }}>{t.title}</h3>
                        </div>
                        <ul style={{ margin: 0, padding: '0 0 0 18px', listStyle: 'none' }}>
                            {t.tips.map((tip, i) => (
                                <li key={i} style={{ color: '#ccc', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: 7, paddingLeft: 0, display: 'flex', gap: 8 }}>
                                    <span style={{ color: t.accent, marginTop: 2, flexShrink: 0 }}>▸</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </PageLayout>
    )
}

export default PublicLearnFarming
