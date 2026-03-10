import React from 'react'
import PageLayout from '../../components/PageLayout'
import './PublicLearnFarming.css'

const TOPICS = [
    {
        icon: '🌾', title: 'Seasonal Farming Guide',
        tips: [
            'Kharif (June–Nov): Paddy, Maize, Sorghum, Cotton, Groundnut',
            'Rabi (Nov–Apr): Wheat, Barley, Mustard, Chickpea, Lentil',
            'Zaid (Apr–Jun): Watermelon, Cucumber, Muskmelon',
            'Always consult local agricultural extension for variety selection.',
        ],
        theme: 'green',
    },
    {
        icon: '💧', title: 'Irrigation Best Practices',
        tips: [
            'Drip irrigation saves up to 50% water vs flood irrigation.',
            'Water early morning to minimize evaporation losses.',
            'Monitor soil moisture with low-cost tensiometers.',
            'Avoid waterlogging — it reduces oxygen to roots.',
        ],
        theme: 'blue',
    },
    {
        icon: '🌱', title: 'Soil Health & Nutrients',
        tips: [
            'Test your soil every 2–3 years for NPK and pH levels.',
            'Compost and green manure improve organic matter.',
            'Nitrogen fixation: legume cover crops reduce fertilizer costs.',
            'Ideal soil pH: 6–7 for most crops.',
        ],
        theme: 'orange',
    },
    {
        icon: '🐛', title: 'Pest & Disease Management',
        tips: [
            'IPM (Integrated Pest Management) combines bio and chemical controls.',
            'Inspect crops weekly — early detection saves losses.',
            'Neem oil spray is effective against aphids and whiteflies.',
            'Crop rotation disrupts pest life cycles.',
        ],
        theme: 'red',
    },
    {
        icon: '🤝', title: 'Government Schemes',
        tips: [
            'PM-Kisan: ₹6,000/year direct income support for farmers.',
            'Fasal Bima Yojana: Crop insurance against natural calamities.',
            'Kisan Credit Card: Low-interest credit for farm inputs.',
            'PM Krishi Sinchai Yojana: Subsidized irrigation infrastructure.',
        ],
        theme: 'purple',
    },
    {
        icon: '📈', title: 'Market & Pricing',
        tips: [
            'Check MSP (Minimum Support Price) before selling.',
            'eNAM (National Agriculture Market) offers online trading.',
            'FPOs (Farmer Producer Organisations) improve bargaining power.',
            'Grading and packaging increase market price by 20–40%.',
        ],
        theme: 'pink',
    },
]

const PublicLearnFarming = () => {
    return (
        <PageLayout role="public" title="Learn Farming">
            <div className="public-learn-header">
                <h2 className="public-learn-title">
                    Agricultural Learning Hub 🌾
                </h2>
                <p className="public-learn-subtitle">
                    Curated knowledge on modern farming practices, government schemes, and market insights.
                </p>
            </div>
            <div className="public-learn-grid">
                {TOPICS.map(t => (
                    <div key={t.title} className={`public-learn-card theme-${t.theme}`}>
                        <div className="public-learn-card-header">
                            <span className="public-learn-card-icon">{t.icon}</span>
                            <h3 className="public-learn-card-title">{t.title}</h3>
                        </div>
                        <ul className="public-learn-card-list">
                            {t.tips.map((tip, i) => (
                                <li key={i} className="public-learn-card-list-item">
                                    <span className="public-learn-card-bullet">▸</span>
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
