import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout'

const CROP_DATA = [
    { region: 'Punjab', crops: ['Wheat', 'Rice', 'Maize', 'Cotton'], soil: 'Alluvial', climate: 'Semi-arid' },
    { region: 'Maharashtra', crops: ['Sugarcane', 'Cotton', 'Soybean', 'Jowar'], soil: 'Black (Regur)', climate: 'Tropical' },
    { region: 'Tamil Nadu', crops: ['Rice', 'Sugarcane', 'Banana', 'Coconut'], soil: 'Red & Alluvial', climate: 'Tropical wet' },
    { region: 'Rajasthan', crops: ['Bajra', 'Jowar', 'Mustard', 'Gram'], soil: 'Sandy & Arid', climate: 'Arid' },
    { region: 'West Bengal', crops: ['Rice', 'Jute', 'Tea', 'Potato'], soil: 'Alluvial', climate: 'Tropical humid' },
    { region: 'Karnataka', crops: ['Coffee', 'Ragi', 'Sunflower', 'Sugarcane'], soil: 'Red & Laterite', climate: 'Semi-arid' },
    { region: 'Andhra Pradesh', crops: ['Rice', 'Tobacco', 'Chillies', 'Cotton'], soil: 'Black & Red', climate: 'Tropical' },
    { region: 'Uttar Pradesh', crops: ['Wheat', 'Rice', 'Sugarcane', 'Potato'], soil: 'Alluvial', climate: 'Subtropical' },
    { region: 'Kerala', crops: ['Rubber', 'Coconut', 'Pepper', 'Cardamom'], soil: 'Laterite', climate: 'Tropical' },
    { region: 'Madhya Pradesh', crops: ['Soybean', 'Wheat', 'Gram', 'Maize'], soil: 'Black & Alluvial', climate: 'Subtropical' },
    { region: 'Gujarat', crops: ['Cotton', 'Groundnut', 'Tobacco', 'Cumin'], soil: 'Black & Sandy', climate: 'Semi-arid' },
    { region: 'Telangana', crops: ['Rice', 'Cotton', 'Turmeric', 'Maize'], soil: 'Red & Black', climate: 'Tropical' },
]

const ACCENT_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#ef4444', '#84cc16', '#e879f9', '#14b8a6', '#f97316', '#6366f1']

const CropSuitabilityMap = () => {
    const [search, setSearch] = useState('')
    const [expanded, setExpanded] = useState(null)

    const filtered = CROP_DATA.filter(item =>
        item.region.toLowerCase().includes(search.toLowerCase()) ||
        item.crops.some(c => c.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <PageLayout role="expert" title="Crop Suitability Map">
            <p style={{ color: '#bbb', fontSize: '0.9rem', marginBottom: 20, maxWidth: 600 }}>
                Explore region-wise crop recommendations across India. Click on a region card to see more details about soil type and climate.
            </p>

            {/* Search */}
            <input
                placeholder="Search by region or crop name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%', maxWidth: 400, padding: '10px 16px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8, color: '#fff', fontSize: '0.88rem', marginBottom: 24,
                    outline: 'none',
                }}
            />

            {/* Region cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {filtered.length === 0 && <p style={{ color: '#888' }}>No regions match your search.</p>}
                {filtered.map((item, idx) => {
                    const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length]
                    const isOpen = expanded === item.region
                    return (
                        <div
                            key={item.region}
                            onClick={() => setExpanded(isOpen ? null : item.region)}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${accent}40`,
                                borderLeft: `4px solid ${accent}`,
                                borderRadius: 10,
                                padding: '18px 20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                transform: isOpen ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: isOpen ? `0 8px 24px ${accent}22` : 'none',
                            }}
                        >
                            <h4 style={{ color: '#fff', marginBottom: 10, fontSize: '1.05rem' }}>
                                📍 {item.region}
                            </h4>

                            {/* Crop tags */}
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: isOpen ? 14 : 0 }}>
                                {item.crops.map(c => (
                                    <span key={c} style={{
                                        background: `${accent}22`,
                                        color: accent,
                                        padding: '3px 10px',
                                        borderRadius: 12,
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                    }}>{c}</span>
                                ))}
                            </div>

                            {/* Expanded details */}
                            {isOpen && (
                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    paddingTop: 12,
                                    marginTop: 4,
                                }}>
                                    <p style={{ color: '#ccc', fontSize: '0.82rem', marginBottom: 4 }}>
                                        🪨 <strong>Soil Type:</strong> {item.soil}
                                    </p>
                                    <p style={{ color: '#ccc', fontSize: '0.82rem' }}>
                                        🌤 <strong>Climate:</strong> {item.climate}
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </PageLayout>
    )
}

export default CropSuitabilityMap
